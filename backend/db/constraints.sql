-- Add User ID Foreign Key to BucketList Table
ALTER TABLE bucketlist 
ADD CONSTRAINT user_id_fk 
FOREIGN KEY (userid) REFERENCES users(id) 
ON DELETE CASCADE;