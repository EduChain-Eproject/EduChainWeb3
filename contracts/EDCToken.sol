// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the OpenZeppelin ERC-20 implementation
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EDCToken is ERC20, Ownable {
    // Token details
    string private constant TOKEN_NAME = "Educhain";
    string private constant TOKEN_SYMBOL = "EDC";

    // Constructor to set the initial supply
    constructor(
        uint256 initialSupply
    ) ERC20(TOKEN_NAME, TOKEN_SYMBOL) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * (10 ** 3)); // Smallest unit of token is 0.001
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
    }

    /**
     * @dev Function to burn tokens. Can only be called by the owner (system account).
     * @param amount The amount of tokens to burn.
     */
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
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
    }

    /**
     * @dev Airdrops tokens to multiple addresses. Can only be called by the owner.
     * @param recipients An array of addresses that will receive tokens.
     * @param amount The amount of tokens each address will receive.
     */ function airdropTokens(
        address[] memory recipients,
        uint256 amount
    ) public onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amount);
        }
    }

    /**
     * @dev Airdrops tokens to multiple addresses. Can only be called by the owner.
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
    }

    /**
     * @dev Returns the total supply of tokens.
     */
    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }
}
