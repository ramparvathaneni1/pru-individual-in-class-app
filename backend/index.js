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

// We will be using JSON objects to communcate with our backend, no HTML pages.
app.use(express.json());

// This route will return 'Hi There' when you go to localhost:3001/ in the browser
app.get("/", (req, res) => {
  res.send("Yo! Waadup?");
});

// GET All BucketList Items
// STRETCH GOAL 1: Accepting Query Params (title and risklevel) for filtering
app.get("/api/bucketlist", (request, response) => {

    const title = request.query.title;
    const risklevel = request.query.risklevel;

    let whereClause = `1 = 1`;
    whereClause += title ? ` AND title ILIKE '%${title}%'` : '';
    whereClause += risklevel ? ` AND risklevel = '${risklevel}'` : '';
    let sqlQuery = `SELECT * FROM bucketlist WHERE ${whereClause} ORDER BY id ASC`;

    console.log(sqlQuery);

    pool.query(
        sqlQuery,
        (error, results) => {
            console.log(results);
            if (error) {
                console.error(error);
                response.status(500).json({
                    error: `An error occurred while getting the bucketlist.`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json(results.rows);
            } else {
                response.status(404).json({
                    message: `Bucketlist Items Matching Filters Not Found.`
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
        `SELECT b.id, b.title, b.risklevel, b.done, b.userid, u.name, u.age
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
                    error: `An error occurred while getting BucketList Item with ID = ${id}`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json(results.rows);
            } else {
                response.status(404).json({
                    message: `BucketList Item With ID = ${id} Not Found.`
                })
            }
        }
    );
});

// CREATE a New BucketList Item
app.post("/api/bucketlist", (request, response) => {
    const {title, risklevel, done, userid} = request.body;
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
                    message: `Bucketlist Not Found.`
                });
            }
        }
    )
});

// Update BucketList Item with ID
app.put("/api/bucketlist/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const {title, risklevel, done, userid} = request.body;
    pool.query(
        `UPDATE bucketlist
        SET title = $1, risklevel = $2, done = $3, userid = $4
        WHERE id = $5`,
        [title, risklevel, done, userid, id],
        (error, results) => {
            console.log(results);
            if (error) {
                console.log(error);
                response.status(500).json({
                    error: `An error occurred while updating the BucketList with id = ${id}.`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json({
                    message: `BucketList Item modified with ID: ${id}`,
                    bucketlistItem: {id, ...request.body}
                });
            } else {
                response.status(404).json({
                    message: `Bucketlist Item with ID = ${id} Not Found.`
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
                    error: `An error occurred while Deleting BucketList Item with ID = ${id}.`
                });
            } else if (results.rowCount > 0) {
                response.status(200).json({
                    message: `BucketList Item with ID = ${id} was successfully deleted.`
                });
            } else {
                response.status(404).json({
                    message: `Bucketlist Item with ID = ${id} Not Found.`
                });
            }
        }
    )
});

// This tells the express application to listen for requests on port 3001
app.listen("3001", () => {});
