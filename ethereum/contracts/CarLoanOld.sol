pragma solidity ^0.5.0;

import { ERC721 } from './ERC721.sol';
import { IERC721Receiver } from "./IERC721Receiver.sol";

contract CarLoanOld is ERC721 {

  struct Token {
    address mintedBy;
    uint64 mintedAt;
  }

  Token[] tokens;

  mapping (uint256 => string) infoUrls;
  mapping (uint256 => address) public tokenIndexToOwner;
  mapping (address => uint256) ownershipTokenCount;
  mapping (uint256 => address) public tokenIndexToApproved;
  mapping (address => mapping (address => bool)) internal operatorApprovals;

  // Required methods
  function totalSupply() external view returns (uint256 total) {
     return tokens.length;
  }
  function balanceOf(address _owner) external view returns (uint256 balance) {
     return ownershipTokenCount[_owner];
  }
  function ownerOf(uint256 _tokenId) external view returns (address owner) {
     owner = tokenIndexToOwner[_tokenId];

     require(owner != address(0));
  }
  function approve(address _to, uint256 _tokenId) external {
    require(_owns(msg.sender, _tokenId));

    _approve(_to, _tokenId);
  }
  function getApproved(uint256 _tokenId)
      external
      view
      returns (address){
      return tokenIndexToApproved[_tokenId];
  }
  function setApprovalForAll(address _operator, bool _approved) external {
    operatorApprovals[msg.sender][_operator] = _approved;
    emit ApprovalForAll(
        msg.sender,
        _operator,
        _approved
    );
  }
  function isApprovedForAll(address _owner, address _operator)
      external
      view
      returns (bool) {
    return operatorApprovals[_owner][_operator];
  }
  function _isApprovedForAll(address _owner, address _operator)
      internal
      view
      returns (bool) {
    return operatorApprovals[_owner][_operator];
  }
  function transfer(address _to, uint256 _tokenId) external {
    require(_to != address(0));
    require(_to != address(this));
    require(_owns(msg.sender, _tokenId));
    _transferInternal(msg.sender, _to, _tokenId);
  }
  function transferFrom(address _from, address _to, uint256 _tokenId) external {
    _transferFrom(_from, _to, _tokenId);
  }
  function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
    _transferFrom(
        _from,
        _to,
        _tokenId
    );

    uint256 receiverCodeSize;
    assembly {
        receiverCodeSize := extcodesize(_to)
    }
    if (receiverCodeSize > 0) {
        bytes4 selector = IERC721Receiver(_to).onERC721Received(
            msg.sender,
            _from,
            _tokenId,
            ""
        );
        require(
            selector == ERC721_RECEIVED,
            "ERC721_INVALID_SELECTOR"
        );
    }
  }
  function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata _data) external {
    _transferFrom(
      _from,
      _to,
      _tokenId
    );

    uint256 receiverCodeSize;
    assembly {
      receiverCodeSize := extcodesize(_to)
    }
    if (receiverCodeSize > 0) {
      bytes4 selector = IERC721Receiver(_to).onERC721Received(
          msg.sender,
          _from,
          _tokenId,
          _data
      );
      require(
          selector == ERC721_RECEIVED,
          "ERC721_INVALID_SELECTOR"
      );
    }
  }

  // Events
  event Transfer(address from, address to, uint256 tokenId);
  event Approval(address owner, address approved, uint256 tokenId);

  // Optional
  function name() public view returns (string memory) { return "12months(TM) Car Loan"; }
  function symbol() public view returns (string memory) { return "12KUUD"; }
  function tokensOfOwner(address _owner) external view returns (uint256[] memory tokenIds) {
    uint256 balance = ownershipTokenCount[_owner];

    if (balance == 0) {
      return new uint256[](0);
    } else {
      uint256[] memory result = new uint256[](balance);
      uint256 maxTokenId = tokens.length;
      uint256 idx = 0;

      uint256 tokenId;
      for (tokenId = 1; tokenId <= maxTokenId; tokenId++) {
        if (tokenIndexToOwner[tokenId] == _owner) {
          result[idx] = tokenId;
          idx++;
        }
      }

      return result;
    }
  }
  function tokenMetadata(uint256 _tokenId) public view returns (string memory infoUrl) {
    return infoUrls[_tokenId];
  }

  /*** OTHER EXTERNAL FUNCTIONS ***/

  function mint(string calldata _infoUrl) external returns (uint256) {
    return _mint(_infoUrl, msg.sender);
  }

  event Mint(address indexed owner, uint256 tokenId);

  /*** INTERNAL FUNCTIONS ***/
  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return tokenIndexToOwner[_tokenId] == _claimant;
  }

  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return tokenIndexToApproved[_tokenId] == _claimant;
  }

  function _approve(address _to, uint256 _tokenId) internal {
    tokenIndexToApproved[_tokenId] = _to;

    emit Approval(tokenIndexToOwner[_tokenId], tokenIndexToApproved[_tokenId], _tokenId);
  }
  function _transferFrom(address _from, address _to, uint256 _tokenId) internal {
    address owner = tokenIndexToOwner[_tokenId];
    address spender = msg.sender;

    require(_to != address(0), "to cannot be zero address");
    require(_to != address(this), "cannot transfer to the contract");
    require(_from == owner, "not the same owner");
    require(
        spender == owner ||
        _approvedFor(spender, _tokenId) ||
        _isApprovedForAll(owner, spender), "not approved by its owner");
    _transferInternal(_from, _to, _tokenId);
  }
  function _transferInternal(address _from, address _to, uint256 _tokenId) internal {
    ownershipTokenCount[_to]++;
    tokenIndexToOwner[_tokenId] = _to;

    if (_from != address(0)) {
      ownershipTokenCount[_from]--;
      tokenIndexToApproved[_tokenId] = address(0);
    }

    emit Transfer(_from, _to, _tokenId);
  }

  function _mint(string memory  _infoUrl, address _owner) internal returns (uint256 tokenId) {
    Token memory token = Token({
      mintedBy: _owner,
      mintedAt: uint64(now)
    });
    tokenId = tokens.push(token) - 1;
    infoUrls[tokenId] = _infoUrl;

    emit Mint(_owner, tokenId);

    _transferInternal(address(0), _owner, tokenId);
  }
}
