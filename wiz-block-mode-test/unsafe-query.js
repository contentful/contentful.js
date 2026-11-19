// Intentional test-only SQL injection. Never execute or deploy.
const express = require('express');
const mysql = require('mysql');
const app = express();

app.get('/test-user', (req, res) => {
  const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  const connection = mysql.createConnection({ host: 'localhost', user: 'test', database: 'test' });
  connection.query(query, (error, rows) => {
    if (error) return res.status(500).send('test fixture');
    res.json(rows);
  });
});

module.exports = app;
