// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {
    ERC20
} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

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

contract BucketFlowVaultTest is Test {
    MockStablecoin internal stablecoin;
    BucketFlowVault internal vault;

    address internal user = address(0x1);
    address internal otherUser = address(0x2);

    uint16 internal constant RULE_RENT = 2789;
    uint16 internal constant RULE_SAVINGS = 1987;
    uint16 internal constant RULE_TAX = 1433;
    uint16 internal constant RULE_FAMILY = 1901;
    uint16 internal constant RULE_CASHOUT = 1890;

    function setUp() public {
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

    function test_ConstructorSetsStablecoin() public view {
        assertEq(address(vault.stablecoin()), address(stablecoin));
    }

    function test_ConstructorRevertsForZeroStablecoinAddress() public {
        vm.expectRevert(BucketFlowVault.InvalidStablecoinAddress.selector);
        new BucketFlowVault(address(0));
    }

    function test_SetSplitRuleStoresValidRule() public {
        vm.prank(user);
        vault.setSplitRule(3333, 2222, 1111, 1667, 1667);

        (
            uint16 rentBps,
            uint16 savingsBps,
            uint16 taxBps,
            uint16 familySupportBps,
            uint16 cashOutBps
        ) = vault.getSplitRule(user);

        assertEq(rentBps, 3333);
        assertEq(savingsBps, 2222);
        assertEq(taxBps, 1111);
        assertEq(familySupportBps, 1667);
        assertEq(cashOutBps, 1667);
    }

    function test_SetSplitRuleRevertsWhenTotalIsNotTenThousand() public {
        vm.prank(user);
        vm.expectRevert(BucketFlowVault.InvalidSplitRuleTotal.selector);
        vault.setSplitRule(2789, 1987, 1433, 1901, 1889);
    }

    function test_SetSplitRuleIsIsolatedPerUser() public {
        vm.prank(user);
        vault.setSplitRule(3333, 2222, 1111, 1667, 1667);

        vm.prank(otherUser);
        vault.setSplitRule(2789, 1987, 1433, 1901, 1890);

        (
            uint16 userRentBps,
            uint16 userSavingsBps,
            uint16 userTaxBps,
            uint16 userFamilySupportBps,
            uint16 userCashOutBps
        ) = vault.getSplitRule(user);

        (
            uint16 otherRentBps,
            uint16 otherSavingsBps,
            uint16 otherTaxBps,
            uint16 otherFamilySupportBps,
            uint16 otherCashOutBps
        ) = vault.getSplitRule(otherUser);

        assertEq(userRentBps, 3333);
        assertEq(userSavingsBps, 2222);
        assertEq(userTaxBps, 1111);
        assertEq(userFamilySupportBps, 1667);
        assertEq(userCashOutBps, 1667);

        assertEq(otherRentBps, 2789);
        assertEq(otherSavingsBps, 1987);
        assertEq(otherTaxBps, 1433);
        assertEq(otherFamilySupportBps, 1901);
        assertEq(otherCashOutBps, 1890);
    }

    function test_DepositRevertsWhenSplitRuleIsNotSet() public {
        uint256 depositAmount = 1003;

        stablecoin.mint(user, depositAmount);

        vm.startPrank(user);
        stablecoin.approve(address(vault), depositAmount);

        vm.expectRevert(BucketFlowVault.SplitRuleNotSet.selector);
        vault.deposit(depositAmount);
        vm.stopPrank();
    }

    function test_DepositAllocatesBucketBalancesCorrectly() public {
        uint256 depositAmount = 1003;

        vm.prank(user);
        vault.setSplitRule(2789, 1987, 1433, 1901, 1890);

        stablecoin.mint(user, depositAmount);

        vm.startPrank(user);
        stablecoin.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);
        vm.stopPrank();

        (
            uint256 rent,
            uint256 savings,
            uint256 tax,
            uint256 familySupport,
            uint256 cashOut
        ) = vault.getBucketBalances(user);

        assertEq(rent, 279);
        assertEq(savings, 202);
        assertEq(tax, 143);
        assertEq(familySupport, 190);
        assertEq(cashOut, 189);

        assertEq(
            rent + savings + tax + familySupport + cashOut,
            depositAmount
        );
    }

    function test_DepositAssignsRemainderToSavings() public {
        uint256 depositAmount = 101;

        vm.prank(user);
        vault.setSplitRule(2789, 1987, 1433, 1901, 1890);

        stablecoin.mint(user, depositAmount);

        vm.startPrank(user);
        stablecoin.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);
        vm.stopPrank();

        (
            uint256 rent,
            uint256 savings,
            uint256 tax,
            uint256 familySupport,
            uint256 cashOut
        ) = vault.getBucketBalances(user);

        assertEq(rent, 28);
        assertEq(savings, 21);
        assertEq(tax, 14);
        assertEq(familySupport, 19);
        assertEq(cashOut, 19);
    }

    function test_WithdrawRevertsWhenBucketBalanceIsInsufficient() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.expectRevert(BucketFlowVault.InsufficientBucketBalance.selector);
        vm.prank(user);
        vault.withdraw(4, 190);
    }

    function test_DepositRevertsWhenAmountIsZero() public {
        _setComplicatedRule(user);

        vm.expectRevert(BucketFlowVault.AmountMustBeGreaterThanZero.selector);
        vm.prank(user);
        vault.deposit(0);
    }

    function test_WithdrawRevertsWhenAmountIsZero() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.expectRevert(BucketFlowVault.AmountMustBeGreaterThanZero.selector);
        vm.prank(user);
        vault.withdraw(4, 0);
    }

    function test_WithdrawRevertsWhenBucketIsInvalid() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.expectRevert(BucketFlowVault.InvalidBucket.selector);
        vm.prank(user);
        vault.withdraw(7, 19);
    }

    function test_WithdrawReducesBucketAndTransfersTokens() public {
        uint256 depositAmount = 1003;
        uint256 withdrawAmount = 137;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.prank(user);
        vault.withdraw(4, withdrawAmount);

        (
            uint256 rent,
            uint256 savings,
            uint256 tax,
            uint256 familySupport,
            uint256 cashOut
        ) = vault.getBucketBalances(user);

        assertEq(rent, 279);
        assertEq(savings, 202);
        assertEq(tax, 143);
        assertEq(familySupport, 190);
        assertEq(cashOut, 52);

        assertEq(stablecoin.balanceOf(user), withdrawAmount);
    }

    function test_SavingsWithdrawRevertsBeforeCooldownExpires() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.warp(10 days);

        vm.prank(user);
        vault.withdraw(1, 57);

        (uint256 lastWithdrawalAt, uint256 nextAllowedAt) = vault
            .getSavingsCooldown(user);

        assertEq(lastWithdrawalAt, block.timestamp);
        assertEq(nextAllowedAt, block.timestamp + 30 days);

        vm.expectRevert(
            abi.encodeWithSelector(
                BucketFlowVault.SavingsCooldownActive.selector,
                nextAllowedAt
            )
        );
        vm.prank(user);
        vault.withdraw(1, 13);
    }

    function test_SavingsWithdrawSucceedsAfterCooldownExpires() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.warp(17 days);

        vm.prank(user);
        vault.withdraw(1, 57);

        (, uint256 nextAllowedAt) = vault.getSavingsCooldown(user);

        vm.warp(nextAllowedAt);

        vm.prank(user);
        vault.withdraw(1, 23);

        (, uint256 savings, , , ) = vault.getBucketBalances(user);

        assertEq(savings, 122);
        assertEq(stablecoin.balanceOf(user), 80);
    }

    function test_NonSavingsWithdrawIsNotBlockedBySavingsCooldown() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.warp(21 days);

        vm.prank(user);
        vault.withdraw(1, 57);

        vm.expectRevert(BucketFlowVault.InsufficientBucketBalance.selector);
        vm.prank(user);
        vault.withdraw(2, 144);

        vm.prank(user);
        vault.withdraw(2, 97);

        (, uint256 savings, uint256 tax, , ) = vault.getBucketBalances(user);

        assertEq(savings, 145);
        assertEq(tax, 46);
    }

    function test_BucketBalancesTrackDepositsMinusWithdrawals() public {
        uint256 firstDeposit = 1003;
        uint256 secondDeposit = 101;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, firstDeposit);
        _mintApproveAndDeposit(user, secondDeposit);

        vm.prank(user);
        vault.withdraw(4, 137);

        (
            uint256 rent,
            uint256 savings,
            uint256 tax,
            uint256 familySupport,
            uint256 cashOut
        ) = vault.getBucketBalances(user);

        assertEq(rent, 307);
        assertEq(savings, 223);
        assertEq(tax, 157);
        assertEq(familySupport, 209);
        assertEq(cashOut, 71);

        assertEq(
            rent + savings + tax + familySupport + cashOut,
            firstDeposit + secondDeposit - 137
        );
    }

    function test_UserBalancesRemainIsolatedAcrossDepositsAndWithdrawals() public {
        uint256 userDeposit = 1003;
        uint256 otherDeposit = 101;

        _setComplicatedRule(user);
        _setComplicatedRule(otherUser);

        _mintApproveAndDeposit(user, userDeposit);
        _mintApproveAndDeposit(otherUser, otherDeposit);

        vm.prank(user);
        vault.withdraw(4, 137);

        (
            uint256 userRent,
            uint256 userSavings,
            uint256 userTax,
            uint256 userFamilySupport,
            uint256 userCashOut
        ) = vault.getBucketBalances(user);

        (
            uint256 otherRent,
            uint256 otherSavings,
            uint256 otherTax,
            uint256 otherFamilySupport,
            uint256 otherCashOut
        ) = vault.getBucketBalances(otherUser);

        assertEq(userRent, 279);
        assertEq(userSavings, 202);
        assertEq(userTax, 143);
        assertEq(userFamilySupport, 190);
        assertEq(userCashOut, 52);

        assertEq(otherRent, 28);
        assertEq(otherSavings, 21);
        assertEq(otherTax, 14);
        assertEq(otherFamilySupport, 19);
        assertEq(otherCashOut, 19);
    }

    function test_EmitsSplitRuleUpdated() public {
        vm.expectEmit(true, false, false, true);
        emit BucketFlowVault.SplitRuleUpdated(
            user,
            RULE_RENT,
            RULE_SAVINGS,
            RULE_TAX,
            RULE_FAMILY,
            RULE_CASHOUT
        );

        vm.prank(user);
        vault.setSplitRule(
            RULE_RENT,
            RULE_SAVINGS,
            RULE_TAX,
            RULE_FAMILY,
            RULE_CASHOUT
        );
    }

    function test_EmitsDepositedAndIncomeAllocated() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        stablecoin.mint(user, depositAmount);

        vm.startPrank(user);
        stablecoin.approve(address(vault), depositAmount);

        vm.expectEmit(true, false, false, true);
        emit BucketFlowVault.Deposited(user, 1003);

        vm.expectEmit(true, false, false, true);
        emit BucketFlowVault.IncomeAllocated(user, 279, 202, 143, 190, 189);

        vault.deposit(depositAmount);
        vm.stopPrank();
    }

    function test_EmitsWithdrawn() public {
        uint256 depositAmount = 1003;
        uint256 withdrawAmount = 137;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.expectEmit(true, false, false, true);
        emit BucketFlowVault.Withdrawn(user, 4, withdrawAmount);

        vm.prank(user);
        vault.withdraw(4, withdrawAmount);
    }

    function test_DepositAllocatesUsingActualReceivedAmount() public {
        FeeOnTransferMockStablecoin feeToken = new FeeOnTransferMockStablecoin();
        BucketFlowVault feeVault = new BucketFlowVault(address(feeToken));

        uint256 requestedDeposit = 1003;

        vm.prank(user);
        feeVault.setSplitRule(
            RULE_RENT,
            RULE_SAVINGS,
            RULE_TAX,
            RULE_FAMILY,
            RULE_CASHOUT
        );

        feeToken.mint(user, requestedDeposit);

        vm.startPrank(user);
        feeToken.approve(address(feeVault), requestedDeposit);
        feeVault.deposit(requestedDeposit);
        vm.stopPrank();

        uint256 actualReceived = requestedDeposit -
            ((requestedDeposit * 200) / 10_000);

        (
            uint256 rent,
            uint256 savings,
            uint256 tax,
            uint256 familySupport,
            uint256 cashOut
        ) = feeVault.getBucketBalances(user);

        assertEq(rent, 274);
        assertEq(savings, 198);
        assertEq(tax, 140);
        assertEq(familySupport, 186);
        assertEq(cashOut, 185);

        assertEq(
            rent + savings + tax + familySupport + cashOut,
            actualReceived
        );
        assertEq(feeToken.balanceOf(address(feeVault)), actualReceived);
    }

    function test_WithdrawBlocksReentrancy() public {
        ReentrantStablecoin reentrantToken = new ReentrantStablecoin();
        BucketFlowVault reentrantVault = new BucketFlowVault(
            address(reentrantToken)
        );
        reentrantToken.setVault(reentrantVault);

        ReentrantAttacker attacker = new ReentrantAttacker(
            reentrantVault,
            reentrantToken
        );

        reentrantToken.mint(address(attacker), 1003);
        reentrantToken.configureAttack(address(attacker), 4, 13);

        attacker.setupAndDeposit(
            RULE_RENT,
            RULE_SAVINGS,
            RULE_TAX,
            RULE_FAMILY,
            RULE_CASHOUT,
            1003
        );

        vm.expectRevert();
        attacker.attackWithdraw(4, 137);
    }
}
