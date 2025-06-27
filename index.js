const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store: { [deviceKey]: { deviceKey, tree } }
const sessions = {};

// GET /test-sessions - list all sessions
app.get('/test-sessions', (req, res) => {
  res.json(Object.values(sessions));
});

// POST /test-sessions/:id - set/update tree for deviceKey
app.post('/test-sessions/:id', (req, res) => {
  const deviceKey = req.params.id;
  const tree = req.body;
  sessions[deviceKey] = { deviceKey, tree };
  res.status(200).json({ message: 'Tree updated', deviceKey, tree });
});

// GET /test-sessions/:id - get tree for deviceKey
app.get('/test-sessions/:id', (req, res) => {
  const deviceKey = req.params.id;
  const session = sessions[deviceKey];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session.tree);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 