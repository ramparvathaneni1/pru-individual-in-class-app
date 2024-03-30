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
