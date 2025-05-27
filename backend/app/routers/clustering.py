from fastapi import APIRouter, HTTPException, Body, File, UploadFile, Form
from typing import List, Optional
import pandas as pd
import io
import pickle # For .pkl files

from ..schemas import ClusteringDataRequest, ClusteringResponse, ClusteringResult, ColumnInfo
from ..services import perform_clustering, get_column_suggestions

router = APIRouter(
    prefix="/clustering",
    tags=["Clustering"],
)

async def read_file_to_dataframe(file: UploadFile) -> pd.DataFrame:
    """
    Reads an uploaded file (Excel, CSV, Pickle, Parquet) into a pandas DataFrame.
    """
    filename = file.filename
    content = await file.read()
    
    if filename.endswith(('.xlsx', '.xls')):
        try:
            df = pd.read_excel(io.BytesIO(content), engine='openpyxl')
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading Excel file: {str(e)}")
    elif filename.endswith('.csv'):
        try:
            df = pd.read_csv(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading CSV file: {str(e)}")
    elif filename.endswith('.pkl'):
        try:
            df = pickle.load(io.BytesIO(content))
            if not isinstance(df, pd.DataFrame):
                raise ValueError("Pickle file did not contain a pandas DataFrame.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading Pickle file: {str(e)}")
    elif filename.endswith('.parquet'):
        try:
            df = pd.read_parquet(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading Parquet file: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload Excel, CSV, Pickle, or Parquet.")
    
    if df.empty:
        raise HTTPException(status_code=400, detail="The uploaded file is empty or could not be read.")
    return df

@router.post("/upload-file-and-get-columns", response_model=List[ColumnInfo])
async def upload_file_and_get_columns(file: UploadFile = File(...)):
    """
    Endpoint to upload a data file and get a list of its columns (headers).
    Supports Excel, CSV, Pickle, and Parquet files.
    For Pickle and Parquet, if they don't have explicit headers in the same way
    as tabular data, it will return column names if available or a generic representation.
    """
    df = await read_file_to_dataframe(file)
    # Attempt to get column suggestions (e.g., text-like columns)
    suggested_columns = get_column_suggestions(df)
    
    columns_info: List[ColumnInfo] = []
    for col_name in df.columns:
        # Determine a sample of data for the column type inference
        sample_data = df[col_name].dropna().head(5).tolist()
        columns_info.append(ColumnInfo(
            name=str(col_name), 
            is_suggested=str(col_name) in suggested_columns,
            sample_data=sample_data
        ))
            
    if not columns_info:
        # Fallback if no columns are found (e.g. for non-tabular data or error)
        # For PKL/Parquet that might not be simple DataFrames, this might need adjustment
        # or we rely on the read_file_to_dataframe to raise an error if not a DataFrame.
        raise HTTPException(status_code=400, detail="Could not extract column headers from the file.")
        
    return columns_info


@router.post("/perform", response_model=ClusteringResponse)
async def run_clustering_analysis(
    file: UploadFile = File(...), 
    text_column: str = Form(...),
    num_clusters: Optional[int] = Form(5), # Default to 5 if not provided
    document_id_column: Optional[str] = Form(None)
):
    """
    Endpoint to perform clustering analysis on a specified column of an uploaded file.
    
    - **file**: The data file (Excel, CSV, Pickle, Parquet).
    - **text_column**: The name of the column containing the text data to cluster.
    - **num_clusters**: The desired number of clusters.
    - **document_id_column**: The name of the column to use as document identifier (optional).
    """
    df = await read_file_to_dataframe(file)

    if text_column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{text_column}' not found in the uploaded file.")
    
    documents = df[text_column].astype(str).tolist()
    if not documents:
        raise HTTPException(status_code=400, detail=f"No text data found in column '{text_column}'.")

    doc_ids: Optional[List[str]] = None
    if document_id_column:
        if document_id_column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Document ID column '{document_id_column}' not found.")
        doc_ids = df[document_id_column].astype(str).tolist()
        if len(doc_ids) != len(documents):
            raise HTTPException(status_code=400, detail="Document ID column and text column have different lengths.")

    # Construct the request data for perform_clustering
    request_data = ClusteringDataRequest(
        documents=documents,
        num_clusters=num_clusters,
        document_ids=doc_ids
    )

    try:
        cluster_results: List[ClusteringResult] = await perform_clustering(request_data)
        return ClusteringResponse(
            message="Clustering performed successfully.",
            results=cluster_results
        )
    except Exception as e:
        print(f"Error during clustering: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during clustering: {str(e)}")

# Add other necessary imports and helper functions if they are in separate files
# For example, if get_column_suggestions is in services.py, ensure it's correctly imported.
# from ..services import get_column_suggestions
