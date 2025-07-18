# Grade System Backend

This is the backend API for the Grade System application, built with Node.js, Express, TypeScript, and MySQL.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root of the backend directory with the following variables:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grade_system
DB_PORT=3306
```

5. Initialize the database:

```bash
npx ts-node src/utils/initDb.ts
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when changes are detected.

### Production

To build for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /api/health` - Check API and database health

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

## Database Schema

The database includes the following tables:

- `students` - Student information
- `courses` - Course information
- `assignments` - Assignment information
- `enrollments` - Student course enrollments
- `grades` - Student grades for assignments
