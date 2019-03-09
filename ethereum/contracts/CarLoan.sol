pragma solidity ^0.5.0;

import { ERC721 } from './ERC721.sol';

contract CarLoan is ERC721 {

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
  function totalSupply() public view returns (uint256 total) {
     return tokens.length;
  }
  function balanceOf(address _owner) public view returns (uint256 balance) {
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
  function setApprovalForAll(address _operator, bool _approved) external {
    operatorApprovals[msg.sender][_operator] = _approved;
    emit ApprovalForAll(
        msg.sender,
        _operator,
        _approved
    );
  }
  function isApprovedForAll(address _owner, address _operator)
      public
      view
      returns (bool) {
    return operatorApprovals[_owner][_operator];
  }
  function transfer(address _to, uint256 _tokenId) external {
    require(_to != address(0));
    require(_to != address(this));
    require(_owns(msg.sender, _tokenId));

    _transfer(msg.sender, _to, _tokenId);
  }
  function transferFrom(address _from, address _to, uint256 _tokenId) external {
    require(_to != address(0));
    require(_to != address(this));
    require(_approvedFor(msg.sender, _tokenId));
    require(_owns(_from, _tokenId));

    _transfer(_from, _to, _tokenId);
  }

  // Events
  event Transfer(address from, address to, uint256 tokenId);
  event Approval(address owner, address approved, uint256 tokenId);

  // Optional
  function name() public view returns (string memory) { return "12months(TM) Car Loan"; }
  function symbol() public view returns (string memory) { return "12KUUD"; }
  function tokensOfOwner(address _owner) external view returns (uint256[] memory tokenIds) {
    uint256 balance = balanceOf(_owner);

    if (balance == 0) {
      return new uint256[](0);
    } else {
      uint256[] memory result = new uint256[](balance);
      uint256 maxTokenId = totalSupply();
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

  function _transfer(address _from, address _to, uint256 _tokenId) internal {
    ownershipTokenCount[_to]++;
    tokenIndexToOwner[_tokenId] = _to;

    if (_from != address(0)) {
      ownershipTokenCount[_from]--;
      delete tokenIndexToApproved[_tokenId];
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

    _transfer(address(0), _owner, tokenId);
  }
}
