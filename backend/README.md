# Evaluation Management System Backend

A Node.js backend for an evaluation management system that allows teachers/interviewers to create subjects and competencies with associated marks.

## Features

- Create, read, update, and delete subjects
- Create, read, update, and delete competencies under subjects
- Input validation for all endpoints
- Custom exception handling
- Logging at multiple levels (info, debug, error)
- MySQL database integration using Drizzle ORM
- Class-based architecture

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Drizzle ORM
- MySQL
- Winston (for logging)
- Express Validator (for input validation)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── db/             # Database connection and schema
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── validators/     # Request validation
│   ├── app.ts          # Express app setup
│   └── index.ts        # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env` file
4. Run database migrations:
   ```
   npm run migrate
   ```
5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Subjects

- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get a subject by ID
- `POST /api/subjects` - Create a new subject
- `PUT /api/subjects/:id` - Update a subject
- `DELETE /api/subjects/:id` - Delete a subject and its competencies

### Competencies

- `GET /api/competencies` - Get all competencies
- `GET /api/competencies?subjectId=<id>` - Get competencies by subject ID
- `GET /api/competencies/:id` - Get a competency by ID
- `POST /api/competencies` - Create a new competency
- `PUT /api/competencies/:id` - Update a competency
- `DELETE /api/competencies/:id` - Delete a competency

## License

This project is licensed under the ISC License.
