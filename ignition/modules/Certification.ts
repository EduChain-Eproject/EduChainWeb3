import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const CertificationModule = buildModule("CertificationModule", (m) => {

    const certification = m.contract("Certification", []);

    return { certification };
});

export default CertificationModule;