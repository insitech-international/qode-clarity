import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuestionData } from "../hooks/useQuestionData";
import QuestionDetails from "../components/category/QuestionDetails"; // New component for question details
import LoadingSpinner from "../components/common/LoadingSpinner"; // Assuming a loading spinner component

const QuestionPage = () => {
  const { id } = useParams();
  const { fetchQuestionDetails, fetchSolution } = useQuestionData();
  const [question, setQuestion] = useState(null);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const questionData = await fetchQuestionDetails(id);
        const solutionData = await fetchSolution(id);
        setQuestion(questionData);
        setSolution(solutionData);
      } catch (err) {
        setError("Failed to load question or solution");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchQuestionDetails, fetchSolution]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
      <QuestionDetails question={question} />

      {/* Collapsible section for the solution */}
      <CollapsibleHeader title="View Solution">
        <div className="mt-2">
          <p>{solution?.content || "Solution not available."}</p>
        </div>
      </CollapsibleHeader>

      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

// Collapsible Header Component
const CollapsibleHeader = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md p-4 mb-4 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between w-full text-left text-blue-600 hover:underline focus:outline-none"
      >
        <span>{title}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default QuestionPage;
