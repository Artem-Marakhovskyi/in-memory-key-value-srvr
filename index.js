const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');

const app = express();
const port = 3000;

const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (!API_KEY) return res.status(500).json({ error: 'Server misconfigured: API_KEY not set' });
  const key = req.header('x-api-key');
  if (key !== API_KEY) return res.status(401).json({ error: 'Invalid or missing API key' });
  next();
});

// In-memory store: { [deviceKey]: { deviceKey, tree } }
const sessions = {};

// GET /test-sessions - list all sessions
app.get('/test-sessions', (req, res) => {
  res.json(Object.values(sessions));
  out('List of all sessions requested');
  out(`Sessions: ${Object.keys(sessions).join(', ')}`);
});

// POST /test-sessions/:id - set/update tree for deviceKey
app.post('/test-sessions/:id', (req, res) => {
  const deviceKey = req.params.id;
  const tree = req.body;
  sessions[deviceKey] = { deviceKey, tree };
  res.status(200).json({ message: 'Tree updated', deviceKey, tree });
  out(`Session updated for deviceKey: ${deviceKey}`);
  out(`Session tree: ${JSON.stringify(tree)}`);
  out('');
});

// GET /test-sessions/:id - get tree for deviceKey
app.get('/test-sessions/:id', (req, res) => {
  const deviceKey = req.params.id;
  const session = sessions[deviceKey];
  if (!session) {
    out(`Session not found for deviceKey: ${deviceKey}`);
    return res.status(404).json({ error: 'Session not found' });
  }
  out(`Session found for deviceKey: ${deviceKey}`);
  out(`Session tree: ${JSON.stringify(session.tree)}`);
  out('');
  res.json(session.tree);
});

app.listen(port, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let localIp = 'localhost';
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
    if (localIp !== 'localhost') break;
  }
  out(`Server started on local IP: http://${localIp}:${port}`);
}); 


const out = (msg) => {
  console.log(`${new Date()}\t${msg}\n`);
}