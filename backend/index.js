// index.js (for Render)
const app = require('./server'); // <-- your existing server.js
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
