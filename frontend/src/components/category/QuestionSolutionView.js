import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tabs,
  Tab,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MarkdownRenderer from "../common/MarkdownRenderer";

const CombinedQuestionSolutionView = ({ question, solution }) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        {question ? (
          <QuestionCard question={question} />
        ) : (
          <Typography variant="h6">No question data available</Typography>
        )}
      </Grid>
      <Grid item xs={12} lg={6}>
        {solution ? (
          <SolutionCard
            solution={solution}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
            isSmallScreen={isSmallScreen}
          />
        ) : (
          <Typography variant="h6">No solution data available</Typography>
        )}
      </Grid>
    </Grid>
  );
};

const QuestionCard = ({ question }) => (
  <Card
    elevation={3}
    sx={{ height: "100%", display: "flex", flexDirection: "column" }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
        >
          {question.title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={`ID: ${question.question_id}`}
            color="primary"
            size="small"
          />
          <Chip
            label={question.difficulty}
            color={
              question.difficulty === "Hard"
                ? "error"
                : question.difficulty === "Medium"
                ? "warning"
                : "success"
            }
            size="small"
          />
        </Box>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mt={1}
        >
          {question.category} - {question.subcategory}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Section title="Similar Questions">
        <Box display="flex" gap={1} flexWrap="wrap">
          {question.similar_questions?.map((q, index) => (
            <Chip key={index} label={q} variant="outlined" size="small" />
          )) || "No similar questions available"}
        </Box>
      </Section>

      <Section title="Real-life Domains">
        <Box display="flex" gap={1} flexWrap="wrap">
          {question.real_life_domains?.map((domain, index) => (
            <Chip key={index} label={domain} variant="outlined" size="small" />
          )) || "No real-life domains specified"}
        </Box>
      </Section>

      <AccordionSection title="Problem Versions">
        {question.problem_versions?.map((version, index) => (
          <Box key={index} mb={2}>
            <MarkdownRenderer content={version} />
          </Box>
        )) || "No problem versions available"}
      </AccordionSection>

      <AccordionSection title="Constraints">
        <MarkdownRenderer
          content={
            question.constraints?.join("\n") || "No constraints specified"
          }
        />
      </AccordionSection>

      <AccordionSection title="Notes">
        <MarkdownRenderer
          content={question.notes?.join("\n") || "No notes available"}
        />
      </AccordionSection>
    </CardContent>
  </Card>
);

const SolutionCard = ({
  solution,
  tabValue,
  handleTabChange,
  isSmallScreen,
}) => {
  const tabContent = [
    {
      label: "Overview",
      content: solution.introduction,
      description: "Introduces the problem and its significance.",
    },
    {
      label: "Classification",
      content: solution.classification_rationale,
      description: "Justifies the problem categorization.",
    },
    {
      label: "BUCESR Framework",
      content: solution.bucesr_framework,
      isCode: true,
      description: "Detailed Python implementation with BUCESR framework.",
    },
    {
      label: "Pythonic Implementation",
      content: solution.pythonic_implementation,
      isCode: true,
      description: "Detailed Python implementation of the approach.",
    },
    {
      label: "Mathematical",
      content: solution.mathematical_abstraction,
      description: "Formalizes the problem using mathematical notation.",
    },
    {
      label: "Real-world",
      content: solution.real_world_analogies,
      description: "Connects the problem to practical scenarios.",
    },
    {
      label: "Storytelling",
      content: solution.storytelling_approach,
      description: "Explains the solution as a story for a 6-year-old.",
    },
    {
      label: "Visual",
      content: solution.visual_representation,
      description: "Graphical depiction of the solution.",
    },
    {
      label: "Complexity",
      content: solution.complexity_analysis,
      isCode: true,
      description: "Time and Space Complexity Analysis.",
    },
  ];

  const tabsRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (tabsRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = tabsRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleTabsScroll = () => {
    if (tabsRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  if (tabContent.length === 0) {
    return <Typography>No solution content available</Typography>;
  }

  return (
    <Card
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "secondary.main" }}>
          Solution
        </Typography>
        <Box
          sx={{ position: "relative", display: "flex", alignItems: "center" }}
        >
          {showLeftArrow && (
            <IconButton
              onClick={() => handleScroll("left")}
              sx={{ position: "absolute", left: 0, zIndex: 1 }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            ref={tabsRef}
            onScroll={handleTabsScroll}
            sx={{
              mb: 2,
              "& .MuiTabs-scroller": {
                overflow: "hidden !important",
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            {tabContent.map((tab, index) => (
              <Tooltip key={index} title={tab.description} arrow>
                <Tab
                  label={
                    <Box display="flex" alignItems="center">
                      {tab.label}
                      <IconButton size="small" sx={{ ml: 0.5 }}>
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    textTransform: "none",
                    minWidth: "auto",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Tabs>
          {showRightArrow && (
            <IconButton
              onClick={() => handleScroll("right")}
              sx={{ position: "absolute", right: 0, zIndex: 1 }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
        <Box mt={2} sx={{ flexGrow: 1, overflow: "auto" }}>
          <MarkdownRenderer content={tabContent[tabValue].content} />
        </Box>
      </CardContent>
    </Card>
  );
};

const Section = ({ title, children }) => (
  <Box mb={3}>
    <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
      {title}
    </Typography>
    {children}
    <Divider sx={{ mt: 2 }} />
  </Box>
);

const AccordionSection = ({ title, children }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6" sx={{ color: "primary.dark" }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

export default CombinedQuestionSolutionView;
