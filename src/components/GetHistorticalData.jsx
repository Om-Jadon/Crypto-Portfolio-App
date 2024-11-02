import { useState } from "react";
import { Button, Typography, Box, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormControl, MenuItem, Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function GetHistoricalData({
  tokens,
  setDateAndToken,
  setHistoricalData,
  walletAddress,
}) {
  const [token, setToken] = useState({ symbol: "" });
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const selectedToken = tokens.find(
      (token) => token.symbol === event.target.value
    );
    setToken(selectedToken || { symbol: "" });
  };

  const validateDates = () => {
    if (!token.symbol) {
      setError("Please select a token.");
      return false;
    }
    if (endDate.isAfter(dayjs())) {
      setError("End date cannot be in the future.");
      return false;
    }
    if (endDate.isBefore(startDate)) {
      setError("End date should be after start date.");
      return false;
    }
    setError("");
    return true;
  };

  const getBlockNumberByDate = async (targetDate) => {
    let low = 0;
    let high = await provider.getBlockNumber(); // Latest block number

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const block = await provider.getBlock(mid);

      const blockTime = block.timestamp * 1000; // Convert to milliseconds for comparison
      if (blockTime < targetDate.valueOf()) {
        low = mid + 1; // Move to the right half
      } else if (blockTime > targetDate.valueOf()) {
        high = mid - 1; // Move to the left half
      } else {
        return mid; // Found the exact block
      }
    }
    return high;
  };

  const fetchHistoricalData = async () => {
    try {
      if (!startDate || !endDate || !walletAddress || !token.address) {
        setError(
          "Missing data. Please make sure all fields are filled correctly."
        );
        return;
      }

      const startDateObj = dayjs(startDate, "DD/MM/YYYY");
      const endDateObj = dayjs(endDate, "DD/MM/YYYY");

      const balances = [];
      const blockPromises = [];
      const balancePromises = [];

      for (
        let date = startDateObj;
        date.isBefore(endDateObj) || date.isSame(endDateObj);
        date = date.add(1, "day")
      ) {
        blockPromises.push(getBlockNumberByDate(date));
      }

      const blockNumbers = await Promise.all(blockPromises);

      blockNumbers.forEach((blockNumber, index) => {
        if (blockNumber !== null) {
          const contract = new ethers.Contract(
            token.address,
            ["function balanceOf(address owner) view returns (uint256)"],
            provider
          );
          balancePromises.push(
            contract
              .balanceOf(walletAddress, {
                blockTag: blockNumber,
              })
              .then((balance) => {
                const formattedBalance = ethers.utils.formatUnits(balance, 18);
                balances.push({
                  blockNumber,
                  balance: formattedBalance,
                  date: startDateObj.add(index, "day").format("DD/MM/YYYY"),
                });
              })
          );
        }
      });

      await Promise.all(balancePromises);

      balances.sort(
        (a, b) => dayjs(a.date, "DD/MM/YYYY") - dayjs(b.date, "DD/MM/YYYY")
      );

      setHistoricalData(balances);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch historical data. Please try again.");
    }
  };

  const handleFetchData = () => {
    if (validateDates()) {
      setDateAndToken({
        symbol: token.symbol,
        address: token.address,
        startDate: startDate.format("DD/MM/YYYY"),
        endDate: endDate.format("DD/MM/YYYY"),
      });
      setHistoricalData([0]);
      fetchHistoricalData();
    }
  };

  return (
    <Box
      mt={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f5f5f5",
        width: "100%",
        maxWidth: 600,
      }}
    >
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        Historical Data
      </Typography>

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

      <Box
        display="flex"
        justifyContent="space-between"
        mt={2}
        mb={3}
        width="100%"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            sx={{ width: "48%", marginRight: 1 }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            sx={{ width: "48%" }}
          />
        </LocalizationProvider>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleFetchData}
        sx={{ width: "100%" }}
      >
        Display Data
      </Button>
    </Box>
  );
}

export default GetHistoricalData;
