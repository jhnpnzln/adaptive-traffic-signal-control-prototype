// src/components/IntersectionController.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { TrafficLight } from '../trafficLight/TrafficLight'; // Use the previous UI structure
import type { ASCResult } from '../../types/traffic';

interface IntersectionControllerProps {
  nsData: ASCResult;
  ewData: ASCResult;
  active: boolean;
  nsQueue?: number;
  ewQueue?: number;
  globalTime?: string;
}

export const IntersectionController: React.FC<IntersectionControllerProps> = ({ nsData, ewData, active, globalTime, nsQueue, ewQueue }) => {
  // 0: NS Green, 1: NS Yellow, 2: EW Green, 3: EW Yellow
  const [stage, setStage] = useState(0); 
  const [timer, setTimer] = useState(nsData.greenTime);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setTimer((prev: number) => {
        if (prev <= 1) {
          const nextStage = (stage + 1) % 4;
          setStage(nextStage);
          
          // Assign next duration based on stage
          if (nextStage === 0) return nsData.greenTime;
          if (nextStage === 1) return nsData.amberTime;
          if (nextStage === 2) return ewData.greenTime;
          if (nextStage === 3) return ewData.amberTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, stage, nsData, ewData]);

  return (
    <>
      <TrafficLight 
        label="NORTH-SOUTH" 
        phase={stage === 0 ? 'green' : stage === 1 ? 'yellow' : 'red'} 
        timeLeft={timer} 
      />

      <Box
        sx={{
          textAlign: "center",
          color: "white",
          maxWidth: "300px",
        }}
      >
        <Chip
          label="Real-Time Adaptive Phase"
          color="info"
          variant="filled"
          sx={{ mb: 2 }}
        />
        <Typography
          variant="h4"
          fontWeight="900"
          sx={{ letterSpacing: 2 }}
        >
          {nsData.greenTime >= ewData.greenTime
            ? "NS FLOW"
            : "EW FLOW"}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          SYSTEM MODE: {globalTime?.toUpperCase() ?? 'ADAPTIVE'} PREDICTIVE (LWR)
        </Typography>
        <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: "#90caf9" }}
        >
          "Adjusting cycle based on predicted queue of{" "}
          {Math.max(nsQueue ?? 0, ewQueue ?? 0)} vehicles in {nsQueue && ewQueue
            ? nsQueue > ewQueue
              ? "NORTH-SOUTH"
              : "EAST-WEST"
            : "the busier direction"}." 
        </Typography>
      </Box>

      <TrafficLight 
        label="EAST-WEST" 
        phase={stage === 2 ? 'green' : stage === 3 ? 'yellow' : 'red'} 
        timeLeft={timer} 
      />
    </>
  );
};