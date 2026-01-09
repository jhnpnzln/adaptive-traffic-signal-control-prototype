import React from "react";
import { Paper, Typography } from "@mui/material";

interface ASCExplanationProps {
  text: string;
}

export const ASCExplanation: React.FC<ASCExplanationProps> = ({ text }) => {
  return (
    <Paper sx={{ p: 2, bgcolor: "#e3f2fd", border: "1px solid #90caf9", height: "60px" }}>
      <Typography variant="subtitle2" color="primary" fontWeight="bold">
        ASC Logic Reasoning:
      </Typography>
      <Typography variant="body2">{text}</Typography>
    </Paper>
  );
};
