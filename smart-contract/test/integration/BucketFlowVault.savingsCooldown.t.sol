// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVault} from "src/BucketFlowVault.sol";
import {BucketFlowVaultTestBase} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultSavingsCooldownIntegrationTest is BucketFlowVaultTestBase {
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
}
