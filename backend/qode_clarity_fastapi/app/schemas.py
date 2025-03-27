"""
Pydantic models/schemas for Qode Clarity.
These models define the structure of data used in the application.
"""
from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class QuestionSchema(BaseModel):
    """Schema for questions."""
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime: lambda v: v.isoformat()},
        arbitrary_types_allowed=True
    )
    
    id: Optional[str] = None
    questionId: int = Field(..., alias="question_id")
    title: str = ""
    difficulty: str = ""
    category: str = ""
    categoryPath: str = Field("", alias="category_path")
    subcategory: str = ""
    tags: List[str] = Field(default_factory=list)
    similarQuestions: List[str] = Field(default_factory=list, alias="similar_questions")
    realLifeDomains: List[str] = Field(default_factory=list, alias="real_life_domains")
    problemDescription: str = Field("", alias="problem_description")
    problemVersions: List[str] = Field(default_factory=list, alias="problem_versions")
    constraints: List[str] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)
    content: str = ""
    createdAt: Optional[datetime] = Field(None, alias="created_at")
    updatedAt: Optional[datetime] = Field(None, alias="updated_at")

class SolutionSchema(BaseModel):
    """Schema for solutions."""
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime: lambda v: v.isoformat()},
        arbitrary_types_allowed=True
    )
    
    id: Optional[str] = None
    questionId: int = Field(..., alias="question_id")
    title: str = ""
    category: str = ""
    categoryPath: str = Field("", alias="category_path")
    subcategory: str = ""
    tags: List[str] = Field(default_factory=list)
    similarQuestions: List[str] = Field(default_factory=list, alias="similar_questions")
    realLifeDomains: List[str] = Field(default_factory=list, alias="real_life_domains")
    approach: str = ""
    code: str = ""
    explanation: str = ""
    classificationRationale: str = Field("", alias="classification_rationale")
    introduction: str = ""
    mathematicalAbstraction: str = Field("", alias="mathematical_abstraction")
    pythonicImplementation: str = Field("", alias="pythonic_implementation")
    solveFramework: str = Field("", alias="solve_framework")  # Renamed from bucesr_framework
    complexityAnalysis: str = Field("", alias="complexity_analysis")
    realWorldAnalogies: str = Field("", alias="real_world_analogies")
    storytellingApproach: str = Field("", alias="storytelling_approach")
    visualRepresentation: str = Field("", alias="visual_representation")
    content: str = ""
    createdAt: Optional[datetime] = Field(None, alias="created_at")
    updatedAt: Optional[datetime] = Field(None, alias="updated_at")

class CategorySchema(BaseModel):
    """Schema for categories."""
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime: lambda v: v.isoformat()},
        arbitrary_types_allowed=True
    )
    
    id: Optional[str] = None
    name: str
    path: Optional[str] = ""
    parentPath: Optional[str] = Field("", alias="parent_path")
    level: Optional[int] = 1
    questionCount: Optional[int] = Field(0, alias="question_count")
    createdAt: Optional[datetime] = Field(None, alias="created_at")
    updatedAt: Optional[datetime] = Field(None, alias="updated_at")