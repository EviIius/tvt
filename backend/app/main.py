from fastapi import FastAPI
from .routers import clustering

app = FastAPI(
    title="Machine Learning Backend API",
    description="API for handling machine learning tasks like clustering.",
    version="0.1.0"
)

app.include_router(clustering.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Machine Learning Backend API"}
