# Grade Glide Tracker System

A comprehensive evaluation management system that allows teachers and interviewers to track and manage student evaluations through a modern web interface.

## Features

- **Subject Management**: Create, read, update, and delete subjects
- **Competency Tracking**: Manage competencies within each subject
- **Real-time Updates**: UI stays in sync with backend data
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Radix UI and Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the stack

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI for accessible components
- React Query for data fetching and caching
- Axios for HTTP requests

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM for database operations
- MySQL database
- Winston for logging
- Express Validator for input validation

## Project Structure

```
grade-glide-tracker-system/
├── backend/               # Node.js backend server
│   ├── src/              # Source code
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── db/          # Database connection and schema
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── app.ts       # Express app setup
│   │   └── index.ts     # Entry point
│   ├── .env             # Environment variables
│   └── package.json     # Backend dependencies
│
└── frontend/            # React frontend
    ├── src/
    │   ├── api/        # API service layer
    │   ├── components/ # Reusable UI components
    │   ├── hooks/      # Custom React hooks
    │   ├── pages/      # Page components
    │   └── App.tsx     # Main app component
    └── package.json    # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and update with your database credentials:
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env
   # Update API URL if different from default
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Available Scripts

### Backend
- `npm run dev`: Start development server with hot-reload
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run db:migrate`: Run database migrations

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the backend is running.

### Main Endpoints

- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a new subject
- `GET /api/subjects/:id` - Get a specific subject
- `PUT /api/subjects/:id` - Update a subject
- `DELETE /api/subjects/:id` - Delete a subject

- `GET /api/competencies` - Get all competencies
- `POST /api/competencies` - Create a new competency
- `GET /api/competencies/:id` - Get a specific competency
- `PUT /api/competencies/:id` - Update a competency
- `DELETE /api/competencies/:id` - Delete a competency

## Environment Variables

### Backend

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=grade_glide

# Logging
LOG_LEVEL=info
```

### Frontend

```env
VITE_API_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Drizzle ORM](https://orm.drizzle.team/)
- [React Query](https://tanstack.com/query/latest)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
