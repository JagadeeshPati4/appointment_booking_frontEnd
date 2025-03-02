import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout,user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate('/home'); 
    logout(); 
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Doctors", path: "/doctors" },
    { title: "Appointments", path: "/appointments" },
  ];

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#002400", px: 2, width:"100%" }}>
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "#fff", textAlign: "start" }}
          >
            DocuBook
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                component={Link}
                to={link.path}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { color: "#80e27e" },
                }}
              >
                {link.title}
              </Button>
            ))}

            {isLoggedIn ? (
              <Button
                component='button'
                onClick={handleLogout}
                sx={{
                  bgcolor: "#4CAF50",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#388E3C" },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  bgcolor: "#4CAF50",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#388E3C" },
                }}
              >
                Get Started
              </Button>
            )}
             {isLoggedIn && user?.isAdmin && (
              <Button
                component={Link}
                to="/admin"
                sx={{
                  bgcolor: "#4CAF50",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#388E3C" },
                }}
              >
                Admin
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250, bgcolor: "#002400", height: "100%" }}>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: "bold", p: 2 }}
          >
            DocuBook
          </Typography>
          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.title}
                component={Link}
                to={link.path}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={link.title} sx={{ color: "#fff" }} />
              </ListItem>
            ))}
            {isLoggedIn?<ListItem
              button
              component={Link}
              to="/Login"
              onClick={handleLogout}
            >
              <ListItemText
                primary="Logout"
                sx={{ color: "#80e27e", fontWeight: "bold" }}
              />
            </ListItem>:
            <ListItem
              button
              component={Link}
              to="/Login"
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary="Get Started"
                sx={{ color: "#80e27e", fontWeight: "bold" }}
              />
            </ListItem>}
            {isLoggedIn && user?.isAdmin && ( <ListItem
              button
              component={Link}
              to="/admin"
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary="admin"
                sx={{ color: "#80e27e", fontWeight: "bold" }}
              />
            </ListItem>)}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;