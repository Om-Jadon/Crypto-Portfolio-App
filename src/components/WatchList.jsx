import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { ethers } from "ethers";

const WatchList = ({ tokens, walletAddress, setTokens }) => {
  const fetchBalances = async () => {
    for (const token of tokens) {
      const balance = await fetchCurrentBalance(token.address);
      setTokens((prevTokens) =>
        prevTokens.map((prevToken) =>
          prevToken.address === token.address
            ? { ...prevToken, balance: balance }
            : prevToken
        )
      );
    }
  };
  useEffect(() => {
    if (tokens.length > 0) {
      fetchBalances();
    }
  }, [tokens, walletAddress]); // Depend on walletAddress to fetch balances when it changes

  const fetchCurrentBalance = async (address) => {
    const ERC20_ABI = ["function balanceOf(address) view returns (uint256)"];
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(address, ERC20_ABI, provider);
      const balance = await contract.balanceOf(walletAddress); // Fetch balance for the connected wallet
      return ethers.utils.formatUnits(balance, 18); // Format balance to a readable number (18 decimals for most ERC-20 tokens)
    } catch (error) {
      console.error("Unable to fetch balance for address:", address, error);
      return 0; // Return 0 if unable to fetch balance
    }
  };

  return (
    <Box sx={{ padding: 2, marginTop: 3 }}>
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
        Watch List
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}></Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="watchlist table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Token Symbol</strong>
              </TableCell>
              <TableCell>
                <strong>Token Name</strong>
              </TableCell>
              <TableCell>
                <strong>Address</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Current Balance</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token, index) => (
              <TableRow
                key={index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>{token.symbol}</TableCell>
                <TableCell>{token.name}</TableCell>
                <TableCell>{token.address}</TableCell>
                <TableCell align="right">
                  {token.balance !== undefined ? (
                    token.balance
                  ) : (
                    <CircularProgress size={20} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WatchList;
