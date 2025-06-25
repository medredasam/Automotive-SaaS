from fastapi import FastAPI
from sqlalchemy import text
from app.database import SessionLocal, init_db
from app.routes import auth, secure
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware

# Initialize database
init_db()

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # list of allowed domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend OK"}

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



# Include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(secure.router)

# Swagger customization
def custom_openapi():
    try:
        if app.openapi_schema:
            return app.openapi_schema

        openapi_schema = get_openapi(
            title="Auto SaaS API",
            version="1.0.0",
            description="JWT secured API",
            routes=app.routes,
        )

        openapi_schema["components"]["securitySchemes"] = {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        }

        for path in openapi_schema["paths"].values():
            for method in path.values():
                method.setdefault("security", [{"BearerAuth": []}])

        app.openapi_schema = openapi_schema
        return app.openapi_schema

    except Exception as e:
        import traceback
        print("🔥 Error generating OpenAPI schema:\n", traceback.format_exc())
        raise e

app.openapi = custom_openapi
