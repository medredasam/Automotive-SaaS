from fastapi import FastAPI
from sqlalchemy import text
from app.database import SessionLocal

app = FastAPI()


@app.get("/db_test")
def db_test():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "details": str(e)}
    finally:
        db.close()

@app.get("/ping")
def ping():
    return {"response": "pong"}
