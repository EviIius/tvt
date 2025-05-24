from pydantic import BaseModel
from typing import List, Dict, Any

class ClusteringDataRequest(BaseModel):
    documents: List[Dict[str, Any]] # Changed from List[str]
    selected_columns: List[str]
    num_clusters: int = 5
    # frontend also sends all_headers, but it's not strictly needed for backend processing if selected_columns is accurate
    # all_headers: List[str] | None = None 

class ClusterPoint(BaseModel):
    x: float
    y: float
    topic_id: str # Renamed from cluster, to match frontend's expectation of a topic identifier
    text_snippet: str # To provide some context for the point on the frontend

class Topic(BaseModel):
    id: str
    name: str
    count: int # Renamed from document_count to match frontend
    percentage: str # Will be formatted as string e.g., "33.5%"
    # summary: str # Optional, can be added later if topic summarization is implemented

# This schema might not be directly returned by the endpoint if ClusteringResponse is more comprehensive
# class ClusteringResult(BaseModel):
#     cluster_id: int
#     documents: List[str] 

class ClusteringResponse(BaseModel):
    message: str
    scatter_plot_data: List[ClusterPoint]
    topics: List[Topic]
    # Any other data like raw cluster assignments, detailed statistics, etc. can be added here
