const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');

const app = express();

app.use(history({ index: '/index.html' }));

app.get('/api/*', (req, res) => {
  const api = req.url.split('/api');
  axios.get(`http://localhost:3000${api[1]}`)
  // axios.get(`http://host.docker.internal:3000${api[1]}`)
    .then((result) => res.json(result.data[0]))
    .catch(() => {
      console.log('Unable to reach API server!');
      res.status(400);
      res.set('Connection', 'close');
      res.json({ error: `Unable to reach API server! at ${api[1]}` });
    });
});

app.use('/', express.static('dist', { index: 'index.html' }));
app.listen(8080, () => console.log('Server listening on port 8080!'));
