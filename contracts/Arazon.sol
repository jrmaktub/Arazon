// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Arazon {

    //state variables
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }
    
    mapping(uint256 => Item) public items;
    //user who placed the order, and quantity of orders bought
    mapping(address => mapping(uint256 => Order)) public orders;
    mapping(address => uint256)public orderCount;

    event Buy(address buyer, uint256 orderId, uint256 itemId);
    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner(){
        require(msg.sender == owner);
        //used inside modifiers to specify when the function should be executed
        _;
    }

    constructor(){

        //person deploying sc
        owner = msg.sender;
    }

    // List products
    function list(
        uint256 _id, 
        string memory _name, 
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock

        )  public{ //onlyOwner modifier 

        // Create Item Struct
        Item memory item = Item(
            _id, 
            _name, 
            _category, 
            _image, 
            _cost, 
            _rating, 
            _stock
        );

        // Save Item Struct to blockchain. Add item to mapping
        items[_id] = item;

        //emit Event on the blockchain
        emit List(_name, _cost, _stock);
         
    }

    // Buy products & Receive crypto with payable modifier
    function buy(uint256 _id)public payable {
        //Fetch Item
        Item memory item = items[_id];

        //require enough ether to buy
        require(msg.value >= item.cost);

        //require item is in stock
        require(item.stock >0);

        // Create an Order
        Order memory order = Order(block.timestamp, item);

        //Add Order for User
        orderCount[msg.sender]++; // <-- Order Id
        //order number
        orders[msg.sender][orderCount[msg.sender]] = order;

        // Substrack Stock
        items[_id].stock = item.stock-1;

        // Emit Event
        emit Buy(msg.sender,orderCount[msg.sender], item.id);
    
    }

    // Withdraw funds
    function withdraw()public onlyOwner{
        //owner call. call sends message. this is the address of the smart contract
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
