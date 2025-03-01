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
} from "@mui/material";
import DoctorForm from "../components/DocterForm/index";
import { addDoctor, updateDoctor, deleteDoctor, getAllDoctors } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Notification from "../components/Notification"; 

const DoctorManagement = () => {
  const { user,token } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors(user,token);
      console.log('response of all docters',response);
      setDoctors(response.status == 200 ? response.data : []); // Ensure it's an array
    } catch (error) {
      setNotification({ open: true, message: "Failed to load doctors", severity: "error" });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    console.log('id dele',id);
    console.log('user dele',user);
    try {
      await deleteDoctor(id, user,token);
      setDoctors(doctors.filter((doc) => doc._id !== id));
      setNotification({ open: true, message: "Doctor deleted successfully!", severity: "success" });
    } catch (error) {
      setNotification({ open: true, message: "Failed to delete doctor", severity: "error" });
    }
    setOpenDialog(false);
  };

  const handleAddOrUpdateDoctor = async (doctor) => {
    try {
      if (doctor._id) {
        console.log('doctor is present ');
        console.log('doctor',doctor);
        await updateDoctor(doctor._id,doctor, user,token);
        setNotification({ open: true, message: "Doctor updated successfully!", severity: "success" });
      } else {
        console.log('doctor is not  present ');
        console.log('doctor',doctor);
        console.log('token',token);
        console.log('addDoctor',addDoctor);
        await addDoctor(doctor, user,token);
        setNotification({ open: true, message: "Doctor added successfully!", severity: "success" });
      }
      await fetchDoctors(); // Fetch updated doctor list
    } catch (error) {
      setNotification({ open: true, message: "Operation failed!", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 3, width: "80%", maxWidth: "80%", margin: "auto", backgroundColor: "white", borderRadius: 3, boxShadow: 1 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "black" }}>Doctor Management</Typography>
      <Button variant="contained" color="primary" onClick={() => setSelectedDoctor({})} sx={{ mb: 2 }}>Add Doctor</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
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
                <TableCell>{doc._id}</TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.specialization}</TableCell>
                <TableCell>{doc.workingHours?.start} - {doc.workingHours?.end}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="primary" onClick={() => setSelectedDoctor(doc)}>Edit</Button>
                    <Button variant="contained" color="secondary" 
                    onClick={() => {
                      setOpenDialog(true);
                      setDoctorToDelete(doc);
                    }}
                    
                    >Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">No doctors available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={doctors.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this doctor?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={() => handleDelete(doctorToDelete?._id)} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

      {selectedDoctor && <DoctorForm doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} setDoctors={handleAddOrUpdateDoctor} doctors={doctors} />}

      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Box>
  );
};

export default DoctorManagement;
