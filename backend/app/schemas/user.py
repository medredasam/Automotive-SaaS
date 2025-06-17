from pydantic import BaseModel, EmailStr
from enum import Enum

# Enum for roles (matching your model)
class UserRole(str, Enum):
    admin = "admin"
    workshop = "workshop"
    client = "client"

# Request schema for registration
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.client

# Response schema (returned after registration)
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole

    class Config:
        orm_mode = True  # allow conversion from SQLAlchemy model
