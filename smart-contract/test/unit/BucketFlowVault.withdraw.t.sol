// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVault} from "src/BucketFlowVault.sol";
import {BucketFlowVaultTestBase} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultWithdrawUnitTest is BucketFlowVaultTestBase {
    function test_GetSavingsCooldownReturnsZeroBeforeAnySavingsWithdraw() public view {
        (uint256 lastWithdrawalAt, uint256 nextAllowedAt) = vault
            .getSavingsCooldown(user);

        assertEq(lastWithdrawalAt, 0);
        assertEq(nextAllowedAt, 0);
    }

    function test_WithdrawRevertsWhenBucketBalanceIsInsufficient() public {
        uint256 depositAmount = 1003;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.expectRevert(BucketFlowVault.InsufficientBucketBalance.selector);
        vm.prank(user);
        vault.withdraw(4, 190);
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
}
