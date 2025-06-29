CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  payment_confirmed BOOLEAN DEFAULT FALSE,
  payment_timestamp TIMESTAMP
);

CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  student_id VARCHAR(50) REFERENCES students(student_id),
  CONSTRAINT unique_slot UNIQUE (slot_date, slot_time)
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES students(student_id),
  slot_id INTEGER REFERENCES slots(id),
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_booking UNIQUE (student_id, slot_id)
);

CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

ALTER TABLE bookings
  ADD COLUMN slot_date DATE,
  ADD COLUMN slot_time TIME;