import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const INITIAL_SUPPLY: bigint = 4_000_000_000n;

const EDCTokenModule = buildModule("EDCTokenModule", (m) => {
    const initialSupply = m.getParameter("initialSupply", INITIAL_SUPPLY);

    const edcToken = m.contract("EDCToken", [initialSupply]);

    return { edcToken };
});

export default EDCTokenModule;