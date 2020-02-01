import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Web3 from "web3";
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from "./quoteContract";

const web3 = new Web3("http://127.0.0.1:8545");

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
        >
        Learn React
        </a>
      </header> */}
      <div className="AppContent">
        <StockMarket></StockMarket>
      </div>
    </div>
  );
}

// OCMFO00UOHHPZTYN

let accounts = [];
// getAccounts();

function StockMarket() {
  const [symbol, setSymbol] = React.useState("");
  const [quote, setQuote] = React.useState({});
  const [stockPrice, setStockPrice] = React.useState();
  const [stockVolume, setStockVolume] = React.useState();

  React.useEffect(() => {
    if (Boolean(quote) && Object.keys(quote).length !== 0) {
      setPriceVolumeInContract();
      async function setPriceVolumeInContract() {
        accounts = await web3.eth.getAccounts();
        console.log("Account 0 = ", accounts[0]);

        const stockQuote = new web3.eth.Contract(
          STOCK_ORACLE_ABI,
          STOCK_ORACLE_ADDRESS
        );

        // console.log(web3.utils.fromAscii(symbol));
        var setStock = await stockQuote.methods
          .setStock(
            web3.utils.fromAscii(symbol),
            Number(quote["05. price"]) * 10000,
            Number(quote["06. volume"]) * 10000
          )
          .send({ from: accounts[0] });

        var price = await stockQuote.methods
          .getStockPrice(web3.utils.fromAscii(symbol))
          .call();

        var volume = await stockQuote.methods
          .getStockVolume(web3.utils.fromAscii(symbol))
          .call();

        setStockPrice(price);
        setStockVolume(volume);
      }
    }
  }, [quote]);
  // console.log(stockPrice);

  const onClickGetPrice = () => {
    fetch(
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
        symbol +
        "&apikey=KEYW"
    )
      .then((res, err) => {
        console.log("sdfsefwe");
        return res.json();
      })
      .then(data => {
        console.log("coming..!!");
        setQuote(data["Global Quote"]);
      })
      .catch(err => {
        console.log("cdjsefbwke");
        console.log(err);
        setStockPrice(0);
        setStockVolume(0);
      });
  };

  return (
    <div>
      <Typography>Stock Market Exercise</Typography>

      <Box m={3} />
      <TextField
        variant="outlined"
        label="Symbol"
        onChange={event => setSymbol(event.target.value)}
      ></TextField>

      <Box m={3} />
      <Button
        variant="contained"
        onClick={onClickGetPrice}
        color="primary"
        disabled={!Boolean(symbol)}
      >
        Get Stock Quote
      </Button>
      <Box m={3}></Box>
      {/* {Boolean(stockPrice) ? (
        <div>
          <Typography>{`Price: ${stockPrice / 10000}`}</Typography>
          <Typography>{`Volume: ${stockVolume / 10000}`}</Typography>
        </div>
      ) : (
        ""
      )} */}
      {stockPrice !==  0 && stockVolume !== 0 && (
        <div>
        <Typography>{`Price: ${stockPrice / 10000}`}</Typography>
        <Typography>{`Volume: ${stockVolume / 10000}`}</Typography>
      </div>
      )}
    </div>
  );
}

export default App;
