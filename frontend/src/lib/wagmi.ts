import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";

export const SUPPORTED_CHAIN = sepolia;

export const wagmiConfig = createConfig({
  ssr: true,
  chains: [SUPPORTED_CHAIN],
  connectors: [injected()],
  transports: {
    [SUPPORTED_CHAIN.id]: http(),
  },
});
