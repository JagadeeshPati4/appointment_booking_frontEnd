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
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DoctorForm from "../components/DocterForm/index";
import { addDoctor, updateDoctor, deleteDoctor, getAllDoctors } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Notification from "../components/Notification";

const DoctorManagement = () => {
  const { user, token } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors(user, token);
      setDoctors(response.status === 200 ? response.data : []);
    } catch (error) {
      setNotification({ open: true, message: "Failed to load doctors", severity: "error" });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id, user, token);
      setDoctors(doctors.filter((doc) => doc._id !== id));
      setNotification({ open: true, message: "Doctor deleted successfully!", severity: "success" });
    } catch (error) {
      setNotification({ open: true, message: "Failed to delete doctor", severity: "error" });
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3, marginTop:5, marginBottom:5, maxWidth: {'xs':'70%','md':'100%'}, mx: "auto", bgcolor: "white", borderRadius: 3, boxShadow: 1 }}>
      <Typography variant="h4" sx={{ mb: 3,color:'Highlight', textAlign: "center" }}>Doctor Management</Typography>
      <Button variant="contained" color="primary" onClick={() => setSelectedDoctor({})} sx={{ mb: 2, width: isMobile ? "100%" : "auto" }}>Add Doctor</Button>
      
      {isMobile ? (
        <Box>
          {doctors.length > 0 ? (
            doctors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((doc) => (
              <Card key={doc._id} sx={{ mt: 2, mb: 2, mx: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">{doc.name}</Typography>
                  <Typography variant="body2">Specialization: {doc.specialization}</Typography>
                  <Typography variant="body2">Working Hours: {doc.workingHours?.start} - {doc.workingHours?.end}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between" mt={1}>
                    <Button variant="outlined" color="primary" onClick={() => setSelectedDoctor(doc)} size="small">Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => { setOpenDialog(true); setDoctorToDelete(doc); }} size="small">Delete</Button>
                  </Stack>
                </CardContent>
              </Card>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography>No doctors available</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Working Hours</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.length > 0 ? (
              doctors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.specialization}</TableCell>
                  <TableCell>{doc.workingHours?.start} - {doc.workingHours?.end}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="primary" onClick={() => setSelectedDoctor(doc)}>Edit</Button>
                      <Button variant="contained" color="error" onClick={() => { setOpenDialog(true); setDoctorToDelete(doc); }}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No doctors available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      
      <TablePagination
        component="div"
        count={doctors.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this doctor?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={() => handleDelete(doctorToDelete?._id)} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {selectedDoctor && <DoctorForm doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} setDoctors={fetchDoctors} />}
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Box>
  );
};

export default DoctorManagement;
