import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit: string;
  subtext?: string;
  color: string; // Hex code or standard color name
  chipLabel?: string;
  chipColor?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  subtext,
  color,
  chipLabel,
  chipColor,
}) => {
  return (
    <Card sx={{ borderLeft: `5px solid ${color}`, height: "auto" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="subtitle2">
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
          {value}{" "}
          <Typography component="span" variant="body2" color="textSecondary">
            {unit}
          </Typography>
        </Typography>

        {(subtext || chipLabel) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            {subtext && (
              <Typography variant="caption" color="textSecondary">
                {subtext}
              </Typography>
            )}
            {chipLabel && (
              <Chip
                label={chipLabel}
                color={chipColor || "default"}
                size="small"
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
