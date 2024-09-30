import React from "react";
import CategoryCard from "../components/category/CategoryCard";
import { useCategories } from "../hooks/useQuestionData";

const HomePage = () => {
  const { categories, loading, error } = useCategories();
  console.log(`Categories:`, categories);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Python Query Vault</h1>

      {categories.length > 0 ? (
        categories.map((category) => (
          <section key={category.name} className="mb-12">
            {/* <h2 className="text-2xl font-semibold mb-4">{category.name}</h2> */}
            {/* <img
              src={category.diagram_path}
              alt={`${category.name} diagram`}
              className="mt-4"
            /> */}

            {category.questions && category.questions.length > 0 ? (
              category.questions.map((question) => (
                <CategoryCard
                  key={question.id}
                  category={category}
                  questions={[question]}
                />
              ))
            ) : (
              <p>No questions available for this category.</p>
            )}
          </section>
        ))
      ) : (
        <p>No categories available. Please check your backend connection.</p>
      )}
    </div>
  );
};

export default HomePage;
