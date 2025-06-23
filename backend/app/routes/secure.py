from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user, require_role
from pydantic import BaseModel

router = APIRouter()

class UserInfo(BaseModel):
    username: str
    role: str

@router.get("/me", response_model=UserInfo)
def get_me(user=Depends(get_current_user)):
    return {
        "username": user["username"],
        "role": user["role"]
    }

@router.get("/admin-only")
def admin_route(user=Depends(require_role("admin"))):
    return {"message": "Welcome Admin!"}

class WorkshopResponse(BaseModel):
    message: str

@router.get("/workshop-only", response_model=WorkshopResponse)
def workshop_route(user=Depends(require_role("workshop"))):
    return {"message": "Welcome Workshop!"}
