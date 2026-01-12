import { useState } from "react";
import {
  Container,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  MenuItem,
  TextField,
  Skeleton,
} from "@mui/material";
import {
  Traffic as TrafficIcon,
  Signpost as SignpostIcon,
  AccessTime,
} from "@mui/icons-material";

import type {
  LWRResult,
  ASCResult,
  TimeOfDay,
} from "./types/traffic";
import {
  calculateLWR,
  calculateASC,
  KalmanFilter,
  generateDiagramData,
  getScenarioMultiplier,
} from "./utils";

// Components
import { StatsCard } from "./components/widgets/StatsCard";
import { ASCExplanation } from "./components/widgets/ASCExplanation";
import { FundamentalDiagram } from "./components/charts/FundamentalDiagram";
import { HistoryChart } from "./components/charts/HistoryChart";
import { IntersectionController } from "./components/controller/IntersectionController";

const kalmanNS = new KalmanFilter(0);
const kalmanEW = new KalmanFilter(0);

const App = () => {
  // Global Parameter
  const [isSimulating, setIsSimulating] = useState(false);
  const [globalTime, setGlobalTime] = useState<TimeOfDay>("Morning");

  // Multi-Input States (Road Length is now internally handled as 0.5km)
  const [nsInput, setNsInput] = useState({
    observationTimeMinutes: 5,
    vehicleCount: 55,
    jamDensity: 120,
    freeFlowSpeed: 60,
  });
  const [ewInput, setEwInput] = useState({
    observationTimeMinutes: 2,
    vehicleCount: 15,
    jamDensity: 120,
    freeFlowSpeed: 60,
  });

  const [results, setResults] = useState<{
    ns: { lwr: LWRResult; asc: ASCResult; q: number; history: any[] } | null;
    ew: { lwr: LWRResult; asc: ASCResult; q: number; history: any[] } | null;
  }>({ ns: null, ew: null });

  const handleRunSystem = () => {
    // 1. Run the Math Models (LWR, Kalman, Fuzzy)
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const CAMERA_RANGE_KM = 0.5; // Constant 500m based on CCTV/YOLOv4 FOV

    const multipliers = getScenarioMultiplier(globalTime);
    // SAT
    const nsAdjustedCount =
      nsInput.vehicleCount * multipliers.demand +
      Math.random() * 10 * multipliers.noise;
    const ewAdjustedCount =
      ewInput.vehicleCount * multipliers.demand +
      Math.random() * 10 * multipliers.noise;

    // 1. LWR
    const lwrNS = calculateLWR({
      ...nsInput,
      vehicleCount: nsAdjustedCount,
      roadLengthKm: CAMERA_RANGE_KM,
      // timeOfDay: "Morning",
    });
    const lwrEW = calculateLWR({
      ...ewInput,
      vehicleCount: ewAdjustedCount,
      roadLengthKm: CAMERA_RANGE_KM,
      // timeOfDay: "Morning",
    });

    // 2. KALMAN
    const qNS = Math.round(kalmanNS.update(nsAdjustedCount * 0.3));
    const qEW = Math.round(kalmanEW.update(ewAdjustedCount * 0.3));

    // 3. ASC FUZZY
    const ascNS = calculateASC(lwrNS, qNS);
    const ascEW = calculateASC(lwrEW, qEW);

    setResults((prev) => ({
      ns: {
        lwr: lwrNS,
        asc: ascNS,
        q: qNS,
        history: [
          ...(prev.ns?.history || []),
          {
            time: timestamp,
            scenario: globalTime,
            density: Math.round(lwrNS.density),
            queue: qNS,
            greenTime: ascNS.greenTime,
          },
        ],
      },
      ew: {
        lwr: lwrEW,
        asc: ascEW,
        q: qEW,
        history: [
          ...(prev.ew?.history || []),
          {
            time: timestamp,
            scenario: globalTime,
            density: Math.round(lwrEW.density),
            queue: qEW,
            greenTime: ascEW.greenTime,
          },
        ],
      },
    }));

    // 4. Lock UI and Start Animation Loop
    setIsSimulating(true);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setResults({ ns: null, ew: null });
    // Optional: reset inputs to defaults if desired
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f9", minHeight: "100vh" }}>
      {/* GLOBAL HEADER */}
      <AppBar
        position="sticky"
        sx={{ bgcolor: "#1a237e", padding: 0 }}
        elevation={4}
      >
        <Toolbar>
          <TrafficIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Adaptive Traffic Signal Control Prototype: LWR-KALMAN-FUZZY
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.15)",
              px: 2,
              borderRadius: 1,
            }}
          >
            <AccessTime sx={{ mr: 1, fontSize: 18 }} />
            <TextField
              select
              variant="standard"
              value={globalTime}
              onChange={(e) => setGlobalTime(e.target.value as TimeOfDay)}
              InputProps={{
                disableUnderline: true,
                sx: { color: "white", fontSize: "0.9rem" },
              }}
            >
              <MenuItem value="Morning">Morning Phase</MenuItem>
              <MenuItem value="Noon">Noon Phase</MenuItem>
              <MenuItem value="Afternoon">Afternoon Phase</MenuItem>
            </TextField>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, width: "100%", px: 2 }}>
        <Grid
          container
          rowSpacing={1}
          columns={12}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: "sticky", top: 0, zIndex: 10 }}>
              {/* RESEARCHER INPUT PANEL - NORTH-SOUTH */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderLeft: "6px solid #1976d2" }}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <SignpostIcon fontSize="small" sx={{ mr: 1 }} /> North-South
                    APPROACH FIXED DATA
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Vehicles (n)"
                        type="number"
                        value={nsInput.vehicleCount}
                        onChange={(e) =>
                          setNsInput({
                            ...nsInput,
                            vehicleCount: Number(e.target.value),
                          })
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Time (min)"
                        select
                        value={nsInput.observationTimeMinutes}
                        onChange={(e) =>
                          setNsInput({
                            ...nsInput,
                            observationTimeMinutes: Number(e.target.value),
                          })
                        }
                        size="small"
                      >
                        {[1, 2, 3, 4, 5].map((m) => (
                          <MenuItem key={m} value={m}>
                            {m} minute(s)
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Jam Den. (kj)"
                        type="number"
                        value={nsInput.jamDensity}
                        onChange={(e) =>
                          setNsInput({
                            ...nsInput,
                            jamDensity: Number(e.target.value),
                          })
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Speed (vf)"
                        type="number"
                        value={nsInput.freeFlowSpeed}
                        onChange={(e) =>
                          setNsInput({
                            ...nsInput,
                            freeFlowSpeed: Number(e.target.value),
                          })
                        }
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* RESEARCHER INPUT PANEL - EAST-WEST */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Paper sx={{ p: 3, borderLeft: "6px solid #9c27b0" }}>
                  <Typography
                    variant="subtitle2"
                    color="secondary"
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <SignpostIcon fontSize="small" sx={{ mr: 1 }} /> East-West
                    APPROACH FIXED DATA
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Vehicles (n)"
                        type="number"
                        value={ewInput.vehicleCount}
                        onChange={(e) =>
                          setEwInput({
                            ...ewInput,
                            vehicleCount: Number(e.target.value),
                          })
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select
                        label="Time (min)"
                        value={ewInput.observationTimeMinutes}
                        onChange={(e) =>
                          setEwInput({
                            ...ewInput,
                            observationTimeMinutes: Number(e.target.value),
                          })
                        }
                        size="small"
                      >
                        {[1, 2, 3, 4, 5].map((m) => (
                          <MenuItem key={m} value={m}>
                            {m} minute(s)
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Jam Den. (kj)"
                        type="number"
                        value={ewInput.jamDensity}
                        onChange={(e) =>
                          setEwInput({
                            ...ewInput,
                            jamDensity: Number(e.target.value),
                          })
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Speed (vf)"
                        type="number"
                        value={ewInput.freeFlowSpeed}
                        onChange={(e) =>
                          setEwInput({
                            ...ewInput,
                            freeFlowSpeed: Number(e.target.value),
                          })
                        }
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* SYNC TRIGGER */}
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRunSystem}
                  sx={{
                    borderRadius: "12px",
                    height: "100%",
                    width: "100%",
                    py: 2,
                  }}
                >
                  Simulate Data
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReset}
                  disabled={!isSimulating}
                  fullWidth
                >
                  RESET
                </Button>
              </Grid>
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, md: 8 }}>
            {/* ANALYSIS DASHBOARD SECTION */}
            {results.ns && results.ew && (
              <>
                {/* ANIMATED LIGHTS SIMULATION */}
                <Grid
                  item
                  size={{ xs: 12, md: 12 }}
                  sx={{ width: "100%", mb: 2 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      bgcolor: "#263238",
                    }}
                  >
                    <IntersectionController
                      nsData={results.ns.asc}
                      ewData={results.ew.asc}
                      nsQueue={results.ns.q}
                      ewQueue={results.ew.q}
                      active={isSimulating}
                      globalTime={globalTime}
                    />
                  </Paper>
                </Grid>

                <Grid
                  item
                  size={{ xs: 12, md: 12 }}
                  flex={1}
                  container
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  {/* DATA VISUALIZATION - NORTH-SOUTH */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <ASCExplanation
                        text={`NS: ${results.ns.asc.logicExplanation}`}
                      />
                    </Box>
                    <StatsCard
                      title="NS Density"
                      value={Math.round(results.ns.lwr.density)}
                      unit="veh/km"
                      color="#1976d2"
                      chipColor={
                        results.ns.lwr.levelOfService === "A" ||
                        results.ns.lwr.levelOfService === "B"
                          ? "success"
                          : results.ns.lwr.levelOfService === "C"
                          ? "info"
                          : results.ns.lwr.levelOfService === "D"
                          ? "warning"
                          : "error"
                      }
                      chipLabel={`LOS: ${results.ns.lwr.levelOfService}`}
                    />
                    <Box sx={{ mt: 2 }}>
                      <FundamentalDiagram
                        data={generateDiagramData(
                          nsInput.jamDensity,
                          nsInput.freeFlowSpeed
                        )}
                        currentPoint={results.ns.lwr}
                        label="North-South"
                      />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <HistoryChart data={results.ns.history} label="NS" />
                    </Box>
                  </Grid>

                  {/* DATA VISUALIZATION - EAST-WEST */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <ASCExplanation
                        text={`EW: ${results.ew.asc.logicExplanation}`}
                      />
                    </Box>
                    <StatsCard
                      title="EW Density"
                      value={Math.round(results.ew.lwr.density)}
                      unit="veh/km"
                      color="#9c27b0"
                      chipColor={
                        results.ew.lwr.levelOfService === "A" ||
                        results.ew.lwr.levelOfService === "B"
                          ? "success"
                          : results.ew.lwr.levelOfService === "C"
                          ? "info"
                          : results.ew.lwr.levelOfService === "D"
                          ? "warning"
                          : "error"
                      }
                      chipLabel={`LOS: ${results.ew.lwr.levelOfService}`}
                    />
                    <Box sx={{ mt: 2 }}>
                      <FundamentalDiagram
                        data={generateDiagramData(
                          ewInput.jamDensity,
                          ewInput.freeFlowSpeed
                        )}
                        currentPoint={results.ew.lwr}
                        label="East-West"
                      />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <HistoryChart data={results.ew.history} label="EW" />
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
            {!results.ns && !results.ew && (
              <>
                <Grid
                  item
                  size={{ xs: 12, md: 12 }}
                  sx={{ width: "100%", mb: 2 }}
                >
                  <Skeleton variant="rectangular" width={934} height={328} />
                </Grid>
                <Grid
                  item
                  size={{ xs: 12, md: 12 }}
                  flex={1}
                  container
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Skeleton
                      variant="rectangular"
                      width={450}
                      height={300}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" width={450} height={300} />
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Skeleton
                      variant="rectangular"
                      width={450}
                      height={300}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" width={450} height={300} />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default App;
