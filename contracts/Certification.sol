// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Certification
 * @dev This contract allows the issuance and management of certifications.
 */
contract Certification is ERC721, Ownable {
    uint256 private certificationCount;

    enum CertificationType {
        Beginner,
        Intermediate,
        Expert
    }

    struct CertificationMetadata {
        uint256 issueDate;
        uint256 teacher;
        uint256 student;
        uint256 course;
        CertificationType certificationType;
    }

    mapping(uint256 => CertificationMetadata) private _certificationMetadata;

    event CertificationIssued(
        uint256 indexed certificationId,
        address indexed recipient,
        uint256 issueDate,
        uint256 teacher,
        uint256 student,
        uint256 course,
        CertificationType certificationType
    );

    event CertificateBurned(uint256 indexed tokenId);

    /**
     * @dev Initializes the Certification contract.
     */
    constructor() ERC721("Certification", "CERT") Ownable(msg.sender) {
        certificationCount = 0;
    }

    /**
     * @dev Issues a new certification.
     * @param recipient The address of the recipient.
     * @param issueDate The date of issuance.
     * @param teacher The ID of the teacher.
     * @param student The ID of the student.
     * @param course The ID of the course.
     * @param certificationType The type of certification.
     * @return The ID of the issued certification.
     */
    function issueCertification(
        address recipient,
        uint256 issueDate,
        uint256 teacher,
        uint256 student,
        uint256 course,
        CertificationType certificationType
    ) external onlyOwner returns (uint256) {
        uint256 certificationId = certificationCount;

        _mint(recipient, certificationId);

        CertificationMetadata memory metadata = CertificationMetadata(
            issueDate,
            teacher,
            student,
            course,
            certificationType
        );
        _certificationMetadata[certificationId] = metadata;

        certificationCount++;

        emit CertificationIssued(
            certificationId,
            recipient,
            issueDate,
            teacher,
            student,
            course,
            certificationType
        );

        return certificationId;
    }

    /**
     * @dev Retrieves the metadata of a certification.
     * @param certificationId The ID of the certification.
     * @return The metadata of the certification.
     */
    function getCertificationMetadata(
        uint256 certificationId
    ) external view returns (CertificationMetadata memory) {
        return _certificationMetadata[certificationId];
    }

    /**
     * @dev Burns a certification.
     * @param tokenId The ID of the certification to burn.
     */
    function burnCertificate(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
        delete _certificationMetadata[tokenId];

        emit CertificateBurned(tokenId);
    }

    /**
     * @dev Overrides the transferFrom function to disallow transfers.
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param tokenId The ID of the certification to transfer.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public pure override(ERC721) {
        revert("Certification: Transfers are not allowed");
    }
}
