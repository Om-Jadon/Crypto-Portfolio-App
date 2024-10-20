import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Box, Paper, CircularProgress } from "@mui/material";

function DisplayHistoricalData({ historicalData, symbol }) {
  let balance = historicalData.map((data) => data.balance);
  let date = historicalData.map((data) => data.date);

  if (date.length > 30) {
    let newDate = [];
    let newBalance = [];
    let prevBalance = balance[0];
    let prevDate = date[0];
    newDate.push(prevDate);
    newBalance.push(prevBalance);
    for (let i = 1; i < date.length; i++) {
      if (date[i].split("/")[0] === "01" || i >= date.length - 20) {
        newDate.push(date[i]);
        newBalance.push(balance[i]);
      } else if (balance[i] !== prevBalance) {
        newDate.push(prevDate);
        newBalance.push(prevBalance);
        newDate.push(date[i]);
        newBalance.push(balance[i]);
      }
      prevBalance = balance[i];
      prevDate = date[i];
    }
    balance = newBalance;
    date = newDate;
  }

  return (
    <>
      {historicalData.length > 1 ? (
        <>
          <Box mt={4} display="flex" justifyContent="center">
            <Paper elevation={3} sx={{ padding: 4, width: 800 }}>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                fontWeight="bold"
              >
                Historical Data for{" "}
                <strong style={{ color: "#3f51b5" }}>{symbol}</strong>
              </Typography>
              <LineChart
                height={500}
                series={[{ data: balance, label: symbol }]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: date,
                    tickLabelStyle: {
                      rotation: -45, // Rotate labels for better visibility
                    },
                  },
                ]}
                grid={{ color: "#e0e0e0" }}
                colors={["#3f51b5"]}
                tooltip={{ enabled: true }}
              />
            </Paper>
          </Box>
        </>
      ) : historicalData[0] === 0 ? (
        <>
          <Box textAlign="center">
            <Paper
              elevation={3}
              sx={{ padding: 4, width: "100%", maxWidth: 800 }}
            >
              <CircularProgress size={40} />
              <Typography mt={2} variant="body1" align="center">
                Fetching Data...
              </Typography>
            </Paper>
          </Box>
        </>
      ) : null}
    </>
  );
}

export default DisplayHistoricalData;
