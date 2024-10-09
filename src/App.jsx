import { useState } from "react";
import { Container } from "@mui/material";
import WalletConnect from "./components/WalletConnect";
import WatchList from "./components/WatchList";
import AddToken from "./components/AddToken";
import "./App.css";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokens, setTokens] = useState([]);

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
        </>
      )}
    </Container>
  );
};

export default App;
