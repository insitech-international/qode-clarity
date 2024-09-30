import React, { useEffect, useState } from "react";
import { useQuestionData } from "./../../hooks/useQuestionData"; // Adjust the import path as necessary
import { usePagination } from "./../../hooks/usePagination"; // Adjust the import path as necessary

const StringAlgorithmsPage = () => {
  const {
    questions,
    loading,
    error,
    totalQuestions,
    page,
    setPage,
    perPage,
    setPerPage,
    fetchQuestionDetails,
    fetchSolution,
  } = useQuestionData(1, 10);

  const { currentPage, totalPages, handlePageChange } = usePagination(
    totalQuestions,
    perPage
  );
  const [expandedQuestions, setExpandedQuestions] = useState({}); // Track expanded question IDs

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage, setPage]);

  const handleQuestionClick = async (questionId) => {
    try {
      const questionDetails = await fetchQuestionDetails(questionId);
      const solution = await fetchSolution(questionId);
      setExpandedQuestions((prev) => ({
        ...prev,
        [questionId]: {
          details: questionDetails,
          solution,
          isOpen: !prev[questionId]?.isOpen,
        },
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">String Algorithms Questions</h1>
      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex flex-col gap-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="border border-gray-300 rounded-lg shadow-md p-4 cursor-pointer"
          >
            <div
              className="flex justify-between items-center"
              onClick={() => handleQuestionClick(question.id)}
            >
              <h2 className="text-lg font-semibold">{question.title}</h2>
              <span className="text-lg">
                {expandedQuestions[question.id]?.isOpen ? "-" : "+"}
              </span>
            </div>
            {expandedQuestions[question.id]?.isOpen && (
              <div className="mt-2">
                <p className="font-medium">
                  <strong>Details:</strong>{" "}
                  {expandedQuestions[question.id].details.description}
                </p>
                <div className="mt-2">
                  <h3 className="font-semibold">Solution:</h3>
                  <pre className="bg-gray-100 p-2 rounded border border-gray-300">
                    {expandedQuestions[question.id].solution.code}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {totalQuestions > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300 ml-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StringAlgorithmsPage;
