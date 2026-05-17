// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVault} from "src/BucketFlowVault.sol";
import {
    BucketFlowVaultTestBase,
    FeeOnTransferMockStablecoin
} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultDepositFlowIntegrationTest is BucketFlowVaultTestBase {
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
}
