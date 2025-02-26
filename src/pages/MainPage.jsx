import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import { Box } from "@mui/material";

const MainPage = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundImage:
          "url(https://r.mobirisesite.com/1235201/assets/images/photo-1576091160550-2173dba999ef.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        overflowX: "hidden",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "white",
        p: 3,
      }}
    >
      {/* Fixed Navbar */}
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Navbar />
      </Box>

      <Outlet />
    </Box>
  );
};

export default MainPage;
