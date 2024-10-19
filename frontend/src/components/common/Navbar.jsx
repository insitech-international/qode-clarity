import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Container, Box, Modal, Typography, Button, CircularProgress, TextField, MenuItem, IconButton, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { useQuestionData } from "../../hooks/useQuestionData";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  outline: 0,
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  [`& fieldset`]: {
    borderColor: theme.palette.primary.light,
  },
  [`&:hover fieldset`]: {
    borderColor: theme.palette.primary.main,
  },
  [`&.Mui-focused fieldset`]: {
    borderColor: theme.palette.primary.dark,
  },
}));

// Function to extract categories and subcategories from the file structure
const extractCategoriesAndSubcategories = () => {
  const categories = [
    "Advanced_Python_Concepts",
    "Algorithms_and_Data_Structures",
    "Basics",
    "Best_Practices_and_Code_Style",
    "Concurrency",
    "Database_Operations",
    "Data_Science_and_Machine_Learning",
    "Deployment_and_DevOps",
    "Design_Patterns",
    "Exception_Handling",
    "File_Handling",
    "Networking",
    "Object_Oriented_Programming",
    "Performance_Optimization",
    "Python_2_to_3_Migration",
    "Security",
    "Standard_Library_Deep_Dive",
    "Testing",
    "Web_Development"
  ];

  const subcategories = {
    "Advanced_Python_Concepts": ["Context_Managers", "Coroutines_and_AsyncIO", "Descriptors", "Generators_and_Iterators", "Metaclasses"],
    "Algorithms_and_Data_Structures": ["Advanced_Data_Structures", "Array", "Backtracking", "Bit_Manipulation", "Computational_Geometry", "Data_Structures", "Design", "Divide_and_Conquer", "Dynamic_Programming", "Functional_Programming", "Graph_Algorithms", "Greedy_Algorithms", "Heap", "Linked_List", "Mathematical_Algorithms", "Python_Internals", "Searching", "Sorting", "String_Algorithms", "Tree_Algorithms", "Two_Pointers"],
    "Basics": ["Control_Flow", "Data_Types", "Functions", "Modules_and_Packages"],
    "Best_Practices_and_Code_Style": ["Code_Documentation", "Code_Organization"],
    "Concurrency": ["Asyncio", "Concurrent_Futures", "Mixing_Concurrency_Models", "Multiprocessing", "Threading"],
    "Database_Operations": ["NoSQL_Databases", "ORM", "SQL_Databases"],
    "Data_Science_and_Machine_Learning": ["Deep_Learning", "Machine_Learning_Pipelines", "Matplotlib_and_Seaborn", "NumPy", "Pandas", "Scikit-learn"],
    "Deployment_and_DevOps": ["CI_CD", "Containerization", "Orchestration_and_Automation", "Package_Management", "Serverless", "Virtual_Environments"],
    "Design_Patterns": ["Behavioral_Patterns", "Creational_Patterns", "Structural_Patterns"],
    "Networking": ["HTTP_Requests", "Socket_Programming", "Web_Scraping"],
    "Object_Oriented_Programming": ["Abstract_Classes_and_Interfaces", "Classes_and_Objects", "Encapsulation", "Inheritance", "Polymorphism"],
    "Performance_Optimization": ["Code_Optimization", "Profiling"],
    "Security": ["Cryptography", "Web_Security"],
    "Standard_Library_Deep_Dive": ["Collections_Module", "Concurrent_Module", "Functools_Module", "Itertools_Module", "Re_Module", "Typing_Module"],
    "Testing": ["Mocking", "Test_Coverage", "Unit_Testing"],
    "Web_Development": ["Django", "FastAPI", "Flask"]
  };

  return { categories, subcategories };
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(location.search));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    difficulty: "",
    category: "",
    subcategory: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  const { fetchQuestions } = useQuestionData();

  useEffect(() => {
    const { categories, subcategories } = extractCategoriesAndSubcategories();
    setCategories(categories);
    setSubcategories(subcategories);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("search", searchTerm);
    setSearchParams(newSearchParams);
    navigate(`/search?${newSearchParams.toString()}`);
    setIsModalOpen(true);

    setLoading(true);
    try {
        const results = await fetchQuestions({ search: searchTerm, ...filters });
        console.log('Search Results:', results); // Debugging
        setSearchResults(Array.isArray(results) ? results : []); // Ensure results is always an array
        setError(null);
    } catch (err) {
        setError(err.message);
        setSearchResults([]); // Reset results on error
    } finally {
        setLoading(false);
    }
}, [searchTerm, filters, searchParams, navigate, fetchQuestions]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    if (filterName === 'category') {
      setFilters(prevFilters => ({
        ...prevFilters,
        subcategory: '',
      }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SearchBar
                variant="outlined"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setSearchTerm("")}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="search-modal">
        <ModalContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography id="search-modal" variant="h6" component="h2">
              Search Results
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Difficulty"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </TextField>
          </Box>

          {/* Categories filter */}
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Subcategories filter */}
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Subcategory"
              value={filters.subcategory}
              onChange={(e) => handleFilterChange('subcategory', e.target.value)}
              fullWidth
              disabled={!filters.category}
            >
              <MenuItem value="">All</MenuItem>
              {filters.category && subcategories[filters.category]?.map((subcategory) => (
                <MenuItem key={subcategory} value={subcategory}>
                  {subcategory.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Apply button */}
          <Button onClick={handleSearch} variant="contained" color="primary" fullWidth>
            Apply Filters
          </Button>

          {/* Loading spinner */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error message */}
          {error && <Typography color="error">Error: {error}</Typography>}

          {/* No results message */}
          {!loading && !error && searchResults.length === 0 && (
            <Typography>No results found.</Typography>
          )}

          {/* Search results */}
          {!loading && searchResults.map((question) => (
            <Typography key={question.id}>{question.title}</Typography>
          ))}

          <Button onClick={handleCloseModal} sx={{ mt: 2 }} fullWidth>
            Close
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
