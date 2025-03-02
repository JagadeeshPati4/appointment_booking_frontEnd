import React, {useContext, useState } from "react";
import { TextField, Button, Container, Typography, Paper, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Notification from '../Notification'; 
import { AuthContext } from '../../context/AuthContext';
import {registerUser, loginUser} from '../../services/api'

const Image = styled("img")({
  width: "100%",
  maxHeight: "300px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "20px",
});

const AuthForm = () => {
  const {  login } = useContext(AuthContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();
  const defaultImage = "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174401.jpg?t=st=1740511678~exp=1740515278~hmac=7e57391a551339307a50a31a15c7edc1810c37a61fddd9d5a39e7724faedf293&w=740";

  const onSubmit = async (event) => {
    event.preventDefault();
    if (loading) return; // Prevent multiple requests
    setLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (previewImage) {
      data.image = previewImage;
    } else if (!data.image || data.image.size === 0) {
      console.log('defulat image')
      // data.image = defaultImage;
    }

    try {
      console.log('new user data',data)
      const api = isSignUp ? registerUser : loginUser;
      const response = await api(data);
      const result = response.data;
      console.log('response',response);
      console.log('result',result.user);
      if (response.status >= 200 & response.status <= 300) {
        login(result.token,result.user)
        
        setNotification({ open: true, message: "Authentication successful!", severity: "success" });
        setTimeout(() => navigate("/"), 1000);
      } else {
        setNotification({ open: true, message: result.data.message || "Authentication failed!", severity: "error" });
      }
    } catch (error) {
      console.log ('message:', error.response.data.message)
      setNotification({ open: true, message: error.response.data.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 8* 1024 * 1024; // 5MB in bytes
    if (file) {
      if (file.size > maxSize) {
        alert("File size must be less than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="100%" sx={{
      height: "100vh",
      backgroundImage: "url(https://r.mobirisesite.com/1235201/assets/images/photo-1576091160550-2173dba999ef.jpeg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
      color: "white",
      p: 0,
      m: 0,
    }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          <Image
            src={isSignUp
              ? "https://img.freepik.com/free-vector/hand-drawn-pill-cartoon-illustration_23-2150696191.jpg"
              : "https://img.freepik.com/free-vector/hand-drawn-doctor-cartoon-illustration_23-2150696182.jpg"}
            alt="Auth"
            sx={{ width: "50%", maxHeight: "150px", objectFit: "cover" }}
          />
          <Typography variant="h5" gutterBottom>
            {isSignUp ? "Sign Up" : "Login"}
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField fullWidth margin="normal" label="Email" name="email" required />
            <TextField fullWidth margin="normal" label="Password" type="password" name="password" required />
            {isSignUp && (
              <>
                <TextField fullWidth margin="normal" label="Username" name="username" required />
                <TextField fullWidth margin="normal" label="Phone Number" name="phoneNumber" required />
                {/* <input type="file" accept="image/*" onChange={handleImageUpload} name="image" style={{ marginTop: "10px" }} />
                {previewImage && (
                  <Avatar
                    src={previewImage}
                    alt="Preview"
                    sx={{ width: 80, height: 80, mt: 2, mx: "auto" }}
                  />
                )} */}
              </>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
            </Button>
          </form>
          <Button color="secondary" onClick={() => setIsSignUp(!isSignUp)} sx={{ mt: 2 }}>
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </Button>
        </Paper>
      </Container>

      {/* Use the Notification Component */}
      <Notification 
        open={notification.open} 
        message={notification.message} 
        severity={notification.severity} 
        onClose={() => setNotification({ ...notification, open: false })} 
      />
    </Container>
  );
};

export default AuthForm;
