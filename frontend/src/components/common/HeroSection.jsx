import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme,
  useMediaQuery,
  Fade
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowForward, SettingsEthernet, Psychology } from "@mui/icons-material";
import SolveFrameworkModal from "./SolveFrameworkModal"; // Import the SolveFrameworkModal

// Color Palette
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

// Typography Styles
const typographyStyles = {
  h1: {
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
  h3: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
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
  }
};

const HeroSection = ({ openMethodologyModal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeCard, setActiveCard] = useState(null);
  
  // State for the SOLVE Framework Modal
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const openSolveModal = () => setIsSolveModalOpen(true);
  const closeSolveModal = () => setIsSolveModalOpen(false);

  // Animation variants
  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    },
    tap: {
      y: 0,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.1 }
    }
  };

  // Methodology definitions
  const methodologies = [
    {
      id: "solve",
      title: "SOLVE Framework",
      subtitle: "Problem Decomposition Method",
      description: "A structured approach to breaking down complex problems into manageable steps. Perfect for technical interviews and algorithmic challenges.",
      steps: ["Split the problem", "Observe examples", "Look for tools", "Verify edge cases", "Evolve your solution"],
      icon: <SettingsEthernet sx={{ fontSize: 40, color: COLORS.accent }} />,
      color: COLORS.primary,
      action: openSolveModal // Connect to our modal open function
    },
    {
      id: "strategic",
      title: "Strategic Visualization",
      subtitle: "The 5-Dimension Approach",
      description: "Master algorithms by understanding problems from multiple perspectives. Gain deeper insights through varied mental models.",
      steps: ["Pythonic implementation", "Mathematical abstraction", "Real-world analogies", "Visual representation", "Conceptual storytelling"],
      icon: <Psychology sx={{ fontSize: 40, color: COLORS.primary }} />,
      color: COLORS.accent,
      action: openMethodologyModal
    }
  ];

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          background: COLORS.secondary,
          color: COLORS.primary,
          py: { xs: 4, md: 8 },
          mb: 4,
          borderRadius: 0
        }}
      >
        <Container maxWidth="lg">
          {/* Main title */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              align="center"
              sx={typographyStyles.h1}
            >
              Qode Clarity
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                ...typographyStyles.body1,
                fontSize: "1.25rem",
                maxWidth: "800px",
                mx: "auto",
                mb: 3
              }}
            >
              Master algorithms and ace technical interviews with our dual-methodology approach that combines structured problem-solving with multi-dimensional understanding.
            </Typography>
            <Divider sx={{ 
              width: "120px", 
              mx: "auto", 
              height: "4px", 
              backgroundColor: COLORS.accent,
              borderRadius: "2px",
              my: 3
            }} />
          </Box>

          {/* Framework cards */}
          <Grid 
            container 
            spacing={isMobile ? 4 : 6}
            direction={isMobile ? "column" : "row"}
            justifyContent="center"
            alignItems="stretch"
            sx={{ mb: 4 }}
          >
            {methodologies.map((method) => (
              <Grid item xs={12} md={6} key={method.id}>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onMouseEnter={() => setActiveCard(method.id)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                      border: `1px solid ${method.color}20`,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "5px",
                        backgroundColor: method.color
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        {method.icon}
                        <Typography
                          variant="h3"
                          component="h2"
                          sx={{
                            ...typographyStyles.h3,
                            ml: 2,
                            color: method.color
                          }}
                        >
                          {method.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          fontStyle: "italic",
                          mb: 2,
                          color: COLORS.gray.dark
                        }}
                      >
                        {method.subtitle}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          ...typographyStyles.body1,
                          mb: 3
                        }}
                      >
                        {method.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2, mt: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: method.color
                          }}
                        >
                          Key Components:
                        </Typography>
                        <Grid container spacing={1}>
                          {method.steps.map((step, index) => (
                            <Grid item xs={6} key={index}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  p: 1,
                                  backgroundColor: `${method.color}10`,
                                  borderRadius: "4px"
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500
                                  }}
                                >
                                  {index + 1}. {step}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        endIcon={<ArrowForward />}
                        onClick={method.action}
                        sx={{
                          ...typographyStyles.button,
                          color: COLORS.secondary,
                          backgroundColor: method.color,
                          py: 1,
                          px: 3,
                          '&:hover': {
                            backgroundColor: method.id === 'solve' ? '#003A89' : '#D07848',
                          }
                        }}
                      >
                        Explore {method.title}
                      </Button>
                    </CardActions>

                    {/* Background pattern */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "150px",
                        height: "150px",
                        opacity: 0.05,
                        background: `radial-gradient(circle, ${method.color} 10%, transparent 10.5%)`,
                        backgroundSize: "20px 20px",
                        zIndex: 0,
                        transform: "rotate(15deg)",
                        pointerEvents: "none"
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Call to action */}
          <Box 
            sx={{ 
              textAlign: "center", 
              mt: 5, 
              p: 3, 
              backgroundColor: `${COLORS.primary}05`,
              borderRadius: "8px"
            }}
          >
            <Typography
              variant="h5"
              sx={{
                ...typographyStyles.h5,
                mb: 2,
                fontWeight: 500
              }}
            >
              Ready to transform your problem-solving abilities?
            </Typography>
            <Button
              variant="contained"
              sx={{
                ...typographyStyles.button,
                backgroundColor: COLORS.accent,
                color: COLORS.secondary,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#D07848'
                }
              }}
            >
              Start Learning Today
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* SOLVE Framework Modal */}
      <SolveFrameworkModal 
        open={isSolveModalOpen} 
        onClose={closeSolveModal} 
      />
    </>
  );
};

export default HeroSection;