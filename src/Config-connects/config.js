import { createConfig, http } from "wagmi";
import {sepolia , mainnet} from "wagmi/chains";
import { metaMask } from "wagmi/connectors"
export const config = createConfig({
    chains:[sepolia , mainnet],
    connectors:[
        metaMask(),
    ],
    transports: {
        [sepolia.id]: http(),
        [mainnet.id]: http()
    }

})