import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Timeline } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoryChartProps {
  data: any[];
  nsData?: any[];
  ewData?: any[];
  label?: string;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, label }: HistoryChartProps) => {
  return (
    <Paper sx={{ p: 2, height: 350 }}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Timeline sx={{ mr: 1 }} /> System Response (History) {label ? `- ${label}` : ''}
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#2196f3" 
            label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#4caf50" 
            label={{ value: 'Green Time', angle: 90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="density" stroke="#2196f3" activeDot={{ r: 8 }} name="Density" />
          <Line yAxisId="right" type="step" dataKey="greenTime" stroke="#4caf50" name="Green Time" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};