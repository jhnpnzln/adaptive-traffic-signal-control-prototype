import React from 'react';
import { Tabs, Tab, Paper, Box } from '@mui/material';
import { Map } from '@mui/icons-material';

interface ApproachSwitcherProps {
  approaches: { id: string; name: string }[];
  currentId: string;
  onSelect: (id: string) => void;
}

export const ApproachSwitcher: React.FC<ApproachSwitcherProps> = ({ approaches, currentId, onSelect }) => {
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', alignItems: 'center' }}>
        <Map sx={{ mr: 2, color: 'text.secondary' }} />
        <Tabs 
          value={currentId} 
          onChange={(_, value) => onSelect(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {approaches.map((app) => (
            <Tab key={app.id} label={app.name} value={app.id} />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};