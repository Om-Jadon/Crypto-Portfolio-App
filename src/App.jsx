import { useState } from "react";
import { Box, Paper, Typography, Container, Button } from "@mui/material";
import WalletConnect from "./components/WalletConnect";
import WatchList from "./components/WatchList";
import AddToken from "./components/AddToken";
import GetHistoricalData from "./components/GetHistorticalData";
import DisplayHistoricalData from "./components/DisplayHistoricalData";
import TokenTransfer from "./components/TokenTransfer";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokens, setTokens] = useState([]);
  const [dateAndToken, setDateAndToken] = useState({
    symbol: "",
    startDate: "",
    endDate: "",
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [activeSection, setActiveSection] = useState("historical"); // New state for active section

  return (
    <Container
      maxWidth="lg"
      sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, width: "100%", borderRadius: 2, boxShadow: 5 }}
      >
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(to right, #3f51b5, #9c27b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 4,
            textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
          }}
        >
          Crypto Portfolio App
        </Typography>

        {!walletAddress ? (
          <WalletConnect setWalletAddress={setWalletAddress} />
        ) : (
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              fontSize: "1.25rem",
              padding: "10px",
              background: "rgba(63, 81, 181, 0.1)",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Wallet connected: {walletAddress}
          </Typography>
        )}

        {walletAddress && (
          <>
            <Box
              mt={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <AddToken setTokens={setTokens} />
            </Box>
            <Box
              mt={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <WatchList
                tokens={tokens}
                walletAddress={walletAddress}
                setTokens={setTokens}
              />
            </Box>

            {tokens.length !== 0 ? (
              <>
                <Box mt={4} display="flex" justifyContent="center">
                  <Button
                    variant={
                      activeSection === "historical" ? "contained" : "outlined"
                    }
                    onClick={() => setActiveSection("historical")}
                    sx={{ marginRight: 2 }}
                  >
                    Historical Data
                  </Button>
                  <Button
                    variant={
                      activeSection === "transfer" ? "contained" : "outlined"
                    }
                    onClick={() => setActiveSection("transfer")}
                  >
                    Token Transfer
                  </Button>
                </Box>

                {/* Conditional Rendering Based on Active Section */}
                <Box
                  mt={4}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  {activeSection === "historical" && (
                    <>
                      <GetHistoricalData
                        tokens={tokens}
                        setDateAndToken={setDateAndToken}
                        setHistoricalData={setHistoricalData}
                        walletAddress={walletAddress}
                      />
                      <DisplayHistoricalData
                        historicalData={historicalData}
                        symbol={dateAndToken.symbol}
                      />
                    </>
                  )}
                  {activeSection === "transfer" && (
                    <TokenTransfer tokens={tokens} setTokens={setTokens} />
                  )}
                </Box>
              </>
            ) : null}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default App;
