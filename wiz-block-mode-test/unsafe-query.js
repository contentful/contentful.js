// Intentional HIGH-severity SAST test fixture. Never execute or deploy.
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

// CWE-78: OS Command Injection — HIGH severity
app.get('/run', (req, res) => {
  exec(req.query.cmd, (err, stdout) => {
    res.send(stdout);
  });
});

// CWE-22: Path Traversal — HIGH severity
app.get('/file', (req, res) => {
  const data = fs.readFileSync('/var/data/' + req.query.path, 'utf8');
  res.send(data);
});

// CWE-918: SSRF — HIGH severity
const http = require('http');
app.get('/fetch', (req, res) => {
  http.get(req.query.url, (upstream) => {
    upstream.pipe(res);
  });
});

module.exports = app;
