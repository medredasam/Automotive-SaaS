from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.models import user as models
from app.database import SessionLocal
from app.utils.hash import hash_password

# Create router instance
router = APIRouter()

# Dependency: Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Registration endpoint
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists (username OR email)
    user_exists = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()

    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create User object
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role
    )

    # Save to DB
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user
