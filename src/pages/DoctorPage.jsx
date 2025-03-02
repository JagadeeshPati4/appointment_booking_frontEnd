import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import DoctorSlots from "../components/DoctorSlots/index";
import AppointmentForm from "../components/Appointment/AppointmentForm";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  TextField,
  Dialog,
  Card,
  CardContent,
  CardMedia,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import moment from "moment";
import dayjs from "dayjs";
import Notification from "../components/Notification"; 
import { AuthContext } from "../context/AuthContext";
import { getDoctor } from "../services/api";

const DoctorPage = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [open, setOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // ✅ State for refreshing slots
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await getDoctor(id, token);
        if (response.status === 200) {
          setDoctorInfo(response.data);
        }
      } catch (error) {
        setNotification({ open: true, message: error.response.data.message, severity: "error" });
        console.error("Error fetching doctor info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorInfo();
  }, [id]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSlot(null);
  };

  const handleAppointmentBooked = () => {
    setRefresh(!refresh); // ✅ Trigger slot refresh
    handleClose();
  };
  console.log('dayjs().add(1, "MONTH")}',dayjs().add(1, "MONTH").format('YYYY-MM-DD'));
  const defaultImage =
    "https://img.freepik.com/free-vector/doctor-medical-healthcare-pfrofessional-character-vector_53876-175176.jpg?t=st=1740537937~exp=1740541537~hmac=457a588eb6191433d3d652a86e971830b45802b023e78dac697dee4e5f5a8f8d&w=740";

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 5 }}>
        <Paper elevation={3} sx={{ width: "80%", maxWidth: 600, p: 3, borderRadius: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Doctor Info Container */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Card sx={{ maxWidth: "100%", m: 2, boxShadow: 3 }}>
                  <CardMedia component="img" height="200" image={doctorInfo.image ? doctorInfo.image : defaultImage} alt={doctorInfo.name} />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {doctorInfo.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {doctorInfo.specialization}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Working Hours: {doctorInfo.workingHours.start} - {doctorInfo.workingHours.end}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Date Picker with LocalizationProvider */}
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    minDate={moment()}
                    maxDate={moment().add(1, "month")} // 1 month from today
                    onChange={(date) => setSelectedDate(date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Box>
              </LocalizationProvider>

              {/* Doctor Slots */}
              <DoctorSlots doctorId={id} selectedDate={selectedDate.format("YYYY-MM-DD")} onSlotSelect={handleSlotSelect} key={refresh} />
            </>
          )}
        </Paper>
      </Box>

      {/* Appointment Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
        <AppointmentForm 
         doctorId={id} 
        selectedDate={selectedDate.format("YYYY-MM-DD")} 
        selectedSlot={selectedSlot} 
        onClose={handleAppointmentBooked} 
        refreshAppointments={handleAppointmentBooked} // ✅ Pass the function
        />

        </DialogContent>
       
      </Dialog>
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Container>
  );
};

export default DoctorPage;
