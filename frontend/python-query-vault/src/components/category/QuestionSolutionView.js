import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuestionSolutionView = ({ question, solution }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{question.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{question.description}</p>
          <p className="mt-2 text-sm text-gray-600">
            Difficulty: {question.difficulty}
          </p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classification">
            <TabsList>
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="explanation">Explanation</TabsTrigger>
              <TabsTrigger value="approach">Approach</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="complexity">Complexity</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>
            <TabsContent value="classification">
              {solution.problem_classification}
            </TabsContent>
            <TabsContent value="explanation">
              {solution.problem_explanation}
            </TabsContent>
            <TabsContent value="approach">
              {solution.approach_explanation}
            </TabsContent>
            <TabsContent value="steps">{solution.algorithm_steps}</TabsContent>
            <TabsContent value="complexity">
              {solution.complexity_analysis}
            </TabsContent>
            <TabsContent value="implementation">
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>{solution.code_implementation}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionSolutionView;
