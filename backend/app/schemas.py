from pydantic import BaseModel
from typing import List, Dict, Any

class ClusteringDataRequest(BaseModel):
    documents: List[str]
    # Add other parameters like number of clusters, etc.
    num_clusters: int = 5 

class ClusteringResult(BaseModel):
    # Define what a single cluster result might look like
    cluster_id: int
    documents: List[str]
    # You might include other metrics or properties for each cluster
    # e.g., top_terms: List[str], centroid_vector: List[float]

class ClusteringResponse(BaseModel):
    message: str
    results: List[ClusteringResult]
    # Any additional metadata or visualization data can be added here
    # e.g., scatter_plot_data: Dict[str, Any]
