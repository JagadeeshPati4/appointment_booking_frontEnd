import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import AppointmentList from '../components/Appointment/AppointmentList';

const AppointmentPage = () => {
  return (
    <Container sx={{ maxWidth:"100%" ,mb:2 }}>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Appointments
        </Typography>
        <AppointmentList />
      </Paper>
    </Container>
  );
};

export default AppointmentPage;
