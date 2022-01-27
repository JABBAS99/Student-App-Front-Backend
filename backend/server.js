const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const DB_CONN_URI = "mongodb+srv://mustafa:12345@cluster0.dv0a3.mongodb.net/mydb?retryWrites=true&w=majority";
const PORT = 5000;

const app = express();

// Just so the request is not blocked by cors
app.use(cors());

// Connecting to the Database 
const client = new MongoClient(DB_CONN_URI);

async function main() {
  try {
    // Actually connecting to the database
    await client.connect();
    // Pinging the database to see if it is up
    await client.db("mydb").command({ ping: 1 });
    console.log("Connected successfully to the database");

    // Listening on PORT 5000, for requests
    app.listen(PORT, () => console.log("Server is running on port " + PORT));
  } finally {
    // Close the connection to the database
    await client.close();
  }
}

// Running the main function 
main().catch(console.dir);


// Express JS Routes 
app.get('/lessons', async (req, res) => {
  // Connecting to the database
  await client.connect();
  // Getting all the lessons from the database
  client.db('mydb')
    .collection('lessons')
    .find()
    .toArray((err, result) => {
      // If there is an error, return the error
      if (err)
        return res.status(500).send({ error: err });

      // If there is no error, return the result, which is the array of lessons 
      return res.json(result);
    });
});


app.get('/user', async (req, res) => {
  return res.json({ 'email': 'user@email.com', 'password': 'mypassword' });
});
