import React from 'react';
import { Paper, Typography, Divider, Grid, TextField, MenuItem, Button } from '@mui/material';
import { DirectionsCar, Update } from '@mui/icons-material';
import type { TrafficInput } from '../../types/traffic';

interface InputFormProps {
  inputs: TrafficInput;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRun: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ inputs, onChange, onRun }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DirectionsCar /> Fixed Data Input
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            select fullWidth label="Time of Day" name="timeOfDay"
            value={inputs.timeOfDay} onChange={onChange} size="small"
          >
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Noon">Noon</MenuItem>
            <MenuItem value="Afternoon">Afternoon</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth type="number" label="Vehicles Counted" name="vehicleCount" value={inputs.vehicleCount} onChange={onChange} size="small" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="number" label="Minutes" name="observationTimeMinutes" value={inputs.observationTimeMinutes} onChange={onChange} size="small" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="number" label="Road (km)" name="roadLengthKm" value={inputs.roadLengthKm} onChange={onChange} size="small" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="number" label="Jam Den. (kj)" name="jamDensity" value={inputs.jamDensity} onChange={onChange} size="small" />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="number" label="Max Speed (vf)" name="freeFlowSpeed" value={inputs.freeFlowSpeed} onChange={onChange} size="small" />
        </Grid>
      </Grid>

      <Button 
        variant="contained" fullWidth size="large" 
        sx={{ mt: 3 }} onClick={onRun}
        startIcon={<Update />}
      >
        Process Data
      </Button>
    </Paper>
  );
};