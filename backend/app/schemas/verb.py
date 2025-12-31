from pydantic import BaseModel, Field, ConfigDict

class VerbOut(BaseModel):
    id: int
    infinitive: str
    past: str
    participle: str
    translation: str
    example_b2: str
    model_config = ConfigDict(from_attributes=True)

class VerbCreate(BaseModel):
    infinitive: str = Field(..., description="Infinitive form of the verb")
    past: str = Field(..., description="Past simple form of the verb")
    participle: str = Field(..., description="Past participle form of the verb")
    translation: str = Field(..., description="Spanish translation of the verb")
    example_b2: str = Field(..., description="Example sentence at B2 level")

class VerbUpdate(BaseModel):
    infinitive: str | None = None
    past: str | None = None
    participle: str | None = None
    translation: str | None = None
    example_b2: str | None = None