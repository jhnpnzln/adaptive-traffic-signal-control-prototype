// import React, { useState, useEffect } from 'react';
// import { Box, Paper, Typography, keyframes } from '@mui/material';

// const pulse = keyframes`
//   0% { opacity: 1; transform: scale(1); }
//   50% { opacity: 0.7; transform: scale(1.05); }
//   100% { opacity: 1; transform: scale(1); }
// `;

// interface TrafficLightProps {
//   label: string;
//   greenDuration: number;
//   amberDuration: number;
//   isPriorityAxis: boolean; // Determines which light starts Green
// }

// export const TrafficLight: React.FC<TrafficLightProps> = ({ label, greenDuration, amberDuration, isPriorityAxis }) => {
//   const [phase, setPhase] = useState<'red' | 'yellow' | 'green'>(isPriorityAxis ? 'green' : 'red');
//   const [timeLeft, setTimeLeft] = useState(isPriorityAxis ? greenDuration : greenDuration + amberDuration);

//   // Sync state when new calculations arrive
//   useEffect(() => {
//     setPhase(isPriorityAxis ? 'green' : 'red');
//     setTimeLeft(isPriorityAxis ? greenDuration : greenDuration + amberDuration);
//   }, [greenDuration, amberDuration, isPriorityAxis]);

//   // Animation Timer Logic
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           // Phase Transition Logic
//           if (phase === 'green') {
//             setPhase('yellow');
//             return amberDuration;
//           } else if (phase === 'yellow') {
//             setPhase('red');
//             return 30; // Default wait time in Red
//           } else if (phase === 'red') {
//             // In a real system, this would wait for the other axis to finish
//             return prev; 
//           }
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [phase, amberDuration]);

//   return (
//     <Box sx={{ textAlign: 'center', m: 2 }}>
//       <Typography variant="overline" fontWeight="bold" sx={{ color: '#fff', mb: 1, display: 'block' }}>
//         {label}
//       </Typography>
      
//       <Paper sx={{ 
//         p: 2, bgcolor: '#1a1a1a', borderRadius: '20px', 
//         display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center',
//         width: '80px', border: '3px solid #333'
//       }}>
//         {/* RED LIGHT */}
//         <Box sx={{ 
//           width: 40, height: 40, borderRadius: '50%', 
//           bgcolor: phase === 'red' ? '#ff1744' : '#222',
//           boxShadow: phase === 'red' ? '0 0 20px #ff1744' : 'none',
//           transition: '0.3s'
//         }} />

//         {/* YELLOW LIGHT */}
//         <Box sx={{ 
//           width: 40, height: 40, borderRadius: '50%', 
//           bgcolor: phase === 'yellow' ? '#ffea00' : '#222',
//           boxShadow: phase === 'yellow' ? '0 0 20px #ffea00' : 'none',
//           transition: '0.3s'
//         }} />

//         {/* GREEN LIGHT */}
//         <Box sx={{ 
//           width: 40, height: 40, borderRadius: '50%', 
//           bgcolor: phase === 'green' ? '#00e676' : '#222',
//           boxShadow: phase === 'green' ? '0 0 20px #00e676' : 'none',
//           animation: phase === 'green' ? `${pulse} 1.5s infinite ease-in-out` : 'none',
//           transition: '0.3s'
//         }} />
//       </Paper>

//       <Typography variant="h5" sx={{ mt: 2, fontFamily: 'monospace', color: phase === 'green' ? '#00e676' : phase === 'yellow' ? '#ffea00' : '#ff1744', fontWeight: 'bold' }}>
//         {timeLeft}s
//       </Typography>
//     </Box>
//   );
// };



import React from 'react';
import { Box, Paper, Typography, keyframes } from '@mui/material';

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

interface TrafficLightProps {
  label: string;
  phase: 'red' | 'yellow' | 'green';
  timeLeft: number;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({ label, phase, timeLeft }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="overline" fontWeight="bold" sx={{ color: '#fff', mb: 1, display: 'block' }}>
        {label}
      </Typography>
      
      <Paper sx={{ 
        p: 2, bgcolor: '#1a1a1a', borderRadius: '20px', 
        display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center',
        width: '80px', border: '3px solid #333',
        boxShadow: '0px 10px 30px rgba(0,0,0,0.5)'
      }}>
        {/* RED LIGHT */}
        <Box sx={{ 
          width: 40, height: 40, borderRadius: '50%', 
          bgcolor: phase === 'red' ? '#ff1744' : '#222',
          boxShadow: phase === 'red' ? '0 0 20px #ff1744' : 'none',
          transition: 'background-color 0.3s ease'
        }} />

        {/* YELLOW LIGHT */}
        <Box sx={{ 
          width: 40, height: 40, borderRadius: '50%', 
          bgcolor: phase === 'yellow' ? '#ffea00' : '#222',
          boxShadow: phase === 'yellow' ? '0 0 20px #ffea00' : 'none',
          transition: 'background-color 0.3s ease'
        }} />

        {/* GREEN LIGHT */}
        <Box sx={{ 
          width: 40, height: 40, borderRadius: '50%', 
          bgcolor: phase === 'green' ? '#00e676' : '#222',
          boxShadow: phase === 'green' ? '0 0 20px #00e676' : 'none',
          animation: phase === 'green' ? `${pulse} 1.5s infinite ease-in-out` : 'none',
          transition: 'background-color 0.3s ease'
        }} />
      </Paper>

      {/* DYNAMIC TIMER COLOR */}
      <Typography 
        variant="h4" 
        sx={{ 
          mt: 2, 
          fontFamily: 'monospace', 
          fontWeight: 'bold',
          color: phase === 'green' ? '#00e676' : phase === 'yellow' ? '#ffea00' : '#ff1744'
        }}
      >
        {timeLeft}s
      </Typography>
    </Box>
  );
};