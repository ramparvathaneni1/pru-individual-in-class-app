DROP TABLE IF EXISTS users CASCADE;

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(50),
    age INTEGER
);

-- Insert Values Into Users
INSERT INTO
    users (name, username, password, age)
VALUES
    ('John', 'john', 'pass123', 30),
    ('Paul', 'paul', 'pass123', 26),
    ('Abe', 'abe', 'pass123', 27);
