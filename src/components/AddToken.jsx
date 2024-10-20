import { Button, Typography, TextField, Box, Alert } from "@mui/material";
import { useState } from "react";
import { ethers } from "ethers";
import PropTypes from "prop-types";

function AddToken({ setTokens }) {
  const [token, setToken] = useState({
    name: "",
    address: "",
    symbol: "",
    balance: 0,
  });
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
    <Box
      sx={{
        marginTop: 3,
        padding: 3,
        textAlign: "center",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f5f5f5", // Light background for better contrast
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#3f51b5",
          marginBottom: 2,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Add Token
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ gap: 2 }}
      >
        <TextField
          label="Enter Token Address"
          variant="outlined"
          value={token.address}
          onChange={(e) => setToken({ ...token, address: e.target.value })}
          sx={{
            width: "300px",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2, // Rounded corners
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            paddingX: 4,
            paddingY: 1,
            backgroundColor: "#3f51b5",
            "&:hover": {
              backgroundColor: "#303f9f", // Darker shade on hover
            },
          }}
        >
          Add Token
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default AddToken;
