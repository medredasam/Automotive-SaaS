import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import Base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:your_password_here@db:5432/auto_saas")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Create tables if they don’t exist
def init_db():
    Base.metadata.create_all(bind=engine)
