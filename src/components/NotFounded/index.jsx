import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
      textAlign="center"
    >
      <Typography variant="h1" color="primary" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" color="textSecondary">
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button 
        variant="contained" 
        sx={{ mt: 3 }} 
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
