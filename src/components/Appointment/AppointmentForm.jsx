import React, { useState, useContext } from "react";
import { createAppointment, updateAppointment } from "../../services/api";
import { TextField, Button, CircularProgress,Box } from "@mui/material";
import Notification from "../Notification/index";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

const AppointmentForm = ({ doctorId, selectedDate, selectedSlot, onClose, existingAppointment, refreshAppointments }) => {
  const { token,user } = useContext(AuthContext);

  const [patientName, setPatientName] = useState(existingAppointment?.patientName || "");
  const [appointmentType, setAppointmentType] = useState(existingAppointment?.appointmentType || "");
  const [notes, setNotes] = useState(existingAppointment?.notes || "");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formattedDate = moment(`${selectedDate} ${selectedSlot}`, "YYYY-MM-DD hh:mm A").toISOString();

    const appointmentData = {
      doctorId,
      userId: user._id,
      date: formattedDate,
      duration: 30,
      appointmentType,
      patientName,
      notes,
    };

    try {
      let response;
      console.log("appointment:", appointmentData);
      if (existingAppointment) {
        console.log("Updating appointment ID:", existingAppointment._id);
        response = await updateAppointment(existingAppointment._id, appointmentData, token);
      } else {
        console.log("Creating new appointment:", appointmentData);
        response = await createAppointment(appointmentData, token);
      }

      if (response.status >= 200 && response.status < 300) {
        console.log("Response:", response);
        setNotification({ open: true, message: existingAppointment ? "Appointment updated successfully!" : "Appointment booked successfully!", severity: "success" });

        setTimeout(() => {
          refreshAppointments(); // ✅ Refresh appointment list
          onClose();
        }, 1000);
      } else {
        setNotification({ open: true, message:response.data.message, severity: "error" });
      }
    } catch (err) {
      setNotification({ open: true, message: err.response.data.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField sx={{ m: 1 }} label="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} fullWidth required />
        <TextField sx={{ m: 1 }} label="Appointment Type" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} fullWidth required />
        <TextField sx={{ m: 1 }} label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={4} />
        <Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: { xs: 'center', sm: 'flex-end' },
  alignItems: "center",
  gap: 2,
  mt: 2,
  width: '100%'
}}>
  <Button 
    sx={{ 
      width: { xs: '100%', sm: 'auto' } 
    }} 
    type="submit" 
    variant="contained" 
    color="primary" 
    disabled={loading}
  >
    {loading ? <CircularProgress size={24} /> : existingAppointment ? "Update Appointment" : "Book Appointment"}
  </Button>
  <Button 
    onClick={onClose} 
    color="error" 
    variant="contained"
    sx={{ 
      width: { xs: '100%', sm: 'auto' } 
    }}
  > 
    Cancel
  </Button>
</Box>
       
      </form>
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </>
  );
};

export default AppointmentForm;
