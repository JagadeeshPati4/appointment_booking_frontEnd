import React from "react";
import { Container, Grid, Typography, Card, CardContent, CardMedia, Box } from "@mui/material";

const features = [
  {
    title: "Easy Doctor Selection",
    text: "Browse and select from top-notch medical professionals.",
    image: "https://r.mobirisesite.com/1235201/assets/images/photo-1584982751601-97dcc096659c.jpeg",
  },
  {
    title: "Quick Booking Process",
    text: "Book your appointment in just a few clicks.",
    image: "https://r.mobirisesite.com/1235201/assets/images/photo-1434494878577-86c23bcb06b9.jpeg",
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ backgroundColor: "#051706", py: 5, maxWidth: "100%" }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" color="white" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ display: "flex", backgroundColor: "#051706", border: "1px solid #598392", color: "white" }}>
                <CardContent sx={{ flex: 1, padding: 3 }}>
                  <Typography variant="h5" gutterBottom>{feature.title}</Typography>
                  <Typography variant="body1">{feature.text}</Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  image={feature.image}
                  alt={feature.title}
                  sx={{ width: "50%", objectFit: "cover" }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
