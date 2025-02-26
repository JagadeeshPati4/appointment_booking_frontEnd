import React, { useEffect, useState,useContext } from 'react';
import { getDoctors } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Box,CircularProgress,Button } from "@mui/material";
import {AuthContext} from '../../context/AuthContext';

const DoctorList = () => {
  const { user,token } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const responce = await getDoctors(user,token);
        if (responce.status === 200) {
          setDoctors(responce.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        {doctors.map((doctor, index) => (

          <Grid item key={index}>
            <DoctorCard doctor={doctor} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
   
 
  
  const DoctorCard = ({ doctor }) => {
    const defulatImage ='https://img.freepik.com/free-vector/doctor-medical-healthcare-pfrofessional-character-vector_53876-175176.jpg?t=st=1740537937~exp=1740541537~hmac=457a588eb6191433d3d652a86e971830b45802b023e78dac697dee4e5f5a8f8d&w=740'
    return (
      <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
        <CardMedia component="img" height="200" image={doctor.image?doctor.image:defulatImage} alt={doctor.name} />
        <CardContent>
          <Typography variant="h6" component="div">
            {doctor.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {doctor.specialization}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Working Hours: {doctor.workingHours.start} - {doctor.workingHours.end}
          </Typography>
          <Button
                component={Link}
                to={`/doctors/${doctor._id}`}
                sx={{
                  bgcolor: "#4CAF50",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#388E3C" },
                }}
              >
                Book Now
              </Button>
        </CardContent>
      </Card>
    );
  };
export default DoctorList;
