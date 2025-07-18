-- Drop database if exists and create a new one
DROP DATABASE IF EXISTS grade_system;
CREATE DATABASE grade_system;
USE grade_system;

-- Create Students table
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Courses table
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Assignments table
CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  course_id INT,
  due_date DATETIME,
  max_score DECIMAL(5,2) DEFAULT 100.00,
  weight DECIMAL(5,2) DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create Enrollments table (students enrolled in courses)
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  course_id INT,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY (student_id, course_id)
);

-- Create Grades table
CREATE TABLE grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  assignment_id INT,
  score DECIMAL(5,2),
  feedback TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  graded_at TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  UNIQUE KEY (student_id, assignment_id)
);

-- Insert sample data
INSERT INTO students (name, email, student_id) VALUES
  ('John Doe', 'john.doe@example.com', 'S001'),
  ('Jane Smith', 'jane.smith@example.com', 'S002'),
  ('Bob Johnson', 'bob.johnson@example.com', 'S003');

INSERT INTO courses (name, code, description) VALUES
  ('Introduction to Computer Science', 'CS101', 'Fundamental concepts of computer science'),
  ('Data Structures and Algorithms', 'CS201', 'Study of data structures and algorithms'),
  ('Database Systems', 'CS301', 'Introduction to database design and SQL');

INSERT INTO assignments (title, description, course_id, due_date, max_score, weight) VALUES
  ('Hello World Program', 'Write a simple Hello World program in any language', 1, '2025-08-01 23:59:59', 100.00, 0.10),
  ('Sorting Algorithm Implementation', 'Implement three different sorting algorithms', 2, '2025-08-15 23:59:59', 100.00, 0.25),
  ('Database Design Project', 'Design a database for a library management system', 3, '2025-09-01 23:59:59', 100.00, 0.30);

INSERT INTO enrollments (student_id, course_id) VALUES
  (1, 1), (1, 2), (2, 1), (2, 3), (3, 2), (3, 3);

INSERT INTO grades (student_id, assignment_id, score, feedback, submitted_at, graded_at) VALUES
  (1, 1, 95.00, 'Excellent work!', '2025-07-30 10:15:00', '2025-08-02 14:30:00'),
  (2, 1, 88.00, 'Good job, but missing comments', '2025-07-31 16:45:00', '2025-08-02 15:20:00'),
  (1, 2, 78.50, 'Merge sort implementation has bugs', '2025-08-14 23:30:00', '2025-08-16 13:10:00');
