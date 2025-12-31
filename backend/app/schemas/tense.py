from pydantic import BaseModel, ConfigDict

class TenseOut(BaseModel):
    id: int
    code: str
    name: str
    description: str | None = None
    model_config = ConfigDict(from_attributes=True)

class TenseCreate(BaseModel):
    code: str
    name: str
    description: str | None = None

class ExampleOut(BaseModel):
    id: int
    tense_id: int
    verb_id: int | None = None
    sentence: str
    translation: str | None = None
    note: str | None = None
    model_config = ConfigDict(from_attributes=True)

class ExampleCreate(BaseModel):
    tense_id: int
    verb_id: int | None = None
    sentence: str
    translation: str | None = None
    note: str | None = None