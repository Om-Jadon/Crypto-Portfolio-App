import { useState } from "react";
import { ethers } from "ethers";
import { Button, TextField, Alert, Box } from "@mui/material";

const WalletConnect = ({ setWalletAddress }) => {
  const [error, setError] = useState("");
  const [manualAddress, setManualAddress] = useState("");

  // Connect to Metamask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setError("");
      } catch (err) {
        console.error("Error details:", err);
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
      setError("");
    } else {
      setError("Invalid Ethereum address. Please check and try again.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={5}
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Button
        variant="contained"
        onClick={connectWallet}
        sx={{ width: "100%", mb: 2, paddingY: 1.5, fontWeight: "bold" }}
      >
        Connect Wallet
      </Button>

      <TextField
        label="Or Enter Wallet Address"
        variant="outlined"
        value={manualAddress}
        onChange={(e) => setManualAddress(e.target.value)}
        fullWidth
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      <Button
        variant="contained"
        onClick={handleManualAddress}
        sx={{
          width: "100%",
          paddingY: 1.5,
          fontWeight: "bold",
        }}
      >
        Set Address
      </Button>

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2, width: "100%", textAlign: "center" }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default WalletConnect;
