DROP TABLE IF EXISTS bucketlist CASCADE;

-- Create BucketList Tables
CREATE TABLE bucketlist (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    risklevel VARCHAR(1),
    done BOOLEAN,
    userid INTEGER
);

-- Insert Values Into BucketList Table
INSERT INTO
    bucketlist (title, risklevel, done, userid)
VALUES
    ('See The Northern Lights', 'L', false, 1),
    ('Skydiving', 'H', false, 1),
    ('Get A Tattoo', 'M', false, 1),
    ('Go On A Cruise', 'L', false, 2),
    ('Swim With Dolphins', 'M', false, 2),
    ('Scuba Diving', 'M', false, 2),
    ('Run Marathon', 'L', false, 3),
    ('Bungee Jumping', 'H', false, 3);

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

-- Add User ID Foreign Key to BucketList Table
ALTER TABLE bucketlist 
ADD CONSTRAINT user_id_fk 
FOREIGN KEY (userid) REFERENCES users(id) 
ON DELETE CASCADE;