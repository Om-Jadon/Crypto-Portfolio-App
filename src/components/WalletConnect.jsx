import { useState } from "react";
import { ethers } from "ethers"; // Ensure ethers is correctly imported
import { Button, Typography, TextField } from "@mui/material";

const WalletConnect = ({ setWalletAddress }) => {
  const [error, setError] = useState("");
  const [manualAddress, setManualAddress] = useState(""); // State to hold the manual input address

  // Connect to Metamask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error("Error details:", err); // Log the error details to see what's going wrong
        setError("Could not connect to wallet. Please try again.");
      }
    } else {
      setError("Metamask is not installed. Please install it.");
    }
  };

  // Handle manual address input
  const handleManualAddress = () => {
    if (ethers.utils.isAddress(manualAddress)) {
      setWalletAddress(manualAddress);
      setError(""); // Clear any previous errors
    } else {
      setError("Invalid Ethereum address. Please check and try again.");
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={connectWallet}
        style={{ margin: "10px" }}
      >
        Connect Wallet
      </Button>
      <div>
        <TextField
          label="Or Enter Wallet Address"
          variant="outlined"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" onClick={handleManualAddress}>
          Set Address
        </Button>
      </div>
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default WalletConnect;
