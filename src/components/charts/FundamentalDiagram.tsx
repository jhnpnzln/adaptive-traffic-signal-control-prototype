import React from "react";
import { Paper, Typography } from "@mui/material";
import { Assessment } from "@mui/icons-material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import type { LWRResult } from "../../types/traffic";

interface FundamentalDiagramProps {
  data: any[];
  currentPoint: LWRResult | null;
  label?: string;
}

export const FundamentalDiagram: React.FC<FundamentalDiagramProps> = ({
  data,
  currentPoint,
  label,
}) => {
  return (
    <Paper sx={{ p: 2, height: 350 }}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Assessment sx={{ mr: 1 }} /> Fundamental Diagram{" "}
        {label ? `- ${label}` : ""}
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="density"
            label={{
              value: "Density (k)",
              position: "insideBottom",
              offset: -5,
            }}
            type="number"
          />
          <YAxis
            label={{ value: "Flow (q)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number | undefined) =>
              value !== undefined ? Math.round(value) : ""
            }
          />
          <Area
            type="monotone"
            dataKey="flow"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.2}
          />
          {currentPoint && (
            <ReferenceDot
              x={currentPoint.density}
              y={currentPoint.flow}
              r={6}
              fill="red"
              stroke="white"
              label={{ position: "top", value: "Current" }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};
