import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ message = "Loading..." }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
    >
      <CircularProgress size={60} />
      <Typography mt={2} variant="h6" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
