DROP TABLE IF EXISTS bucketlist;
DROP TABLE IF EXISTS users;

-- Create Tables
CREATE TABLE bucketlist (
    ID SERIAL PRIMARY KEY,
    title VARCHAR(50),
    risklevel VARCHAR(1),
    done BOOLEAN,
    userid INTEGER
);

CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(50),
    age INTEGER
);

-- Insert Values into Tables
INSERT INTO
    bucketlist (title, risklevel, done, userid)
VALUES
    ('See The Northern Lights', 'L', false, 1),
    ('Skydiving', 'H', false, 1),
    ('Get A Tatoo', 'M', false, 1),
    ('Go On A Cruise', 'L', false, 2),
    ('Swim With Dolphins', 'M', false, 2),
    ('Scuba Diving', 'M', false, 2),
    ('Run Marathon', 'L', false, 3),
    ('Bungee Jumping', 'H', false, 3);

INSERT INTO
    users (name, age)
VALUES
    ('John', 30),
    ('Arman', 26),
    ('Abe', 27);

-- Add User ID Foreign Key to BucketList Table 
ALTER TABLE ONLY bucketlist
    ADD CONSTRAINT user_id_fk FOREIGN KEY (userid) REFERENCES users(id);