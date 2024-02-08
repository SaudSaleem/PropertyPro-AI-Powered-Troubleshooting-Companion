const express = require('express');
const app = express();

// Import your Sequelize models
const { sequelize } = require('./models');

app.get('/', (req, res) => {
  res.send('Welcome to PropertyPro API!');
});

const users = require('./routes/users.js');

app.use('/users', users);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
