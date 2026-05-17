// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVault} from "src/BucketFlowVault.sol";
import {BucketFlowVaultTestBase} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultSplitRuleTest is BucketFlowVaultTestBase {
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

    function test_GetSplitRuleReturnsZeroesForUnsetUser() public view {
        (
            uint16 rentBps,
            uint16 savingsBps,
            uint16 taxBps,
            uint16 familySupportBps,
            uint16 cashOutBps
        ) = vault.getSplitRule(user);

        assertEq(rentBps, 0);
        assertEq(savingsBps, 0);
        assertEq(taxBps, 0);
        assertEq(familySupportBps, 0);
        assertEq(cashOutBps, 0);
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
}
