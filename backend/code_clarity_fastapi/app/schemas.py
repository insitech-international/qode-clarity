from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _):
        if isinstance(v, int):
            return ObjectId.from_datetime(ObjectId.from_datetime(v))
        if not isinstance(v, ObjectId):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid objectid")
            v = ObjectId(v)
        return v

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema: Any) -> None:
        field_schema.update(type="string")

class ExampleSchema(BaseModel):
    input: Optional[str] = None
    output: Optional[str] = None
    explanation: Optional[str] = None

class ProblemVersionSchema(BaseModel):
    version_type: str
    description: str
    examples: List[ExampleSchema]

class QuestionSchema(BaseModel):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    question_id: int
    title: str = ""
    difficulty: str = ""
    category: str = ""
    subcategory: str = ""
    similar_questions: List[str] = Field(default_factory=list)
    real_life_domains: List[str] = Field(default_factory=list)
    problem_description: str = ""
    problem_versions: List[ProblemVersionSchema] = Field(default_factory=list)
    constraints: List[str] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)
    content: str = ""
    
class SolutionSchema(BaseModel):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    question_id: int
    category: Optional[str] = ""
    subcategory: Optional[str] = ""
    classification_rationale: str
    introduction: str
    mathematical_abstraction: str
    pythonic_implementation: str
    real_world_analogies: str
    storytelling_approach: str
    visual_representation: str
    content: str


class CategorySchema(BaseModel):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    count: int