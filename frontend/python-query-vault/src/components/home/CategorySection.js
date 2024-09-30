import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "./../../components/common/LoadingSpinner";

const CategorySection = ({ category }) => {
  const urlSlug = category.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300 cursor-pointer">
      <Link to={`/category/${urlSlug}`} className="w-full h-full p-0">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
          <p className="text-sm text-gray-600 mb-4">{category.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1, 2, 3, 4].map((index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </Link>
      <div className="mt-auto flex justify-center">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
          Explore
        </button>
      </div>
    </div>
  );
};

const CategoryCard = ({ category, index }) => {
  const cardClass = ["bg-white rounded-lg shadow-md"];
  const titleClass = ["text-xl font-semibold"];

  return (
    <div className={`${cardClass.join(" ")}`}>
      <div className="p-4">
        <h3 className={titleClass.join(" ")}>
          {category.sampleQuestions[index]?.title || "Sample Question"}
        </h3>
        <p className="text-sm text-gray-600">
          {category.sampleQuestions[index]?.description || "Description"}
        </p>
      </div>
      <img
        src={`images/mindmaps/${category.id}.svg`}
        alt={`Mindmap for ${category.name}`}
        className="max-w-full rounded-lg shadow-md"
      />
    </div>
  );
};

export default CategorySection;
