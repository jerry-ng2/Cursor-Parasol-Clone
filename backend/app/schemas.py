from pydantic import BaseModel
from typing import List, Optional

class ImageOut(BaseModel):
    id: int
    file_path: str
    class Config:
        orm_mode = True

class ClaimCreate(BaseModel):
    claim_number: str
    category: str
    client_name: str
    policy_number: str
    status: str
    description: Optional[str] = None

class ClaimOut(BaseModel):
    id: int
    claim_number: str
    category: str
    client_name: str
    policy_number: str
    status: str
    description: Optional[str] = None
    images: List[ImageOut] = []
    class Config:
        orm_mode = True 