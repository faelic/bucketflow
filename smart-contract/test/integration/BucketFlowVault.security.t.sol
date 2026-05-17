// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVault} from "src/BucketFlowVault.sol";
import {
    BucketFlowVaultTestBase,
    ReentrantStablecoin,
    ReentrantAttacker
} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultSecurityIntegrationTest is BucketFlowVaultTestBase {
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
