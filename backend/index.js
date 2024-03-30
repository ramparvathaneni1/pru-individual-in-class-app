// imports the express npm module
const express = require("express");

// imports the cors npm module
const cors = require("cors");

// imports the Pool object from the pg npm module, specifically
const Pool = require("pg").Pool;

// This creates a new connection to our database. Postgres listens on port 5432 by default
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bucketlist",
  password: "postgres",
  port: 5432,
});

// Creates a new instance of express for our app
const app = express();

// .use is middleware - something that occurs between the request and response cycle.
app.use(cors());

// We will be using JSON objects to communicate with our backend, no HTML pages.
app.use(express.json());

// This route will return 'Hi There' when you go to localhost:3001/ in the browser
app.get("/", (req, res) => {
  res.send("Yo! Waadup?");
});

// List of Routes
/**
 * GET /api/bucketlist - Fetch BucketList
 * GET /api/bucketlist?title=:title&risklevel=:risklevel&done=:done - Fetch BucketList Items matching filters
 * GET /api/bucketlist/:id - Fetch BucketList Item by ID (returns User Info as well)
 * 
 * GET /api/users - Fetch Users
 * GET /api/users/:id - Fetch User by ID
 * GET /api/users/:id/bucketlist - Fetch BucketList for User by User ID
 * 
 * POST /api/bucketlist - Create new BucketList Item (Gives 400 Bad Request response in case of missing fields)
 * POST /api/users - Create new User (Gives 400 Bad Request response in case of missing fields)
 * 
 * PUT /api/bucketlist/:id - Update BucketList Item by ID (used COALESCE(NULLIF()) to update only provided fields)
 * PUT /api/users/:id - Update User by ID (used COALESCE(NULLIF()) to update only provided fields)
 * 
 * DELETE /api/bucketlist/:id - Delete BucketList Item by ID
 * DELETE /api/users/:id - Delete User By ID (Deletes associated BucketList Items (ON DELETE CASCADE))
 */

// GET BucketList
// STRETCH GOAL 1: Accepting Query Params (title and risklevel) for filtering
app.get("/api/bucketlist", (request, response) => {

    const title = request.query.title;
    const risklevel = request.query.risklevel;
    const doneStr = request.query.done;
    let isDonePresent = doneStr && (doneStr.toUpperCase() === "TRUE" || doneStr.toUpperCase() === "FALSE");

    let whereClause = `1 = 1`;
    whereClause += title ? ` AND title ILIKE '%${title}%'` : '';
    whereClause += risklevel ? ` AND risklevel = '${risklevel.toUpperCase()}'` : '';
    whereClause += isDonePresent ? ` AND done = ${doneStr.toUpperCase() === "TRUE"}` : '';
    
    const sqlQuery = `SELECT * FROM bucketlist WHERE ${whereClause} ORDER BY id ASC`;

    console.log(sqlQuery);

    pool.query(
        sqlQuery,
        (error, results) => {
            console.log(results);
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while fetching the BucketList.`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json(results.rows);
            } else {
                response.status(404).json({
                    message: `BucketList Items Matching Filters Not Found.`
                });
            }
        }
    );
});

// GET BucketList Item by ID
// STRETCH GOAL 2: Getting all details from bucketlist and users table
app.get("/api/bucketlist/:id", (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(
        `SELECT b.id, b.title, b.risklevel, b.done, b.userid, u.name, u.username, u.age
        FROM bucketlist b
        JOIN users u
            ON b.userid = u.id
            AND b.id = $1`,
        [id],
        (error, results) => {
            console.log(results);
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while fetching BucketList Item(ID: ${id}).`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json(results.rows);
            } else {
                response.status(404).json({
                    message: `BucketList Item(ID: ${id}) Not Found.`
                });
            }
        }
    );
});

// CREATE a New BucketList Item
app.post("/api/bucketlist", (request, response) => {
    let {title, risklevel, done, userid} = request.body;

    // Validate (set default for 'done' flag)
    done = (done == null) ? false : done;
    if (!title || !risklevel || userid == null) {
        response.status(400).json({
            message: `Invalid Request. 'title', 'risklevel' and a Valid 'userid' are required.`
        });
        return;
    }

    pool.query(
        `INSERT INTO bucketlist (title, risklevel, done, userid)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [title, risklevel, done, userid],
        (error, results) => {
            console.log(results);
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while Creating BucketList Item.`
                });
            } else if (results.rowCount > 0) {
                response.status(201).json(results.rows[0]);
            } else {
                response.status(404).json({
                    message: `BucketList Not Found.`
                });
            }
        }
    );
});

