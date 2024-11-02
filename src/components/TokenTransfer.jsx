import { useState } from "react";
import {
  Typography,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Button,
  CircularProgress,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ethers } from "ethers";

const TokenTransfer = ({ tokens, setTokens }) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [token, setToken] = useState({ symbol: "" });
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [transferHistory, setTransferHistory] = useState([]);

  const handleChange = (event) => {
    const selectedToken = tokens.find((t) => t.symbol === event.target.value);
    setToken(selectedToken || { symbol: "" });
  };

  const handleTransfer = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        token.address,
        ["function transfer(address to, uint256 amount) public returns (bool)"],
        signer
      );

      // Convert amount to the correct format (assuming 18 decimals)
      const amountInUnits = ethers.utils.parseUnits(amount, 18);

      // Call the transfer function
      const tx = await contract.transfer(recipientAddress, amountInUnits);
      await tx.wait(); // Wait for the transaction to be mined

      // Update success message
      setSuccess("Transfer successful!");

      // Update tokens balance
      setTokens((prevTokens) =>
        prevTokens.map((t) => {
          if (t.symbol === token.symbol) {
            return { ...t, balance: t.balance - amountInUnits };
          }
          return t;
        })
      );

      setRecipientAddress("");
      setAmount("");

      // Update transfer history
      const newTransfer = {
        id: transferHistory.length + 1,
        recipient: recipientAddress,
        token: token.symbol,
        amount: ethers.utils.formatUnits(amountInUnits, 18), // Format amount back to string
        timestamp: new Date().toLocaleString(), // Get current timestamp
      };
      setTransferHistory((prevHistory) => [...prevHistory, newTransfer]);
    } catch (error) {
      setError("Transaction failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return tokens.length !== 0 ? (
    <Box
      mt={4}
      p={3}
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f5f5f5",
        width: "100%",
        maxWidth: "900px",
      }}
    >
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        Token Transfer
      </Typography>

      <TextField
        fullWidth
        label="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        margin="normal"
      />

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <Select
          value={token.symbol}
          onChange={handleChange}
          displayEmpty
          sx={{ bgcolor: "white" }}
        >
          <MenuItem value="" disabled>
            Select a token
          </MenuItem>
          {tokens.map((token) => (
            <MenuItem key={token.symbol} value={token.symbol}>
              {token.symbol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        margin="normal"
      />

      {loading ? (
        <Box mt={2} textAlign="center">
          <CircularProgress />
          <Typography mt={2}>Processing Transfer...</Typography>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleTransfer}
          sx={{ marginTop: 2 }}
        >
          Transfer
        </Button>
      )}

      {success && (
        <Alert severity="success" sx={{ marginTop: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}

      {/* Transfer History Table */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom align="center">
          Transfer History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transferHistory.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.id}</TableCell>
                  <TableCell>{transfer.recipient}</TableCell>
                  <TableCell>{transfer.token}</TableCell>
                  <TableCell>{transfer.amount}</TableCell>
                  <TableCell>{transfer.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  ) : null;
};

export default TokenTransfer;
