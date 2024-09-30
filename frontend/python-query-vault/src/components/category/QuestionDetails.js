import React from "react";

const QuestionDetails = ({ question }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300 p-6">
      <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
      <p className="text-gray-600 mb-4">{question.description}</p>
      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
        Difficulty: {question.difficulty}
      </span>

      {/* Scenario */}
      <Section title="Scenario" content={question.scenario} />

      {/* Real-life Domains */}
      <Section title="Real-life Domains">
        <ul className="list-disc pl-5 mb-4">
          {question.real_life_domains.map((domain) => (
            <li key={domain}>{domain}</li>
          ))}
        </ul>
      </Section>

      {/* Constraints */}
      <Section title="Constraints">
        <ul className="list-disc pl-5 mb-4">
          {question.constraints.map((constraint, index) => (
            <li key={index} className="mb-2">
              {constraint}
            </li>
          ))}
        </ul>
      </Section>

      {/* Examples */}
      <Section title="Examples">
        {question.examples.map((example, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-base font-semibold mb-2">Input</h4>
            <pre className="bg-gray-100 p-3 rounded">{example.input}</pre>
            <h4 className="text-base font-semibold mt-4 mb-2">Output</h4>
            <pre className="bg-green-100 p-3 rounded">
              {JSON.stringify(example.output)}
            </pre>
            <h4 className="text-base font-semibold mt-4 mb-2">Explanation</h4>
            <p className="text-gray-600 mb-4">{example.explanation}</p>
          </div>
        ))}
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="mt-6 mb-4 border-t pt-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
};

export default QuestionDetails;
