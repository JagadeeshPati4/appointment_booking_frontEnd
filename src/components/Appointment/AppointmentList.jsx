import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from "@mui/material";
import { getAppointmentsUserId, deleteAppointment } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Notification from "../Notification/index";
import AppointmentForm from "./AppointmentForm";

const AppointmentList = () => {
  const { token,user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {

      console.log('user.id',user.id);
      const response = await getAppointmentsUserId(user.id,token);
      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      setNotification({ open: true, message: error.response.data.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  // Handle Delete
  const handleDelete = async () => {
    try {
      await deleteAppointment(appointmentToDelete.id, token);
      setAppointments(appointments.filter((apt) => apt.id !== appointmentToDelete.id));
      setNotification({ open: true, message: "Appointment deleted successfully!", severity: "success" });
    } catch (error) {
      setNotification({ open: true, message: "Failed to delete appointment", severity: "error" });
    }
    setOpenDialog(false);
  };

  // Handle Edit
  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenEditDialog(true);
  };

  // Close Edit Dialog & Refresh Appointments
  const handleEditClose = () => {
    fetchAppointments(); // ✅ Fetch latest appointments after updating
    setOpenEditDialog(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3, width: "89%", margin: "auto", backgroundColor: "#ffffff", borderRadius: 3, boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Name</TableCell>
            <TableCell>Doctor Name</TableCell>
            <TableCell>Appointment Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.doctorId.name}</TableCell>
                <TableCell>{appointment.appointmentType}</TableCell>
                <TableCell> {new Date(appointment.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}</TableCell>
                <TableCell>{appointment.duration} minutes</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(appointment)}>
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setOpenDialog(true);
                        setAppointmentToDelete(appointment);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">No appointments available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={appointments.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* Edit Appointment Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
           <AppointmentForm
           doctorId={selectedAppointment.doctorId._id}
           selectedDate={selectedAppointment.date}
           selectedSlot={selectedAppointment.slot}
           onClose={handleEditClose}
           existingAppointment={selectedAppointment}
           refreshAppointments={fetchAppointments} // ✅ Pass function to refresh list
         />
         
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
        
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this appointment?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="secondary"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Box>
  );
};

export default AppointmentList;
