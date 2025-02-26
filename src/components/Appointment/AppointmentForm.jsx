import React, { useState, useContext } from "react";
import { createAppointment, updateAppointment } from "../../services/api";
import { TextField, Button, CircularProgress } from "@mui/material";
import Notification from "../Notification/index";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

const AppointmentForm = ({ doctorId, selectedDate, selectedSlot, onClose, existingAppointment, refreshAppointments }) => {
  const { token } = useContext(AuthContext);

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
      date: formattedDate,
      duration: 30,
      appointmentType,
      patientName,
      notes,
    };

    try {
      let response;
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
        setNotification({ open: true, message: "Failed to process appointment", severity: "error" });
      }
    } catch (err) {
      setNotification({ open: true, message: "An error occurred while processing the appointment", severity: "error" });
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
        <Button sx={{ m: 1 }} type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : existingAppointment ? "Update Appointment" : "Book Appointment"}
        </Button>
      </form>
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </>
  );
};

export default AppointmentForm;
