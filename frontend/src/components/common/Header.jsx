import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Modal,
  Box,
  List,
  ListItem,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import SolveFrameworkModal from "./SolveFrameworkModal"; // Import the new modal component

// InsiTech Color Palette (Updated)
const COLORS = {
  primary: '#0047AB',      // Deep Blue
  secondary: '#F8F8F8',    // Off-White
  accent: '#E99361',       // Deep Orange / Coral
  interactive: '#4DB6AC',  // Teal / Light Blue
  gray: {
    light: '#EEEEEE',
    medium: '#9E9E9E',
    dark: '#424242'
  }
};

// Typography Styles (Updated)
const typographyStyles = {
  h1: {  // Not used in this component, but keep for consistency
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '0.02em',
    color: COLORS.primary
  },
  h2: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.02em',
    color: COLORS.primary
  },
  h5: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: COLORS.primary
  },
  body1: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: COLORS.gray.dark
  },
  button: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none'
  },
  modalTitle: { // New style for modal titles
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2rem', // Adjust as needed
    fontWeight: 700,
    color: COLORS.primary
  },
  modalSubtitle: { // New style for modal subtitles
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.2rem', // Adjust as needed
    fontWeight: 600,
    color: COLORS.primary
  },
  modalText: { // New style for modal body text
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: COLORS.primary
  },
  listItemText: { // Style for list items in the modal
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
    color: COLORS.primary
  }
};


// Styled Components (Updated with InsiTech styles)

const StyledAppBar = styled(AppBar)(() => ({
  background: COLORS.secondary, // Use the main secondary color
  color: COLORS.primary,
  boxShadow: 'none'
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: '16px 24px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  ...typographyStyles.button,  // Use typography styles
  color: COLORS.primary,
  marginLeft: theme.spacing(2),
  padding: theme.spacing(1, 3),
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: COLORS.accent,
    color: COLORS.secondary, // White on hover
  },
  transition: 'background-color 0.3s, color 0.3s'
}));

const NavLinks = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const modalStyle = (theme) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  maxHeight: '90vh',
  bgcolor: COLORS.secondary, // Use secondary color for modal background
  color: COLORS.primary,
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  borderRadius: '8px', // Add rounded corners to the modal
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    p: 2
  }
});

const Header = () => {
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const openSolveModal = () => setIsSolveModalOpen(true);
  const closeSolveModal = () => setIsSolveModalOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "SOLVE Framework", action: openSolveModal },
  ];

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              color: COLORS.primary
            }}
          >
            Qode Clarity
          </Typography>

          {isMobile ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <NavLinks>
              {navItems.map((item) => (
                item.action ? (
                  <StyledButton key={item.name} onClick={item.action}>
                    {item.name}
                  </StyledButton>
                ) : (
                  <StyledButton key={item.name} component={Link} to={item.path}>
                    {item.name}
                  </StyledButton>
                )
              ))}
            </NavLinks>
          )}
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile Menu */}
      <Modal
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        aria-labelledby="mobile-menu-modal"
      >
        <Box sx={{
          ...modalStyle(theme),
          backgroundColor: COLORS.secondary,
          color: COLORS.primary
        }}>
          <IconButton
            onClick={toggleMobileMenu}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: COLORS.primary
            }}
          >
            <CloseIcon />
          </IconButton>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.name}
                onClick={() => {
                  if (item.action) item.action();
                  toggleMobileMenu();
                }}
                component={item.path ? Link : 'li'}
                to={item.path}
                sx={{
                  backgroundColor: COLORS.gray.light,
                  margin: '8px 0',
                  borderRadius: '4px'
                }}
              >
                <StyledButton
                  fullWidth
                  sx={{
                    textAlign: 'center',
                    color: COLORS.primary
                  }}
                >
                  {item.name}
                </StyledButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>

      {/* Use the new SOLVE Framework Modal component */}
      <SolveFrameworkModal 
        open={isSolveModalOpen} 
        onClose={closeSolveModal} 
      />
    </>
  );
};

export default Header;