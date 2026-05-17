// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {
    ERC20
} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {BucketFlowVault} from "src/BucketFlowVault.sol";

contract MockStablecoin is ERC20 {
    constructor() ERC20("Mock USD", "mUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract FeeOnTransferMockStablecoin is ERC20 {
    uint256 internal constant FEE_BPS = 200; // 2%

    constructor() ERC20("Fee Mock USD", "fmUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        _transferWithFee(_msgSender(), to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        _spendAllowance(from, _msgSender(), amount);
        _transferWithFee(from, to, amount);
        return true;
    }

    function _transferWithFee(address from, address to, uint256 amount) internal {
        uint256 fee = (amount * FEE_BPS) / 10_000;
        uint256 amountAfterFee = amount - fee;

        _burn(from, fee);
        _transfer(from, to, amountAfterFee);
    }
}

contract ZeroTransferMockStablecoin is ERC20 {
    constructor() ERC20("Zero Transfer USD", "ztUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function transferFrom(
        address from,
        address,
        uint256 amount
    ) public override returns (bool) {
        _spendAllowance(from, _msgSender(), amount);
        return true;
    }
}

contract ReentrantStablecoin is ERC20 {
    BucketFlowVault internal vault;
    address internal attacker;
    uint8 internal targetBucket;
    uint256 internal targetAmount;
    bool internal shouldReenter;

    constructor() ERC20("Reentrant Mock USD", "rmUSD") {}

    function setVault(BucketFlowVault vault_) external {
        vault = vault_;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function configureAttack(
        address attacker_,
        uint8 bucket_,
        uint256 amount_
    ) external {
        attacker = attacker_;
        targetBucket = bucket_;
        targetAmount = amount_;
    }

    function armAttack() external {
        shouldReenter = true;
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        if (shouldReenter && _msgSender() == address(vault) && to == attacker) {
            shouldReenter = false;
            ReentrantAttacker(attacker).reenterWithdraw(targetBucket, targetAmount);
        }

        return super.transfer(to, amount);
    }
}

contract ReentrantAttacker {
    BucketFlowVault internal immutable vault;
    ReentrantStablecoin internal immutable token;

    constructor(BucketFlowVault vault_, ReentrantStablecoin token_) {
        vault = vault_;
        token = token_;
    }

    function setupAndDeposit(
        uint16 rentBps,
        uint16 savingsBps,
        uint16 taxBps,
        uint16 familySupportBps,
        uint16 cashOutBps,
        uint256 amount
    ) external {
        vault.setSplitRule(
            rentBps,
            savingsBps,
            taxBps,
            familySupportBps,
            cashOutBps
        );
        token.approve(address(vault), amount);
        vault.deposit(amount);
    }

    function attackWithdraw(uint8 bucket, uint256 amount) external {
        token.armAttack();
        vault.withdraw(bucket, amount);
    }

    function reenterWithdraw(uint8 bucket, uint256 amount) external {
        require(msg.sender == address(token), "only token");
        vault.withdraw(bucket, amount);
    }
}

abstract contract BucketFlowVaultTestBase is Test {
    MockStablecoin internal stablecoin;
    BucketFlowVault internal vault;

    address internal user = address(0x1);
    address internal otherUser = address(0x2);

    uint16 internal constant RULE_RENT = 2789;
    uint16 internal constant RULE_SAVINGS = 1987;
    uint16 internal constant RULE_TAX = 1433;
    uint16 internal constant RULE_FAMILY = 1901;
    uint16 internal constant RULE_CASHOUT = 1890;

    function setUp() public virtual {
        stablecoin = new MockStablecoin();
        vault = new BucketFlowVault(address(stablecoin));
    }

    function _setComplicatedRule(address actor) internal {
        vm.prank(actor);
        vault.setSplitRule(
            RULE_RENT,
            RULE_SAVINGS,
            RULE_TAX,
            RULE_FAMILY,
            RULE_CASHOUT
        );
    }

    function _mintApproveAndDeposit(address actor, uint256 amount) internal {
        stablecoin.mint(actor, amount);

        vm.startPrank(actor);
        stablecoin.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();
    }
}
