const express = require('express');
const db = require('./data/db');

const port = 5555;
const server = express();
server.use(express.json());

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
};

server.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  // 1st arg: route where a resource can be interacted with
  // 2nd arg: callback to deal with sending responses, and handling incoming data.
  res.send('Hello from express');
});

server.post('/api/users', (req, res) => {
  const { name, bio, created_at, updated_at } = req.body;
  if (!name || !bio) {
    sendUserError(400, 'Must provide name and bio', res);
    return;
  }
  db
    .insert({
      name,
      bio,
      created_at,
      updated_at
    })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      sendUserError(400, error, res);
      return;
    });
});

server.get('/api/users', (req, res) => {
  db
    .find()
    .then(users => {
      res.json({ users });
    })
    .catch(error => {
      sendUserError(500, 'The users information could not be retrieved.', res);
      return;
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db
    .findById(id)
    .then(user => {
      if (user.length === 0) {
        sendUserError(404, 'User with that id not found', res);
        return;
      }
      res.json(user);
    })
    .catch(error => {
      sendUserError(500, 'Error looking up user', res);
    });
  // invoke proper db.method(id) passing it the id.
  // handle the promise like above
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db
    .remove(id)
    .then(response => {
      if (response === 0) {
        sendUserError(404, 'The user with that ID does not exist."', res);
      }
      res.json({ success: `User with id: ${id} removed from system` });
    })
    .catch(error => {
      sendUserError(500, 'The user could not be removed', res);
      return;
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