// Update BucketList Item by ID
app.put("/api/bucketlist/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const {title, risklevel, done, userid} = request.body;
    pool.query(
        `UPDATE bucketlist SET
            title = COALESCE(NULLIF($1, ''), title),
            risklevel = COALESCE(NULLIF($2, ''), risklevel),
            done = COALESCE(NULLIF($3, done), done),
            userid = COALESCE(NULLIF($4, userid), userid)
        WHERE id = $5
        RETURNING *`,
        [title, risklevel, done, userid, id],
        (error, results) => {
            console.log(results);
            if (error) {
                console.log(error);
                response.status(500).json({
                    error: `An error occurred while updating the BucketList(ID: ${id}).`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json({
                    message: `Successfully Updated BucketList Item(ID: ${id}).`,
                    bucketlistItem: results.rows[0]
                });
            } else {
                response.status(404).json({
                    message: `BucketList Item(ID: ${id}) Not Found.`
                });
            }
        }
    );
});

// DELETE BucketList Item by ID
app.delete("/api/bucketlist/:id", (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(
        `DELETE FROM bucketlist WHERE id = $1`,
        [id],
        (error, results) => {
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while Deleting BucketList Item(ID: ${id}).`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json({
                    message: `Successfully Deleted BucketList Item(ID: ${id}).`
                });
            } else {
                response.status(404).json({
                    message: `BucketList Item(ID: ${id}) Not Found.`
                });
            }
        }
    );
});

// GET All Users
app.get("/api/users", (request, response) => {
    pool.query(
        `SELECT * FROM users ORDER BY id ASC`,
        (error, results) => {
            console.log(results);
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while fetching Users.`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json(results.rows);
            } else {
                response.status(404).json({
                    message: `Users Not Found.`
                });
            }
        }
    );
});

// GET User by ID
app.get("/api/users/:id", (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(
        `SELECT id, name, username, age
        FROM users
        WHERE id = $1`,
        [id],
        (error, results) => {
            console.log(results);
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while fetching User(ID: ${id}).`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json(results.rows);
            } else {
                response.status(404).json({
                    message: `User(ID: ${id}) Not Found.`
                });
            }
        }
    );
});

// CREATE a New User
app.post("/api/users", (request, response) => {
    let {name, username, password, age} = request.body;

    if (!name || !username || !password || !age) {
        response.status(400).json({
            message: `Bad Request. 'name', 'username', 'password' and 'age' are required.`
        });
        return;
    }

    username = username ? username.toLowerCase() : null;
    const ageInt = parseInt(age);
    console.log(`${name}, ${username}, ${password}, ${ageInt}`);
    pool.query(
        `INSERT INTO users (name, username, password, age)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [name, username, password, ageInt],
        (error, results) => {
            console.log(results);
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while Creating User.`
                });
            } else if (results.rowCount > 0) {
                response.status(201).json(results.rows[0]);
            } else {
                response.status(404).json({
                    message: `Users Not Found.`
                });
            }
        }
    );
});

// Update User by ID
app.put("/api/users/:id", (request, response) => {
    const id = parseInt(request.params.id);
    let {name, username, password, age} = request.body;
    username = username ? username.toLowerCase() : null;
    const ageInt = age ? parseInt(age) : null;
    pool.query(
        `UPDATE users SET
            name = COALESCE(NULLIF($1, ''), name),
            username = COALESCE(NULLIF($2, ''), username),
            password = COALESCE(NULLIF($3, ''), password),
            age = COALESCE(NULLIF($4, age), age)
        WHERE id = $5
        RETURNING *`,
        [name, username, password, ageInt, id],
        (error, results) => {
            console.log(results);
            if (error) {
                console.log(error);
                response.status(500).json({
                    error: `An error occurred while updating the User(ID: ${id}).`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json({
                    message: `Successfully Updated User(ID: ${id}).`,
                    user: results.rows[0]
                });
            } else {
                response.status(404).json({
                    message: `User(ID: ${id}) Not Found.`
                });
            }
        }
    );
});

// GET User's BucketList By User ID
app.get("/api/users/:id/bucketlist", (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(
        `SELECT b.id, b.title, b.risklevel, b.done, b.userid, u.name, u.username, u.age
        FROM bucketlist b
        JOIN users u
            ON b.userid = u.id
            AND u.id = $1`,
        [id],
        (error, results) => {
            console.log(results);
            if (error) {
                console.log(error);
                response.status(500).json({
                    error: `An error occurred while fetching BucketList Items for User(ID: ${id}).`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json(results.rows);
            } else {
                response.status(404).json({
                    message: `BucketList Items for User(ID: ${id}) Not Found.`
                });
            }
        }
    );
});

// DELETE User by User ID
app.delete("/api/users/:id", (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(
        `DELETE FROM users WHERE id = $1`,
        [id],
        (error, results) => {
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while Deleting User(ID: ${id}).`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json({
                    message: `Successfully Deleted User(ID: ${id}).`
                });
            } else {
                response.status(404).json({
                    message: `User(ID: ${id}) Not Found.`
                });
            }
        }
    );
});

// This tells the express application to listen for requests on port 3001
app.listen("3001", () => {});
