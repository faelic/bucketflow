// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVaultTestBase} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultMultiUserIntegrationTest is BucketFlowVaultTestBase {
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
}
