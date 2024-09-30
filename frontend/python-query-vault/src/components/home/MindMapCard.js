import React from "react";
import { Card } from "@/components/ui/card";

const MindMapCard = ({ categoryId }) => {
  return (
    <Card className="w-full h-40 bg-gray-100 flex items-center justify-center">
      <img
        src={`/api/placeholder/200/150?text=Mindmap+for+${categoryId}`}
        alt={`Mindmap for ${categoryId}`}
        className="max-w-full max-h-full object-contain"
      />
    </Card>
  );
};

export default MindMapCard;
