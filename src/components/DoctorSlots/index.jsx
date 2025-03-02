import React, { useEffect, useState,useContext } from 'react';
import { getDoctorSlots } from '../../services/api';
import { Button, CircularProgress, Grid } from '@mui/material';
import {AuthContext} from '../../context/AuthContext';
import Notification from '../Notification';

import moment from 'moment';

const DoctorSlots = ({ doctorId, selectedDate, onSlotSelect }) => {
  const { user,token } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const responce = await getDoctorSlots(doctorId, selectedDate,user,token);
        if (responce.status === 200) {
        setSlots(responce.data);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId, selectedDate]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2} sx={{justifyContent:'center'}}>
      {slots.map((slot) => (
        <Grid item key={slot}>
          <Button variant="outlined" onClick={() => onSlotSelect(slot)}>
            {slot}
          </Button>
        </Grid>
      ))}
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Grid>
  );
};

export default DoctorSlots;
