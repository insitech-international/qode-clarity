import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import QuestionPage from "./pages/QuestionPage";
import CategoryPage from "./pages/CategoryPage";
import AdvancedDataStructuresPage from "./pages/CategoryPages/AdvancedDataStructuresPage";
import ArrayAndStringManipulationPage from "./pages/CategoryPages/ArrayAndStringManipulationPage";
import BacktrackingAndRecursionPage from "./pages/CategoryPages/BacktrackingAndRecursionPage";
import BitManipulationPage from "./pages/CategoryPages/BitManipulationPage";
import ConcurrencyAndParallelProgrammingPage from "./pages/CategoryPages/ConcurrencyAndParallelProgrammingPage";
import DynamicProgrammingPage from "./pages/CategoryPages/DynamicProgrammingPage";
import GreedyAlgorithmsPage from "./pages/CategoryPages/GreedyAlgorithmsPage";
import HeapAndPriorityQueuePage from "./pages/CategoryPages/HeapAndPriorityQueuePage";
import LinkedListTechniquesPage from "./pages/CategoryPages/LinkedListTechniquesPage";
import MathAndNumberTheoryPage from "./pages/CategoryPages/MathAndNumberTheoryPage";
import PythonSpecificConceptsPage from "./pages/CategoryPages/PythonSpecificConceptsPage";
import SearchingAndSortingPage from "./pages/CategoryPages/SearchingAndSortingPage";
import StringAlgorithmsPage from "./pages/CategoryPages/StringAlgorithmsPage";
import SystemDesignAndOOPPage from "./pages/CategoryPages/SystemDesignAndOOPPage";
import TreeAndGraphAlgorithmsPage from "./pages/CategoryPages/TreeAndGraphAlgorithmsPage";
import AboutPage from "./pages/AboutPage"; // Assuming you have this page
import ContactPage from "./pages/ContactPage"; // Assuming you have this page

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/question/:id" element={<QuestionPage />} />

          <Route
            path="/advanced-data-structures"
            element={<AdvancedDataStructuresPage />}
          />
          <Route
            path="/array-and-string-manipulation"
            element={<ArrayAndStringManipulationPage />}
          />
          <Route
            path="/backtracking-and-recursion"
            element={<BacktrackingAndRecursionPage />}
          />
          <Route path="/bit-manipulation" element={<BitManipulationPage />} />
          <Route
            path="/concurrency-and-parallel-programming"
            element={<ConcurrencyAndParallelProgrammingPage />}
          />
          <Route
            path="/dynamic-programming"
            element={<DynamicProgrammingPage />}
          />
          <Route path="/greedy-algorithms" element={<GreedyAlgorithmsPage />} />
          <Route
            path="/heap-and-priority-queue"
            element={<HeapAndPriorityQueuePage />}
          />
          <Route
            path="/linked-list-techniques"
            element={<LinkedListTechniquesPage />}
          />
          <Route
            path="/math-and-number-theory"
            element={<MathAndNumberTheoryPage />}
          />
          <Route
            path="/python-specific-concepts"
            element={<PythonSpecificConceptsPage />}
          />
          <Route
            path="/searching-and-sorting"
            element={<SearchingAndSortingPage />}
          />
          <Route path="/string-algorithms" element={<StringAlgorithmsPage />} />
          <Route
            path="/system-design-and-oop"
            element={<SystemDesignAndOOPPage />}
          />
          <Route
            path="/tree-and-graph-algorithms"
            element={<TreeAndGraphAlgorithmsPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
