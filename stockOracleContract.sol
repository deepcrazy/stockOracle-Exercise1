pragma solidity ^0.5.12;

contract StockMarket {
    
    // Structure of Stock Quote
    struct stock {
        uint256 price;
        uint256 volume;
    }
    
    // Mapping of stock with symbol of bytes4
    mapping (bytes4 => stock) stockQuote;
    
    address oracleOwner;    // Owner of the contract
    
    constructor() public {
        oracleOwner = msg.sender;
    }
    
    /// Set the price and volume of a stock
    function setStock (bytes4 _symbol, uint256 _price, uint256 _volume) public {
        require(msg.sender == oracleOwner, "only owner can set the stock");
        stockQuote[_symbol].price = _price;
        stockQuote[_symbol].volume = _volume;
    }
    
    /// Get the price of a stock
    function getStockPrice (bytes4 _symbol) public view returns(uint256) {
        return stockQuote[_symbol].price;
    }
    
    /// Get the value of volume traded for a stock
    function getStockVolume (bytes4 _symbol) public view returns(uint256) {
        return  stockQuote[_symbol].volume;
    }
}