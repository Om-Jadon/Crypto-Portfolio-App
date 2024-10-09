import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { ethers } from "ethers"; // Import ethers to interact with contracts

const WatchList = ({ tokens, walletAddress }) => {
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const fetchBalances = async () => {
      const newBalances = {};
      for (const token of tokens) {
        newBalances[token.address] = await fetchCurrentBalance(token.address);
      }
      setBalances(newBalances);
    };

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
    <div>
      <Typography variant="h6" gutterBottom>
        Watch List
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Token Symbol</TableCell>
              <TableCell>Token Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Current Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token, index) => (
              <TableRow key={index}>
                <TableCell>{token.symbol}</TableCell>
                <TableCell>{token.name}</TableCell>
                <TableCell>{token.address}</TableCell>
                <TableCell align="right">
                  {balances[token.address] !== undefined ? (
                    balances[token.address]
                  ) : (
                    <CircularProgress size={20} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WatchList;
