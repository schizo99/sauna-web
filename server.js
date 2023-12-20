const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');

const app = express();

app.use(history({ index: '/index.html' }));

app.get('/api/*', (req, res) => {
  const api = req.url.split('/api').slice(1).join('');
  const host = process.env.API_HOST || 'localhost';
  console.log(host)
  axios.get(`http://${host}${api}`)
    .then((result) =>{
      result = result.data.filter((item) => item.temp != null)
      return res.json(result)
    })
    .catch(() => {
      console.log('Unable to reach API server!');
      res.status(400);
      res.set('Connection', 'close');
      res.json({ error: `Unable to reach API server! at ${api[1]}` });
    });
});

app.use('/', express.static('dist', { index: 'index.html' }));
app.listen(8080, () => console.log('Server listening on port 8080!'));
