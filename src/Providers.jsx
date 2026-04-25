import { useEffect } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  InterwovenKitProvider,
  initiaPrivyWalletConnector,
  injectStyles,
  TESTNET,
} from "@initia/interwovenkit-react";
import styles from "@initia/interwovenkit-react/styles.js";

const config = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});
const queryClient = new QueryClient();

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT || "0xd1aa08d2de31ca1af55682f4185547f92332bee";
export const ADMIN_ADDRESS = "init1amxedetgfud5nsnht7kmuh0xajcp9uktclq7sh";
export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "initiation-2";

const customChain = {
  chain_id: "initia-arcade-1",
  chain_name: "initia-arcade-1",
  pretty_name: "initia-arcade-1",
  bech32_prefix: "init",
  slip44: 60,
  apis: {
    rpc: [{ address: "http://localhost:26657" }],
    rest: [{ address: "http://localhost:1317" }],
    indexer: [{ address: "http://localhost:8080" }],
  },
  fees: {
    fee_tokens: [{
      denom: "umin",
      fixed_min_gas_price: 0.015,
      low_gas_price: 0.015,
      average_gas_price: 0.025,
      high_gas_price: 0.04,
    }],
  },
  staking: {
    staking_tokens: [{ denom: "umin" }],
  },
};

const isLocal = import.meta.env.VITE_CHAIN_ID === "initia-arcade-1";

export default function Providers({ children }) {
  useEffect(() => {
    injectStyles(styles);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <InterwovenKitProvider
          {...TESTNET}
          defaultChainId={CHAIN_ID}
          customChain={isLocal ? customChain : undefined}
          enableAutoSign
        >
          {children}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}