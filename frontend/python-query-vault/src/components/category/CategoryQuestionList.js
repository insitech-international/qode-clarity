import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuestionData } from "../../hooks/useQuestionData";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import QuestionCard from "./QuestionCard"; // New component for individual question cards

const CategoryQuestionList = ({ category }) => {
  const {
    questions,
    loading,
    error,
    totalQuestions,
    page,
    setPage,
    perPage,
    setPerPage,
    setCategory,
    setDifficulty,
  } = useQuestionData(1, 10);

  useEffect(() => {
    setCategory(category);
  }, [category, setCategory]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-6">{category} Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalQuestions / perPage)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default CategoryQuestionList;
