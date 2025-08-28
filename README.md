
# brandons-poc

A full-stack, mobile-friendly image management app with authentication, CRUD for user-uploaded images, and future support for 3rd-party API integration. Built with React (Vite, Tailwind CSS), Node.js/Express, PostgreSQL, Supabase Storage, JWT auth, and CI/CD via GitHub Actions. Deployable to Vercel (frontend) and Render or Railway (backend).

## Features
- User registration/login (JWT auth)
- Upload, view, update, and delete images
- Images stored in cloud storage (Supabase Storage)
- Responsive/mobile-first UI (React + Tailwind)
- Backend API (Node.js/Express)
- PostgreSQL for metadata
- CI/CD with GitHub Actions
- Free-tier cloud deployment

---

## Getting Started

### Prerequisites
- Node.js and npm
- PostgreSQL database
- Supabase project (for storage)

### Backend Setup
1. Copy `backend/.env.example` to `backend/.env` and fill in your credentials:
	- `DATABASE_URL` (Postgres connection string)
	- `SUPABASE_URL` and `SUPABASE_KEY` (from your Supabase project)
	- `JWT_SECRET` (any random string)
2. Run the SQL in `backend/schema.sql` to set up your database tables.
3. From the `backend` directory, install dependencies:
	```bash
	npm install
	```
4. Start the backend server:
	```bash
	node index.js
	```

### Frontend Setup
1. From the `frontend` directory, install dependencies:
	```bash
	npm install
	```
2. Add your Supabase project URL and anon key to the frontend as needed (see `.env` usage in your code).
	 - Create a `.env` file in the `frontend` directory with:
		 ```env
		 VITE_SUPABASE_URL=your-supabase-url
		 VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
		 VITE_API_URL=http://localhost:4000/api
		 ```
	 - Replace values with your actual Supabase and backend API URLs.
3. Start the frontend dev server:
	```bash
	npm run dev
	```

---

## Next Steps

- Connect the frontend to the backend API for image CRUD operations.
- Update the frontend to use the backend for authentication and image management instead of Supabase Auth/Storage directly.
- Test the full workflow: register, login, upload, view, and delete images.

---

---

## Deployment

### Frontend
- Deploy to [Vercel](https://vercel.com/) (free tier)
- Connect your GitHub repo and set up environment variables as needed

### Backend
- Deploy to [Render](https://render.com/) or [Railway](https://railway.app/) (free tier)
- Set environment variables from your `.env` file
- Ensure your database is accessible from your backend

---

## CI/CD

This project uses GitHub Actions for CI/CD:
- On push to `main`, the backend and frontend are built and tested
- Example workflow files are in `.github/workflows/`

---

## Environment Variables

See `backend/.env.example` for required backend variables.

---

## Future Improvements
- Integrate 3rd-party APIs for image processing
- Add user profile management
- Improve error handling and validation

---

## License
MIT
