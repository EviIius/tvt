# tvt

This repository is organized to separate frontend and backend concerns. We start with a frontend-only structure, with plans to integrate a backend later.

Repository Structure:

```
tvt/
├── frontend/            # React/Next.js frontend application
│   ├── pages/           # Route pages
│   │   ├── index.tsx          # Home page (Upload Data)
│   │   ├── select-columns.tsx # Column selection step
│   │   ├── configure-clusters.tsx # Cluster configuration step
│   │   └── view-results.tsx   # Results view step
│   ├── components/      # Reusable components
│   │   ├── WellsFargoHeader.tsx
│   │   ├── Footer.tsx
│   │   ├── Stepper.tsx
│   │   └── UploadExcel.tsx
│   ├── ui/              # Shared UI primitives (shadcn/ui)
│   ├── public/          # Static assets
│   ├── styles/          # Global styles, Tailwind config
│   ├── package.json     
│   ├── tsconfig.json    
│   └── tailwind.config.js
├── backend/             # Backend API (to be added later)
└── .gitignore
```

Next Steps:
1. Initialize the `frontend` app (e.g., with Next.js & TypeScript).
2. Integrate Tailwind CSS for styling.
3. Move existing components into `frontend/components` and `frontend/ui`.
4. Implement the stepper and the upload page as shown in the design.

