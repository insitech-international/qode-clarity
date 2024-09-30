import React from "react";
import CategoryQuestionList from "../../components/category/CategoryQuestionList";
import { useQuestionData } from "../../hooks/useQuestionData";

const AdvancedDataStructuresPage = () => {
  const { questions, loading, error } = useQuestionData(
    "Advanced_Data_Structures"
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Advanced Data Structures</h1>
      <CategoryQuestionList questions={questions} />
    </div>
  );
};

export default AdvancedDataStructuresPage;
