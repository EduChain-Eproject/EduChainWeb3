import { expect } from "chai";
import { ContractTransactionResponse } from "ethers";
import hre from "hardhat";
import { EDCToken } from "../typechain-types";


describe("EDCToken Contract", function () {
    const INITIAL_SUPPLY: bigint = 1_000n;
    const DECIMALS = 18;
    let edcToken: EDCToken & { deploymentTransaction(): ContractTransactionResponse; };
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async function () {

        const EDCToken = await hre.ethers.getContractFactory("EDCToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();
        edcToken = await EDCToken.deploy(INITIAL_SUPPLY * BigInt((10 ** DECIMALS)));
    });

    it("Should assign the initial supply of tokens to the owner", async function () {
        expect(await edcToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY * BigInt((10 ** DECIMALS)));
    });

    it("Should transfer tokens between accounts", async function () {
        // Transfer 50 tokens from owner to addr1
        await edcToken.transfer(addr1.address, 50);
        const addr1Balance = await edcToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(50);

        // Transfer 50 tokens from addr1 to addr2
        await edcToken.connect(addr1).transfer(addr2.address, 50);
        const addr2Balance = await edcToken.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
        const initialOwnerBalance = await edcToken.balanceOf(owner.address);

        // Try to send 1 token from addr1 (0 tokens) to owner (should fail)
        await expect(
            edcToken.connect(addr1).transfer(owner.address, 1)
        ).to.be.revertedWithCustomError;

        // Owner balance shouldn't have changed.
        expect(await edcToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
        const initialOwnerBalance = await edcToken.balanceOf(owner.address);

        // Transfer 100 tokens from owner to addr1.
        await edcToken.transfer(addr1.address, 100);

        // Transfer another 50 tokens from owner to addr2.
        await edcToken.transfer(addr2.address, 50);

        // Check balances.
        const finalOwnerBalance = await edcToken.balanceOf(owner.address);
        expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

        const addr1Balance = await edcToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(100);

        const addr2Balance = await edcToken.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(50);
    });

    it("Should award tokens for homework", async function () {
        await edcToken.awardForHomework(addr1.address, 100);
        const addr1Balance = await edcToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(100);
    });

    it("Should burn tokens", async function () {
        const initialOwnerBalance = await edcToken.balanceOf(owner.address);

        await edcToken.burn(50);

        const afterBurnBalance = await edcToken.balanceOf(owner.address);
        expect(afterBurnBalance).to.equal(initialOwnerBalance - BigInt(50));
    });

    it("Should revoke awarded tokens", async function () {
        await edcToken.awardForHomework(addr1.address, 100);
        await edcToken.revokeAward(addr1.address, 50);
        const addr1Balance = await edcToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(50);
    });

    it("Should airdrop tokens", async function () {
        const initialOwnerBalance = await edcToken.balanceOf(owner.address);

        await edcToken.airdropTokens([addr1.address, addr2.address], 50);

        const addr1Balance = await edcToken.balanceOf(addr1.address);
        const addr2Balance = await edcToken.balanceOf(addr2.address);
        expect(addr1Balance).to.equal(50);
        expect(addr2Balance).to.equal(50);

        const afterAirdropBalance = await edcToken.balanceOf(owner.address);
        expect(afterAirdropBalance).to.equal(initialOwnerBalance - BigInt(100));
    });

    it("Should airdrop new tokens", async function () {
        await edcToken.airdropNewTokens([addr1.address, addr2.address], 50);
        const addr1Balance = await edcToken.balanceOf(addr1.address);
        const addr2Balance = await edcToken.balanceOf(addr2.address);
        expect(addr1Balance).to.equal(50);
        expect(addr2Balance).to.equal(50);
    });

    it("Should get total supply", async function () {
        const totalSupply = await edcToken.getTotalSupply();
        expect(totalSupply).to.equal(INITIAL_SUPPLY * BigInt((10 ** DECIMALS)));
    });
});