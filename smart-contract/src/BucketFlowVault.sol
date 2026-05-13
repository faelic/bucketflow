// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {
    IERC20
} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {
    ReentrancyGuard
} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

contract BucketFlowVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error InvalidStablecoinAddress();
    error InvalidSplitRuleTotal();
    error AmountMustBeGreaterThanZero();
    error SplitRuleNotSet();
    error InvalidBucket();
    error InsufficientBucketBalance();
    error SavingsCooldownActive(uint256 nextAllowedAt);
    error ZeroTokensReceived();

    enum Bucket {
        Rent,
        Savings,
        Tax,
        FamilySupport,
        CashOut
    }

    struct SplitRule {
        uint16 rentBps;
        uint16 savingsBps;
        uint16 taxBps;
        uint16 familySupportBps;
        uint16 cashOutBps;
    }

    struct BucketBalances {
        uint256 rent;
        uint256 savings;
        uint256 tax;
        uint256 familySupport;
        uint256 cashOut;
    }

    IERC20 public immutable stablecoin;

    mapping(address => SplitRule) private splitRules;
    mapping(address => BucketBalances) private bucketBalances;
    mapping(address => uint256) private lastSavingsWithdrawalAt;

    event SplitRuleUpdated(
        address indexed user,
        uint16 rentBps,
        uint16 savingsBps,
        uint16 taxBps,
        uint16 familySupportBps,
        uint16 cashOutBps
    );

    event Deposited(address indexed user, uint256 amount);

    event IncomeAllocated(
        address indexed user,
        uint256 rent,
        uint256 savings,
        uint256 tax,
        uint256 familySupport,
        uint256 cashOut
    );

    event Withdrawn(address indexed user, uint8 bucket, uint256 amount);

    constructor(address stablecoinAddress) {
        if (stablecoinAddress == address(0)) {
            revert InvalidStablecoinAddress();
        }

        stablecoin = IERC20(stablecoinAddress);
    }

    function setSplitRule(
        uint16 rentBps,
        uint16 savingsBps,
        uint16 taxBps,
        uint16 familySupportBps,
        uint16 cashOutBps
    ) external {
        uint256 totalBps = uint256(rentBps) +
            uint256(savingsBps) +
            uint256(taxBps) +
            uint256(familySupportBps) +
            uint256(cashOutBps);

        if (totalBps != 10_000) {
            revert InvalidSplitRuleTotal();
        }

        splitRules[msg.sender] = SplitRule({
            rentBps: rentBps,
            savingsBps: savingsBps,
            taxBps: taxBps,
            familySupportBps: familySupportBps,
            cashOutBps: cashOutBps
        });

        emit SplitRuleUpdated(
            msg.sender,
            rentBps,
            savingsBps,
            taxBps,
            familySupportBps,
            cashOutBps
        );
    }

    function getSplitRule(
        address user
    )
        external
        view
        returns (
            uint16 rentBps,
            uint16 savingsBps,
            uint16 taxBps,
            uint16 familySupportBps,
            uint16 cashOutBps
        )
    {
        SplitRule memory rule = splitRules[user];

        return (
            rule.rentBps,
            rule.savingsBps,
            rule.taxBps,
            rule.familySupportBps,
            rule.cashOutBps
        );
    }

    function getBucketBalances(
        address user
    )
        external
        view
        returns (
            uint256 rent,
            uint256 savings,
            uint256 tax,
            uint256 familySupport,
            uint256 cashOut
        )
    {
        BucketBalances memory balances = bucketBalances[user];

        return (
            balances.rent,
            balances.savings,
            balances.tax,
            balances.familySupport,
            balances.cashOut
        );
    }

    function getSavingsCooldown(
        address user
    ) external view returns (uint256 lastWithdrawalAt, uint256 nextAllowedAt) {
        lastWithdrawalAt = lastSavingsWithdrawalAt[user];

        if (lastWithdrawalAt == 0) {
            return (0, 0);
        }

        nextAllowedAt = lastWithdrawalAt + 30 days;
    }

    function _isSplitRuleSet(address user) internal view returns (bool) {
        SplitRule memory rule = splitRules[user];

        uint256 totalBps = uint256(rule.rentBps) +
            uint256(rule.savingsBps) +
            uint256(rule.taxBps) +
            uint256(rule.familySupportBps) +
            uint256(rule.cashOutBps);

        return totalBps == 10_000;
    }

    function _getBucketBalance(
        BucketBalances storage balances,
        Bucket bucket
    ) internal view returns (uint256) {
        if (bucket == Bucket.Rent) {
            return balances.rent;
        } else if (bucket == Bucket.Savings) {
            return balances.savings;
        } else if (bucket == Bucket.Tax) {
            return balances.tax;
        } else if (bucket == Bucket.FamilySupport) {
            return balances.familySupport;
        } else {
            return balances.cashOut;
        }
    }

    function _decreaseBucketBalance(
        BucketBalances storage balances,
        Bucket bucket,
        uint256 amount
    ) internal {
        if (bucket == Bucket.Rent) {
            balances.rent -= amount;
        } else if (bucket == Bucket.Savings) {
            balances.savings -= amount;
        } else if (bucket == Bucket.Tax) {
            balances.tax -= amount;
        } else if (bucket == Bucket.FamilySupport) {
            balances.familySupport -= amount;
        } else {
            balances.cashOut -= amount;
        }
    }

    function deposit(uint256 amount) external {
        if (amount == 0) {
            revert AmountMustBeGreaterThanZero();
        }

        if (!_isSplitRuleSet(msg.sender)) {
            revert SplitRuleNotSet();
        }

        uint256 balanceBefore = stablecoin.balanceOf(address(this));
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        uint256 balanceAfter = stablecoin.balanceOf(address(this));
        uint256 actualReceived = balanceAfter - balanceBefore;

        if (actualReceived == 0) {
            revert ZeroTokensReceived();
        }

        SplitRule memory rule = splitRules[msg.sender];

        uint256 rentAmount = (actualReceived * rule.rentBps) / 10_000;
        uint256 savingsAmount = (actualReceived * rule.savingsBps) / 10_000;
        uint256 taxAmount = (actualReceived * rule.taxBps) / 10_000;
        uint256 familySupportAmount = (actualReceived *
            rule.familySupportBps) / 10_000;
        uint256 cashOutAmount = (actualReceived * rule.cashOutBps) / 10_000;

        uint256 allocatedTotal = rentAmount +
            savingsAmount +
            taxAmount +
            familySupportAmount +
            cashOutAmount;

        uint256 remainder = actualReceived - allocatedTotal;
        savingsAmount += remainder;

        BucketBalances storage balances = bucketBalances[msg.sender];
        balances.rent += rentAmount;
        balances.savings += savingsAmount;
        balances.tax += taxAmount;
        balances.familySupport += familySupportAmount;
        balances.cashOut += cashOutAmount;

        emit Deposited(msg.sender, actualReceived);

        emit IncomeAllocated(
            msg.sender,
            rentAmount,
            savingsAmount,
            taxAmount,
            familySupportAmount,
            cashOutAmount
        );
    }

    function withdraw(uint8 bucket, uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert AmountMustBeGreaterThanZero();
        }

        if (bucket > uint8(Bucket.CashOut)) {
            revert InvalidBucket();
        }

        Bucket selectedBucket = Bucket(bucket);
        BucketBalances storage balances = bucketBalances[msg.sender];

        if (_getBucketBalance(balances, selectedBucket) < amount) {
            revert InsufficientBucketBalance();
        }

        if (selectedBucket == Bucket.Savings) {
            uint256 lastWithdrawalAt = lastSavingsWithdrawalAt[msg.sender];

            if (lastWithdrawalAt != 0) {
                uint256 nextAllowedAt = lastWithdrawalAt + 30 days;

                if (block.timestamp < nextAllowedAt) {
                    revert SavingsCooldownActive(nextAllowedAt);
                }
            }
        }

        _decreaseBucketBalance(balances, selectedBucket, amount);

        if (selectedBucket == Bucket.Savings) {
            lastSavingsWithdrawalAt[msg.sender] = block.timestamp;
        }

        stablecoin.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, bucket, amount);
    }
}
