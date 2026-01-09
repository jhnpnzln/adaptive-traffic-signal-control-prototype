import React from "react";
import { Box, Paper, Typography, keyframes } from "@mui/material";

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

interface TrafficLightProps {
  label: string;
  phase: "red" | "yellow" | "green";
  timeLeft: number;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({
  label,
  phase,
  timeLeft,
}) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="overline"
        fontWeight="bold"
        sx={{ color: "#fff", mb: 1, display: "block" }}
      >
        {label}
      </Typography>

      <Paper
        sx={{
          p: 2,
          bgcolor: "#1a1a1a",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "center",
          width: "80px",
          border: "3px solid #333",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* RED LIGHT */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: phase === "red" ? "#ff1744" : "#222",
            boxShadow: phase === "red" ? "0 0 20px #ff1744" : "none",
            transition: "background-color 0.3s ease",
          }}
        />

        {/* YELLOW LIGHT */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: phase === "yellow" ? "#ffea00" : "#222",
            boxShadow: phase === "yellow" ? "0 0 20px #ffea00" : "none",
            transition: "background-color 0.3s ease",
          }}
        />

        {/* GREEN LIGHT */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: phase === "green" ? "#00e676" : "#222",
            boxShadow: phase === "green" ? "0 0 20px #00e676" : "none",
            animation:
              phase === "green" ? `${pulse} 1.5s infinite ease-in-out` : "none",
            transition: "background-color 0.3s ease",
          }}
        />
      </Paper>

      {/* DYNAMIC TIMER COLOR */}
      <Typography
        variant="h4"
        sx={{
          mt: 2,
          fontFamily: "monospace",
          fontWeight: "bold",
          color:
            phase === "green"
              ? "#00e676"
              : phase === "yellow"
              ? "#ffea00"
              : "#ff1744",
        }}
      >
        {timeLeft}s
      </Typography>
    </Box>
  );
};
