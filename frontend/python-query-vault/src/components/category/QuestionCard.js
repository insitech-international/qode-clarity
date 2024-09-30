import React from "react";
import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
      <Link to={`/question/${question.id}`} className="block p-6">
        <h3 className="text-xl font-semibold mb-2">{question.title}</h3>
        <p className="text-gray-600 mb-4">{question.description}</p>
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
          Difficulty: {question.difficulty}
        </span>
      </Link>
    </div>
  );
};

export default QuestionCard;
