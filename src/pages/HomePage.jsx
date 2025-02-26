import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import ImageSlider from "../components/ImageSlider";
import FeaturesSection from "./FeaturesPage";



const Home = () => {
  return (
    
      <Container
        maxWidth="95%"
        sx={{ marginTop: "80px", marginBottom: 5, overflowX: "hidden",maxWidth:"95%" }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 2,
            p: 4,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <img
              src="https://r.mobirisesite.com/1235201/assets/images/photo-1578496479763-c21c718af028.jpeg"
              alt="Doctor Booking"
              style={{ width: "100%", maxHeight: "350px", objectFit: "cover" }}
            />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom>
            Book Your Doctor
          </Typography>
          <Typography variant="h6" gutterBottom>
            Say goodbye to waiting rooms! Choose your doctor, pick a time, and
            get ready to feel fabulous. Your health is just a click away!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Start Booking Now
          </Button>
        </Box>

        {/* ImageSlider moved below the main content */}
        <Box sx={{ mt: 5 }}>
          <ImageSlider />
        </Box>
         <FeaturesSection/>
      </Container>
  );
};

export default Home;
