const express = require('express');
const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (CSS, JS, Images)
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
//res.render('index', { title: 'Home' });
// res.render('index1', { title: 'Home' });
//res.render('qr', { title: 'Home' });
  res.render('anime', { title: 'Home' });

});

app.get("/qr", (req, res) => {
  res.render('qr', { title: 'Home' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})