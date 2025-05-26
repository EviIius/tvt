from typing import List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from .schemas import ClusteringDataRequest, ClusteringResult, ClusterPoint, Topic, ClusteringResponse

async def perform_clustering(data: ClusteringDataRequest) -> ClusteringResponse:
    # Extract the selected columns from the uploaded documents
    docs = data.documents
    selected_cols = data.selected_columns
    num_clusters = data.num_clusters

    # Combine selected columns into a single string per document
    texts = []
    for doc in docs:
        combined = " ".join(str(doc.get(col, "")) for col in selected_cols)
        texts.append(combined)

    # Vectorize the text using TF-IDF
    vectorizer = TfidfVectorizer(stop_words="english")
    X = vectorizer.fit_transform(texts)

    # K-means clustering
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X)

    # Dimensionality reduction for scatter plot (PCA to 2D)
    pca = PCA(n_components=2, random_state=42)
    X_2d = pca.fit_transform(X.toarray())

    # Prepare ClusterPoint data for scatter plot
    scatter_plot_data = []
    for idx, (x, y) in enumerate(X_2d):
        scatter_plot_data.append(
            ClusterPoint(
                x=float(x),
                y=float(y),
                topic_id=str(clusters[idx]),
                text_snippet=texts[idx][:100]  # First 100 chars as snippet
            )
        )

    # Prepare Topic data (cluster summary)
    topics = []
    total_docs = len(texts)
    for cluster_id in range(num_clusters):
        indices = [i for i, c in enumerate(clusters) if c == cluster_id]
        count = len(indices)
        percentage = f"{(count / total_docs * 100):.1f}%"
        # Use the most common words in the cluster as the name
        cluster_texts = [texts[i] for i in indices]
        if cluster_texts:
            tfidf = vectorizer.transform(cluster_texts)
            mean_tfidf = np.asarray(tfidf.mean(axis=0)).flatten()
            top_indices = mean_tfidf.argsort()[-3:][::-1]
            top_words = [vectorizer.get_feature_names_out()[i] for i in top_indices]
            name = ", ".join(top_words)
        else:
            name = f"Cluster {cluster_id+1}"
        topics.append(
            Topic(
                id=str(cluster_id),
                name=name,
                count=count,
                percentage=percentage
            )
        )

    return ClusteringResponse(
        message="Clustering performed successfully.",
        scatter_plot_data=scatter_plot_data,
        topics=topics
    )
