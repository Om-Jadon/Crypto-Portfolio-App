import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormControl, MenuItem, Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function HistoricalDataPicker({
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
    let low = 0; // Start from the genesis block
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
    return high; // Closest block with timestamp <= target date
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
      const blockPromises = []; // Store promises for getting block numbers
      const balancePromises = []; // Store promises for getting balances

      // Iterate through each day between start and end date
      for (
        let date = startDateObj;
        date.isBefore(endDateObj) || date.isSame(endDateObj);
        date = date.add(1, "day")
      ) {
        blockPromises.push(getBlockNumberByDate(date)); // Store promises
      }

      // Wait for all block number promises to resolve
      const blockNumbers = await Promise.all(blockPromises);

      // Create balance fetch promises for the block numbers
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
                  date: startDateObj.add(index, "day").format("DD/MM/YYYY"), // Date corresponding to this index
                });
              })
          );
        }
      });

      // Wait for all balance fetch promises to resolve
      await Promise.all(balancePromises);

      // Sort balances by date in ascending order
      balances.sort(
        (a, b) => dayjs(a.date, "DD/MM/YYYY") - dayjs(b.date, "DD/MM/YYYY")
      );

      setHistoricalData(balances);
    } catch (error) {
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
      fetchHistoricalData();
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Historical Data
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <Select value={token.symbol} onChange={handleChange} displayEmpty>
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

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={["day", "month", "year"]}
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          format="DD/MM/YYYY"
        />
        <DatePicker
          views={["day", "month", "year"]}
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          format="DD/MM/YYYY"
        />
      </LocalizationProvider>

      <Typography color="error" sx={{ marginTop: 2 }}>
        {error}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleFetchData}
      >
        Display Data
      </Button>
    </div>
  );
}

export default HistoricalDataPicker;
