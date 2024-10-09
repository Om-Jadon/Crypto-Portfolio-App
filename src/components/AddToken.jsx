import { Button, Typography, TextField } from "@mui/material";
import { useState } from "react";
import { ethers } from "ethers";
import PropTypes from "prop-types";

function AddToken({ setTokens }) {
  const [token, setToken] = useState({ name: "", address: "", symbol: "" });
  const [error, setError] = useState(""); // State for error messages

  const getTokenDetails = async (address) => {
    const ERC20_ABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
    ];
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(address, ERC20_ABI, provider);
      const name = await contract.name(); // Fetch token name
      const symbol = await contract.symbol(); // Fetch token symbol
      return { name, symbol };
    } catch (error) {
      console.error(
        "Invalid ERC-20 address or unable to fetch token details.",
        error
      );
      return null; // If not a valid ERC-20 contract
    }
  };

  const handleAdd = async () => {
    setError(""); // Clear previous error messages
    const details = await getTokenDetails(token.address); // Fetch the token details
    if (details) {
      setTokens((prevTokens) => [
        ...prevTokens,
        { ...token, name: details.name, symbol: details.symbol },
      ]);
      setToken({ name: "", address: "", symbol: "" }); // Reset the token state
    } else {
      setError("Invalid ERC-20 address or unable to fetch token details.");
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Add Token
      </Typography>
      <TextField
        label="Enter Token Address"
        variant="outlined"
        value={token.address}
        onChange={(e) => setToken({ ...token, address: e.target.value })}
        style={{ marginRight: "10px" }}
      />
      <Button variant="outlined" onClick={handleAdd}>
        Add Token
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </div>
  );
}

// Define prop types
AddToken.propTypes = {
  setTokens: PropTypes.func.isRequired,
};

export default AddToken;
