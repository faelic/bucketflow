// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVaultTestBase} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultWithdrawFlowIntegrationTest is BucketFlowVaultTestBase {
    function test_WithdrawReducesCashOutAndTransfersTokens() public {
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

    function test_WithdrawFromRentSucceeds() public {
        uint256 depositAmount = 1003;
        uint256 withdrawAmount = 79;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.prank(user);
        vault.withdraw(0, withdrawAmount);

        (uint256 rent, , , , ) = vault.getBucketBalances(user);
        assertEq(rent, 200);
        assertEq(stablecoin.balanceOf(user), withdrawAmount);
    }

    function test_WithdrawFromFamilySupportSucceeds() public {
        uint256 depositAmount = 1003;
        uint256 withdrawAmount = 40;

        _setComplicatedRule(user);
        _mintApproveAndDeposit(user, depositAmount);

        vm.prank(user);
        vault.withdraw(3, withdrawAmount);

        (, , , uint256 familySupport, ) = vault.getBucketBalances(user);
        assertEq(familySupport, 150);
        assertEq(stablecoin.balanceOf(user), withdrawAmount);
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
}
