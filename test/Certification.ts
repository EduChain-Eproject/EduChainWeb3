import { expect } from "chai";
import hre from "hardhat";
import { Certification } from "../typechain-types";
import { ContractTransactionResponse } from "ethers";

type MetadataAgrs = [
    recipient: string,
    issueDate: number,
    teacher: number,
    student: number,
    course: number,
    certificationType: number
];

describe("Certification", function () {
    let certificationContract: Certification & { deploymentTransaction(): ContractTransactionResponse; };
    let owner: { address: any; };
    let addr1: { address: any; };
    let addr2: { address: any; };

    beforeEach(async function () {
        const Certification = await hre.ethers.getContractFactory("Certification");
        certificationContract = await Certification.deploy();

        [owner, addr1, addr2] = await hre.ethers.getSigners();
    });

    it("should set the owner correctly", async function () {
        expect(await certificationContract.owner()).to.equal(owner.address);
    });

    it("should issue a certification", async function () {
        const certificationId = 0;
        const recipient = addr1.address;
        const metadataArgs: MetadataAgrs = [recipient, Date.now(), 1, 1, 1, 1];

        await certificationContract.issueCertification(...metadataArgs);

        const certification = await certificationContract.getCertificationMetadata(certificationId);

        expect(certification[0]).to.equal(metadataArgs[1]);
        expect(certification[1]).to.equal(metadataArgs[2]);
        expect(certification[2]).to.equal(metadataArgs[3]);
        expect(certification[3]).to.equal(metadataArgs[4]);
        expect(certification[4]).to.equal(metadataArgs[5]);
    });

    it("should burn a certification", async function () {
        const certificationId = 0;
        const recipient = addr1.address;
        const metadataArgs: MetadataAgrs = [recipient, Date.now(), 1, 1, 1, 1];

        await certificationContract.issueCertification(...metadataArgs);

        await certificationContract.burnCertificate(certificationId);

        const certification = await certificationContract.getCertificationMetadata(certificationId);

        expect(certificationContract.ownerOf(certificationId)).to.be.revertedWithCustomError;

        expect(certification[0]).to.equal(0);
        expect(certification[1]).to.equal(0);
        expect(certification[2]).to.equal(0);
        expect(certification[3]).to.equal(0);
        expect(certification[4]).to.equal(0);
    });

    it("must not transfer a certification", async function () {
        const certificationId = 1;
        const recipient1 = addr1.address;
        const recipient2 = addr2.address;

        const metadataArgs: MetadataAgrs = [recipient1, Date.now(), 1, 1, 1, 1];

        await certificationContract.issueCertification(...metadataArgs);


        expect(certificationContract.transferFrom(recipient1, recipient2, certificationId)).be.revertedWith;
    });

    it("must not safely transfer a certification", async function () {
        const certificationId = 1;
        const recipient1 = addr1.address;
        const recipient2 = addr2.address;

        const metadataArgs: MetadataAgrs = [recipient1, Date.now(), 1, 1, 1, 1];

        await certificationContract.issueCertification(...metadataArgs);


        expect(certificationContract["safeTransferFrom(address,address,uint256)"](recipient1, recipient2, certificationId)).be.revertedWith;

        expect(certificationContract["safeTransferFrom(address,address,uint256,bytes)"](recipient1, recipient2, certificationId, "")).be.revertedWith;
    });
});