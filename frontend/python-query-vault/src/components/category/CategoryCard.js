import React, { useState } from "react";

const CategoryCard = ({ category, questions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const displayQuestion = (question) => {
    if (!question) return null;

    const displayProperty = (property, label) => {
      if (typeof property === "object" && property !== null) {
        return <pre>{JSON.stringify(property, null, 2)}</pre>; // Display as pretty-printed JSON
      }
      return property || "Not available";
    };

    return (
      <>
        <div className="mb-4">
          <button
            onClick={toggleExpansion}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            {isExpanded ? "Collapse" : "Expand"} Question Details
          </button>
        </div>

        {isExpanded && (
          <>
            <dl className="space-y-2">
              <dt>Category</dt>
              <dd>{displayProperty(category.name, "Category")}</dd>

              <dt>Title</dt>
              <dd>{displayProperty(question.title, "Title")}</dd>

              <dt>Difficulty</dt>
              <dd>{displayProperty(question.difficulty, "Difficulty")}</dd>

              <dt>Real-life Domains</dt>
              <dd>
                <ul className="list-disc pl-5 space-y-1">
                  {Array.isArray(question.real_life_domains)
                    ? question.real_life_domains.map((domain, index) => (
                        <li key={index}>
                          {displayProperty(domain, `Domain ${index + 1}`)}
                        </li>
                      ))
                    : "Not available"}
                </ul>
              </dd>

              <dt>Scenario</dt>
              <dd>{displayProperty(question.scenario, "Scenario")}</dd>

              <dt>Task</dt>
              <dd>{displayProperty(question.task, "Task")}</dd>

              <dt>Examples</dt>
              <dd>
                <ul className="list-disc pl-5 space-y-1">
                  {Array.isArray(question.examples)
                    ? question.examples.map((example, index) => (
                        <li key={index}>{JSON.stringify(example, null, 2)}</li>
                      ))
                    : "Not available"}
                </ul>
              </dd>

              <dt>Constraints</dt>
              <dd>
                <ul className="list-disc pl-5 space-y-1">
                  {Array.isArray(question.constraints)
                    ? question.constraints.map((constraint, index) => (
                        <li key={index}>
                          {displayProperty(
                            constraint,
                            `Constraint ${index + 1}`
                          )}
                        </li>
                      ))
                    : "Not available"}
                </ul>
              </dd>
            </dl>
          </>
        )}
      </>
    );
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold">{category.name}</h3>
      <img
        src={category.diagram_path}
        alt={`${category.name} diagram`}
        className="mt-4"
      />

      {questions.map((question) => (
        <>
          {displayQuestion(question)}

          <hr className="my-4" />

          <div className="mb-4">
            <button
              onClick={toggleExpansion}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              {isExpanded ? "Collapse" : "Expand"} Solution
            </button>
          </div>

          {isExpanded && (
            <pre className="p-4 bg-gray-100 rounded-lg">
              {JSON.stringify(question.solution, null, 2)}
            </pre>
          )}
        </>
      ))}

      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Explore More
      </button>
    </div>
  );
};

export default CategoryCard;
