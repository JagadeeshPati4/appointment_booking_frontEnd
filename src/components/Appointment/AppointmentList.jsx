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
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAppointmentsUserId, deleteAppointment } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Notification from "../Notification/index";
import AppointmentForm from "./AppointmentForm";

const AppointmentList = () => {
  const { token, user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  
  // Use theme and media queries for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const response = await getAppointmentsUserId(user._id, token);
      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      setNotification({ 
        open: true, 
        message: error.response?.data?.message || "Failed to fetch appointments", 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };
  console.log("user",user)
  useEffect(() => {
    if (user?._id) {
      fetchAppointments();
    }
  }, [user?._id, token]);

  // Handle Delete
  const handleDelete = async () => {
    try {
      await deleteAppointment(appointmentToDelete._id, token);
      setAppointments(appointments.filter((apt) => apt._id !== appointmentToDelete._id));
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
    fetchAppointments(); // Fetch latest appointments after updating
    setOpenEditDialog(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Box  sx={{
      ...(isMobile === false && {
        margin: "auto",
        backgroundColor: "#ffffff",
        borderRadius: 3,
        boxShadow: 1,
        overflow: "hidden",
      }),
    }} >
      {isMobile ? (
        // Mobile View: Card-based layout
        <Box>
          {appointments.length > 0 ? (
            appointments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((appointment) => (
                <Card key={appointment._id} sx={{ mt: 2,mb: 2, mx: 1 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Patient: {appointment.patientName}
                    </Typography>
                    <Typography variant="body2">
                      Doctor: {appointment.doctorId.name}
                    </Typography>
                    <Typography variant="body2">
                      Type: {appointment.appointmentType}
                    </Typography>
                    <Typography variant="body2">
                      Date: {formatDate(appointment.date)}
                    </Typography>
                    <Typography variant="body2" mb={2}>
                      Duration: {appointment.duration} minutes
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between" mt={1}>
                      <Button
                        startIcon={<EditIcon />}
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(appointment)}
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setOpenDialog(true);
                          setAppointmentToDelete(appointment);
                        }}
                        size="small"
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography>No appointments available</Typography>
            </Box>
          )}
        </Box>
      ) : (
        // Desktop View: Table layout
        <Box sx={{ overflowX: 'auto' }}>
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
                appointments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.doctorId.name}</TableCell>
                      <TableCell>{appointment.appointmentType}</TableCell>
                      <TableCell>{formatDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.duration} minutes</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(appointment)}
                            size="small"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              setOpenDialog(true);
                              setAppointmentToDelete(appointment);
                            }}
                            size="small"
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No appointments available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

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
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Edit Appointment Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleEditClose} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <AppointmentForm
              doctorId={selectedAppointment.doctorId._id}
              selectedDate={selectedAppointment.date}
              selectedSlot={selectedAppointment.slot}
              onClose={handleEditClose}
              existingAppointment={selectedAppointment}
              refreshAppointments={fetchAppointments}
            />
          )}
        </DialogContent>
       
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullScreen={isMobile}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this appointment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
};

export default AppointmentList;