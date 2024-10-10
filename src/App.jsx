import { useState } from "react";
import { Container } from "@mui/material";
import WalletConnect from "./components/WalletConnect";
import WatchList from "./components/WatchList";
import AddToken from "./components/AddToken";
import "./App.css";
import HistoricalDataPicker from "./components/HistoricalDataPicker";
import DisplayHistoricalData from "./components/DisplayHistoricalData";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokens, setTokens] = useState([]);
  const [dateAndToken, setDateAndToken] = useState({
    symbol: "",
    startDate: "",
    endDate: "",
  });
  const [historicalData, setHistoricalData] = useState([]);

  return (
    <Container>
      <h1>Crypto Portfolio App</h1>
      {!walletAddress ? (
        <WalletConnect setWalletAddress={setWalletAddress} />
      ) : (
        <p>Wallet connected: {walletAddress}</p>
      )}
      {walletAddress && (
        <>
          <AddToken setTokens={setTokens} />
          <WatchList tokens={tokens} walletAddress={walletAddress} />
          <br />
          <HistoricalDataPicker
            tokens={tokens}
            setDateAndToken={setDateAndToken}
            setHistoricalData={setHistoricalData}
            walletAddress={walletAddress}
          />
          <DisplayHistoricalData
            historicalData={historicalData}
            symbol={dateAndToken.symbol}
          />
        </>
      )}
    </Container>
  );
};

export default App;
