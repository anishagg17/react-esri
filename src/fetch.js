const express = require('express');
const request = require('request');

const app = express();
const url = 'http://starlord.hackerearth.com/bankAccount';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/jokes/random', (req, res) => {
  request({ url }, (error, response, body) => {
    if (error)
        // || response.statusCode !== 200) {
      return res.status(500).json({ type: 'error', message: err.message });
    }
    res.json(JSON.parse(body));
  });
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
