import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Educhain", (m) => {
    const certification = m.contract("Certification", []);

    return { certification };
});