// Minimal JS fixture
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.get('/run', (req, res) => { exec(req.query.cmd, (err, stdout) => res.send(stdout)); });
module.exports = app;
