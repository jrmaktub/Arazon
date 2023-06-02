// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Arazon {

    //state variables
    string public name;
    address public owner;

    constructor(){
        name = "Arazon";
        //person deploying sc
        owner = msg.sender;
    }
}
