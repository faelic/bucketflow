// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BucketFlowVault} from "src/BucketFlowVault.sol";
import {BucketFlowVaultTestBase} from "../helpers/BucketFlowVaultTestBase.sol";

contract BucketFlowVaultConstructorTest is BucketFlowVaultTestBase {
    function test_ConstructorSetsStablecoin() public view {
        assertEq(address(vault.stablecoin()), address(stablecoin));
    }

    function test_ConstructorRevertsForZeroStablecoinAddress() public {
        vm.expectRevert(BucketFlowVault.InvalidStablecoinAddress.selector);
        new BucketFlowVault(address(0));
    }
}
