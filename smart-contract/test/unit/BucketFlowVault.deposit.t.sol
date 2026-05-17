// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVault} from "src/BucketFlowVault.sol";
import {
    BucketFlowVaultTestBase,
    ZeroTransferMockStablecoin
} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultDepositUnitTest is BucketFlowVaultTestBase {
    function test_DepositRevertsWhenSplitRuleIsNotSet() public {
        uint256 depositAmount = 1003;

        stablecoin.mint(user, depositAmount);

        vm.startPrank(user);
        stablecoin.approve(address(vault), depositAmount);

        vm.expectRevert(BucketFlowVault.SplitRuleNotSet.selector);
        vault.deposit(depositAmount);
        vm.stopPrank();
    }

    function test_DepositRevertsWhenAmountIsZero() public {
        _setComplicatedRule(user);

        vm.expectRevert(BucketFlowVault.AmountMustBeGreaterThanZero.selector);
        vm.prank(user);
        vault.deposit(0);
    }

    function test_DepositRevertsWhenNoTokensAreActuallyReceived() public {
        ZeroTransferMockStablecoin zeroToken = new ZeroTransferMockStablecoin();
        BucketFlowVault zeroVault = new BucketFlowVault(address(zeroToken));
        uint256 depositAmount = 1003;

        vm.prank(user);
        zeroVault.setSplitRule(
            RULE_RENT,
            RULE_SAVINGS,
            RULE_TAX,
            RULE_FAMILY,
            RULE_CASHOUT
        );

        zeroToken.mint(user, depositAmount);

        vm.startPrank(user);
        zeroToken.approve(address(zeroVault), depositAmount);
        vm.expectRevert(BucketFlowVault.ZeroTokensReceived.selector);
        zeroVault.deposit(depositAmount);
        vm.stopPrank();
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
}
