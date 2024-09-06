import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const INITIAL_SUPPLY: bigint = 4_000_000_000n;
const DECIMALS = 18;

export default buildModule("Educhain", (m) => {
    const initialSupply = m.getParameter("initialSupply", INITIAL_SUPPLY * BigInt((10 ** DECIMALS)));

    const edcToken = m.contract("EDCToken", [initialSupply]);

    return { edcToken };
});