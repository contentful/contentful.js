// Intentional test-only SQL injection pattern. Never execute or deploy.
function buildUserLookupQuery(userInput) {
  return "SELECT id, email FROM users WHERE name = '" + userInput + "'";
}

module.exports = { buildUserLookupQuery };
