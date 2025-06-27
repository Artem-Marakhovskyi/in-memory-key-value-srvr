# In-Memory Key-Value Server

A simple Express.js server for managing device session trees in-memory.

## Endpoints

### GET /test-sessions
Returns an array of all device sessions:
```
[
  {
    deviceKey: string,
    tree: object
  },
  ...
]
```

### POST /test-sessions/{id}
Sets or updates the tree for the specified deviceKey. The request body should be a JSON object representing the tree.

### GET /test-sessions/{id}
Returns the tree for the specified deviceKey.

## Running
```sh
node index.js
``` 