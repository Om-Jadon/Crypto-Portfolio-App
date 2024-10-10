import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { ethers } from "ethers";
import dayjs from "dayjs";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function DisplayHistoricalData({ historicalData, symbol }) {
  return (
    <div>
      {historicalData.length > 0 && (
        <div>
          {historicalData.map((data) => (
            <Typography key={data.blockNumber}>
              On {data.date}: {data.balance} {symbol} (Block: {data.blockNumber}
              )
            </Typography>
          ))}
        </div>
      )}
    </div>
  );
}

export default DisplayHistoricalData;
