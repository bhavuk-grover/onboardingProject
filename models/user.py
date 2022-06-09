from typing  import Union
from pydantic import BaseModel,Field

class Note(BaseModel):
    title: Union[str, None] = Field( default=None,max_length=50)
    sub_title: Union[str, None] = Field(default=None, max_length=400)
    text_note: str 