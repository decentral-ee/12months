pragma solidity ^0.5.0;

/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
/// @author Dieter Shirley <dete@axiomzen.co> (https://github.com/dete)
contract ERC721 {
    bytes4 constant internal ERC721_RECEIVED = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    // Required methods
    function totalSupply() external view returns (uint256 total);

    function balanceOf(address _owner) external view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);

    function approve(address _to, uint256 _tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);

    function setApprovalForAll(address _operator, bool _approved) external;
    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool);

    function transfer(address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;


    // Events
    /// @dev This emits when ownership of any NFT changes by any mechanism.
    ///      This event emits when NFTs are created (`from` == 0) and destroyed
    ///      (`to` == 0). Exception: during contract creation, any number of NFTs
    ///      may be created and assigned without emitting Transfer. At the time of
    ///      any transfer, the approved address for that NFT (if any) is reset to none.
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

    /// @dev This emits when the approved address for an NFT is changed or
    ///      reaffirmed. The zero address indicates there is no approved address.
    ///      When a Transfer event emits, this also indicates that the approved
    ///      address for that NFT (if any) is reset to none.
    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );

    /// @dev This emits when an operator is enabled or disabled for an owner.
    ///      The operator can manage all NFTs of the owner.
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );


    // Optional
    function name() public view returns (string memory);
    function symbol() public view returns (string memory);
    function tokensOfOwner(address _owner) external view returns (uint256[] memory tokenIds);
    function tokenMetadata(uint256 _tokenId) public view returns (string memory infoUrl);
}
