import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Notification from "../Notification/index";

const DoctorForm = ({ doctor, onClose, setDoctors }) => {
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

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const onSubmit = async (data) => {
    try {
      let imageUrl = doctor?.image ||
        "https://img.freepik.com/free-photo/test-tube-with-blood-sample-covid-19-test_1150-44147.jpg";
      if (data.image.length > 0) {
        imageUrl = data.image[0];
      }

      const updated = { ...data, image: imageUrl };
      let updatedDoctors = doctor? { ...doctor, ...updated } : updated;
      
      setDoctors(updatedDoctors);
      setNotification({
        open: true,
        message: `Doctor ${doctor ? "updated" : "added"} successfully!`,
        severity: "success",
      });
      onClose();
    } catch (error) {
      setNotification({ open: true, message: "Operation failed! Reload page", severity: "error" });
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
            render={({ field }) => (
              <TextField {...field} label="Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />
            )}
          />
          <Controller
            name="specialization"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Specialization" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="workingHours.start"
            control={control}
            rules={{ required: "Start time is required" }}
            render={({ field }) => (
              <TextField {...field} label="Start Time" fullWidth margin="normal" error={!!errors.workingHours?.start} helperText={errors.workingHours?.start?.message} />
            )}
          />
          <Controller
            name="workingHours.end"
            control={control}
            rules={{ required: "End time is required" }}
            render={({ field }) => (
              <TextField {...field} label="End Time" fullWidth margin="normal" error={!!errors.workingHours?.end} helperText={errors.workingHours?.end?.message} />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "flex-end" },
            alignItems: "center",
            gap: 2,
            width: "100%",
            padding: 2,
          }}
        >
          <Button onClick={onClose} color="error" variant="contained" sx={{ width: { xs: "100%", sm: "auto" } }}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained" sx={{ width: { xs: "100%", sm: "auto" } }}>{doctor ? "Update" : "Add"}</Button>
        </Box>
      </DialogActions>
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Dialog>
  );
};

export default DoctorForm;
