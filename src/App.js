import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Web3 from "web3";
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from "./quoteContract";

const web3 = new Web3("http://127.0.0.1:8545");

function App() {
  return (
    <div className="App">
      <div className="AppContent">
        <StockMarket></StockMarket>
      </div>
    </div>
  );
}

let accounts = [];
// getAccounts();

function StockMarket() {
  const [symbol, setSymbol] = React.useState("");
  const [quote, setQuote] = React.useState({});
  const [stockPrice, setStockPrice] = React.useState();
  const [stockVolume, setStockVolume] = React.useState();
  // const [errorMessage, setErrorMessage] = React.useState("");

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

        var setStock = await stockQuote.methods
          .setStock(
            web3.utils.fromAscii(symbol),
            Math.round(Number(quote["05. price"]) * 10000),
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
  }, [quote, symbol]);
  // console.log(stockPrice);

  const onClickGetPrice = () => {
    fetch(
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
        symbol +
        "&apikey=KEYW"
    )
      .then((res, err) => {
        return res.json();
      })
      .then(data => {
        setQuote(data["Global Quote"]);
        // setErrorMessage(data["Error Message"]);
        console.log(data["Error Message"]);
      })
      .catch(err => {
        console.log(err);
        setStockPrice(0);
        setStockVolume(0);
      });
  };

  return (
    <div>
      <Typography>Stock Market Exercise</Typography>

      <Box m={3} />
      <Grid container direction="row" justify="center" alignItems="center">
        <Typography>Enter the stock symbol</Typography>
        <Box m={1}></Box>
        <TextField
          variant="outlined"
          label="Symbol"
          onChange={event => setSymbol(event.target.value)}
        ></TextField>
      </Grid>

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
      {Boolean(quote) && Object.keys(quote).length !== 0 ? (
        <div>
          <Typography>{`Price: ${stockPrice / 10000}`}</Typography>
          <Typography>{`Volume: ${stockVolume / 10000}`}</Typography>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
