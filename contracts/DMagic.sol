// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract DMagic is ERC721, VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface public COORDINATOR;
    uint64 public vrfSubscriptionId;
    uint64 public drawCost = 1 gwei;
    mapping(uint256 => address) public requestIds;
    mapping(address => uint256) public userRandomWords;
    mapping(uint256 => uint256) private tokenCards;

    uint32 private cardIdLimit = 5000;
    uint32 private callbackGasLimit = 100000;
    uint16 private requestConfirmations = 3;
    bytes32 private vrfKeyHash;
    uint256 private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;

    constructor(
        string memory name,
        string memory symbol,
        address vrfCoordinator,
        bytes32 keyHash,
        uint64 subscriptionId
    ) ERC721(name, symbol) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        vrfKeyHash = keyHash;
        vrfSubscriptionId = subscriptionId;
    }

    function mintCard(address _claimer, string memory _tokenURI)
        public
        returns (uint256)
    {
        require(
            userRandomWords[_claimer] <= cardIdLimit,
            "draw request is pending"
        );
        require(userRandomWords[_claimer] > 0, "draw card first");
        _mint(_claimer, _tokenIds);
        _setTokenURI(_tokenIds, _tokenURI);

        tokenCards[_tokenIds] = userRandomWords[_claimer];
        _tokenIds++;
        userRandomWords[_claimer] = 0;

        return _tokenIds;
    }

    function drawCard() external payable {
        require(msg.value == drawCost);
        uint256 requestId = COORDINATOR.requestRandomWords(
            vrfKeyHash,
            vrfSubscriptionId,
            requestConfirmations,
            callbackGasLimit,
            1
        );
        requestIds[requestId] = msg.sender;
        userRandomWords[msg.sender] = cardIdLimit + 1;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        userRandomWords[requestIds[requestId]] =
            (randomWords[0] % cardIdLimit) +
            1;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return _tokenURIs[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
}
