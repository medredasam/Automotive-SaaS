from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.models import user as models
from app.database import SessionLocal
from app.utils.hash import hash_password
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.hash import verify_password
from app.utils.token import create_access_token


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

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token = create_access_token({
        "sub": user.username,
        "role": user.role.value  # include role for RBAC
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
