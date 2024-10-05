import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Container, Box, Modal, Typography, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import CategoryDropdown from "./../Search/CategoryDropdown";
import SearchFilters from "./../Search/SearchFilters";
import { useCategories, useQuestionData } from "../../hooks/useQuestionData";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(location.search));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { categories } = useCategories();
  const { fetchQuestions } = useQuestionData();

  const handleSearch = useCallback(async (category, subcategory, searchTerm) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (category) newSearchParams.set("category", category);
    else newSearchParams.delete("category");

    if (subcategory) newSearchParams.set("subcategory", subcategory);
    else newSearchParams.delete("subcategory");

    if (searchTerm) newSearchParams.set("search", searchTerm);
    else newSearchParams.delete("search");

    setSearchParams(newSearchParams);
    navigate(`/search?${newSearchParams.toString()}`);
    setIsModalOpen(true);

    setLoading(true);
    try {
      const results = await fetchQuestions({ category, subcategory, search: searchTerm });
      setSearchResults(results);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams, navigate, fetchQuestions]);

  const handleFilterChange = useCallback(async (difficulty, company) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (difficulty) newSearchParams.set("difficulty", difficulty);
    else newSearchParams.delete("difficulty");

    if (company) newSearchParams.set("company", company);
    else newSearchParams.delete("company");

    setSearchParams(newSearchParams);
    navigate(`/search?${newSearchParams.toString()}`);
    setIsModalOpen(true);

    setLoading(true);
    try {
      const results = await fetchQuestions({ difficulty, company });
      setSearchResults(results);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams, navigate, fetchQuestions]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CategoryDropdown onSearch={handleSearch} categories={categories} />
              <SearchFilters onFilterChange={handleFilterChange} />
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="results-modal">
        <ModalContent>
          <Typography id="results-modal" variant="h6" component="h2" gutterBottom>
            Search Results
          </Typography>
          {loading && <CircularProgress />}
          {error && <Typography color="error">Error: {error}</Typography>}
          {!loading && searchResults.length === 0 && (
            <Typography>No results found.</Typography>
          )}
          {!loading && searchResults.map((question) => (
            <Typography key={question.id}>{question.title}</Typography>
          ))}
          <Button onClick={handleCloseModal}>Close</Button>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;