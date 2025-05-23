from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..schemas import ClusteringDataRequest, ClusteringResponse, ClusteringResult
from ..services import perform_clustering

router = APIRouter(
    prefix="/clustering",
    tags=["Clustering"],
)

@router.post("/perform", response_model=ClusteringResponse)
async def run_clustering_analysis(request_data: ClusteringDataRequest = Body(...)):
    """
    Endpoint to perform clustering analysis on a list of documents.
    
    - **documents**: A list of strings, where each string is a document to be clustered.
    - **num_clusters**: The desired number of clusters (optional, defaults to 5).
    """
    if not request_data.documents:
        raise HTTPException(status_code=400, detail="No documents provided for clustering.")

    try:
        cluster_results: List[ClusteringResult] = await perform_clustering(request_data)
        return ClusteringResponse(
            message="Clustering performed successfully.",
            results=cluster_results
        )
    except Exception as e:
        # Log the exception details in a real application
        print(f"Error during clustering: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during clustering: {str(e)}")
