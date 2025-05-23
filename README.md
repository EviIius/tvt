# tvt

This repository is organized to separate frontend and backend concerns.

Repository Structure:

```
tvt/
├── frontend/            # React/Next.js frontend application
│   ├── pages/           # Route pages
│   │   ├── index.tsx          # Home page (Upload Data)
│   │   ├── select-columns.tsx # Column selection step
│   │   ├── configure-clusters.tsx # Cluster configuration step (to be renamed/refactored)
│   │   └── view-results.tsx   # Results view step (to be renamed/refactored)
│   ├── components/      # Reusable components
│   │   ├── WellsFargoHeader.tsx
│   │   ├── Footer.tsx
│   │   ├── Stepper.tsx
│   │   ├── UploadExcel.tsx
│   │   ├── ColumnSelection.tsx
│   │   └── Layout.tsx
│   ├── ui/              # Shared UI primitives (shadcn/ui)
│   ├── public/          # Static assets
│   ├── styles/          # Global styles
│   ├── lib/             # Utility functions
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── package.json     
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json    
├── backend/             # Python FastAPI backend API
│   ├── app/             # Main application folder
│   │   ├── routers/       # API routers (e.g., clustering.py)
│   │   │   └── clustering.py
│   │   ├── schemas.py     # Pydantic models
│   │   ├── services.py    # Business logic
│   │   ├── utils/         # Utility scripts (original .tsx files moved here as .py placeholders)
│   │   │   ├── cluster_configuration.py
│   │   │   ├── cluster_scatter_plot.py
│   │   │   ├── cluster_visualization.py
│   │   │   ├── results_visualization.py
│   │   │   ├── topic_distribution.py
│   │   │   └── topics_table.py
│   │   └── main.py        # FastAPI app entry point
│   ├── requirements.txt # Python dependencies
│   └── .venv/           # Virtual environment (recommended)
├── .gitignore
└── README.md
```

Next Steps:

**Frontend:**
1.  Refactor `frontend/pages/configure-clusters.tsx` and `frontend/pages/view-results.tsx` to fetch data from and interact with the backend API.
2.  Create dedicated components in `frontend/components/clustering/` and `frontend/components/results/` for UI elements related to these steps, moving relevant logic from the `pages/` files.

**Backend:**
1.  Set up a Python virtual environment in the `backend` directory (e.g., `python -m venv .venv` and `source .venv/bin/activate` or `.\.venv\Scripts\activate` on Windows).
2.  Install dependencies: `pip install -r backend/requirements.txt`. (Ensure `fastapi`, `uvicorn`, `pydantic`, and any ML libraries are listed).
3.  Implement the actual clustering logic in `backend/app/services.py`.
4.  Develop the Python versions of the utility scripts in `backend/app/utils/` for data processing and visualization preparation.
5.  Run the backend server (e.g., `uvicorn backend.app.main:app --reload --port 8000`).

**General:**
1.  Remove any remaining unused `.tsx` files from the root directory if they were not moved to `backend/app/utils`.
2.  Clean up `frontend/package.json` if any dependencies related to the moved TSX files are no longer needed on the frontend.

