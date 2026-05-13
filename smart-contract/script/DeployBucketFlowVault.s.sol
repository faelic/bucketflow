// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";

import {BucketFlowVault} from "src/BucketFlowVault.sol";

contract DeployBucketFlowVault is Script {
    address internal constant SEPOLIA_USDC =
        0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;

    function run() external returns (BucketFlowVault vault) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        vault = new BucketFlowVault(SEPOLIA_USDC);

        vm.stopBroadcast();
    }
}
