const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '83202310',
        database: 'company_db'
    },
    console.log('Connected to the company_db database')
);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  