import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Notification from '../Notification/index';

const DoctorForm = ({ doctor, onClose, setDoctors, doctors }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: doctor?.name || "",
      specialization: doctor?.specialization || "",
      workingHours: {
        start: doctor?.workingHours?.start || "",
        end: doctor?.workingHours?.end || "",
      },
      image: "",
    },
  });

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const onSubmit = async (data) => {
    console.log('data',data);
    try {
      let imageUrl = doctor?.image || "https://img.freepik.com/free-photo/test-tube-with-blood-sample-covid-19-test_1150-44147.jpg?t=st=1740523897~exp=1740527497~hmac=add16dac5c296e80e2bdd9568513c0e74f402daf710113b2a1bc9599dd67535f&w=1060";
      if (data.image.length > 0) {
        imageUrl = data.image[0];
        // Upload image logic here and set imageUrl accordingly
      }
      
      const updated = { ...data, image: imageUrl };
      console.log('updatedDoctor inputs', updated);
      let updatedDoctors;
      console.log('doctor', doctor);
      if (doctor._id) {
        console.log('gone to docters')
        updatedDoctors = {...doctor,...updated}
      } else {
        updatedDoctors = updated;
      }
      console.log('updatedDoctors', updatedDoctors);
      setDoctors(updatedDoctors);
      setNotification({ open: true, message: `Doctor ${doctor ? "updated" : "added"} successfully!`, severity: "success" });
      onClose();
    } catch (error) {
      setNotification({ open: true, message: "Operation failed! reload page", severity: "error" });
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth>
      <DialogTitle>{doctor ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => <TextField {...field} label="Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />}
          />
          <Controller
            name="specialization"
            control={control}
            render={({ field }) => <TextField {...field} label="Specialization" fullWidth margin="normal" />}
          />
          <Controller
            name="workingHours.start"
            control={control}
            rules={{ required: "Start time is required" }}
            render={({ field }) => <TextField {...field} label="Start Time" fullWidth margin="normal" error={!!errors.workingHours?.start} helperText={errors.workingHours?.start?.message} />}
          />
          <Controller
            name="workingHours.end"
            control={control}
            rules={{ required: "End time is required" }}
            render={({ field }) => <TextField {...field} label="End Time" fullWidth margin="normal" error={!!errors.workingHours?.end} helperText={errors.workingHours?.end?.message} />}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => <input type="file" accept="image/*" onChange={(e) => setValue("image", e.target.files)} />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained">{doctor ? "Update" : "Add"}</Button>
      </DialogActions>
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Dialog>
  );
};

export default DoctorForm;
