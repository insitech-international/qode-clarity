import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import QuestionPage from "./pages/QuestionPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ApiUnavailablePage from "./pages/ApiUnavailablePage";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    // Listen for API unavailable events
    const handleApiUnavailable = () => {
      console.log("API unavailable event detected");
      setApiAvailable(false);
    };

    window.addEventListener("api-unavailable", handleApiUnavailable);

    return () => {
      window.removeEventListener("api-unavailable", handleApiUnavailable);
    };
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          {apiAvailable && <Header />}
          {apiAvailable && <Navbar />}

          <Routes>
            {/* API Unavailable Route */}
            <Route path="/api-unavailable" element={<ApiUnavailablePage />} />

            {/* Main Routes - Only available if API is working */}
            {apiAvailable ? (
              <>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/category/:categoryName"
                  element={<CategoryPage />}
                />
                <Route
                  path="/category/:categoryName/questions"
                  element={<CategoryPage />}
                />
                <Route path="/question/:id" element={<QuestionPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </>
            ) : (
              // Redirect all other routes to api-unavailable when API is down
              <Route
                path="*"
                element={<Navigate to="/api-unavailable" replace />}
              />
            )}

            {/* Catch-all for undefined routes when API is available */}
            {apiAvailable && (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}
          </Routes>

          {apiAvailable && <Footer />}
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
