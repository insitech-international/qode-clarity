// pages/CategoryPage.js
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionList from "../components/category/CategoryQuestionList";
import { useQuestionData } from "../hooks/useQuestionData";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { questions, loading, error, setCategory, setPage, totalQuestions } =
    useQuestionData();

  useEffect(() => {
    setCategory(categoryName); // Set the category based on URL param
    setPage(1); // Reset to the first page when the category changes
  }, [categoryName, setCategory, setPage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
      <QuestionList questions={questions} />
      {totalQuestions > 10 && (
        <div className="pagination">
          {/* Implement pagination controls here */}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
