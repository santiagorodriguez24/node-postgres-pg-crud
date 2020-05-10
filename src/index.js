const express = require('express');

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(require('./routes/routes.js'));

const port = 5000;

app.listen(port, () => console.log(`Server on port: ${port}`));