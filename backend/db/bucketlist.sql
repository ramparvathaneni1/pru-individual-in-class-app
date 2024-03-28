 CREATE TABLE bucketlist (
     ID SERIAL PRIMARY KEY,
     title VARCHAR(50),
     risklevel VARCHAR(1),
     done BOOLEAN
 );

 INSERT INTO
     bucketlist (title, risklevel, done)
 VALUES
     ('See The Northern Lights', 'L', false),
     ('Skydiving', 'H', false),
     ('Get A Tatoo', 'M', false),
     ('Go On A Cruise', 'L', false),
     ('Swim With Dolphins', 'M', false),
     ('Scuba Diving', 'M', false),
     ('Run Marathon', 'L', false),
     ('Bungee Jumping', 'H', false);
