// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EDCToken
 * @dev This contract represents an ERC20 contract for Educhain (EDC) token.
 */
contract EDCToken is ERC20, Ownable {
    string private constant TOKEN_NAME = "Educhain";
    string private constant TOKEN_SYMBOL = "EDC";

    event TokensAwarded(address indexed student, uint256 amount);
    event TokensBurned(uint256 amount);
    event TokensRevoked(address indexed student, uint256 amount);
    event TokensAirdropped(
        address indexed sender,
        address[] recipients,
        uint256 amount
    );

    /**
     * @dev Initializes the Educhain token contract.
     * @param initialSupply The initial supply of tokens minted to contract owner.
     */
    constructor(
        uint256 initialSupply
    ) ERC20(TOKEN_NAME, TOKEN_SYMBOL) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Awards tokens for homework completion. Can be called by the owner (system account).
     * @param student The address of the student receiving the award.
     * @param amount The amount of tokens to be awarded.
     */
    function awardForHomework(
        address student,
        uint256 amount
    ) external onlyOwner {
        require(student != address(0), "Invalid student address");
        _mint(student, amount);
        emit TokensAwarded(student, amount);
    }

    /**
     * @dev Burns tokens. Can only be called by the owner (system account).
     * @param amount The amount of tokens to burn.
     */
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
        emit TokensBurned(amount);
    }

    /**
     * @dev Revokes a specified amount of tokens from a student's address.
     * This could be used if an award needs to be rescinded.
     * @param student The address from which tokens will be revoked.
     * @param amount The amount of tokens to revoke.
     */
    function revokeAward(address student, uint256 amount) external onlyOwner {
        require(balanceOf(student) >= amount, "Insufficient balance to revoke");
        _burn(student, amount);
        emit TokensRevoked(student, amount);
    }

    /**
     * @dev Airdrops contract owner's tokens to multiple addresses. Can only be called by the owner.
     * @param recipients An array of addresses that will receive tokens.
     * @param amount The amount of tokens each address will receive.
     */
    function airdropTokens(
        address[] memory recipients,
        uint256 amount
    ) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amount);
        }
        emit TokensAirdropped(msg.sender, recipients, amount);
    }

    /**
     * @dev Mints and Airdrops tokens to multiple addresses. Can only be called by the owner.
     * @param recipients An array of addresses that will receive tokens.
     * @param amount The amount of tokens each address will receive.
     */
    function airdropNewTokens(
        address[] memory recipients,
        uint256 amount
    ) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amount);
        }
        emit TokensAirdropped(msg.sender, recipients, amount);
    }

    /**
     * @dev Returns the total supply of tokens.
     */
    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }
}
