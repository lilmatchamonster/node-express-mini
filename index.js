// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();
const parser = express.json();
const PORT = '9090';

server.use(parser);

server.get('/', (req, res) => {
  res.send('Hello World'); //will send back a status of 200 automatically 
});

//GET Request.
server.get('/api/users', (req, res) => {
  db.find()
  .then(users => {
    if(users){
      res.json(users)
    }
    else{
      res.status(500).json({err: 'User information could not be retrieved'});
    }
  })
  .catch(err => {
    res.status(400).json({err: 'Bad Request'});
  });
})

//GET id Request
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id
  db.findById(id)
  .then(user => {
    if(user){
      res.json(user)
    }
    else{
      res.status(500).json({ error: "The user information could not be retrieved." });
    }
  })
  .catch(err => {
    res.status(400).json({err: 'Bad Request'});
  }); 
})

//DELETE Request
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params

  db.remove(id)
  .then(user => {
    if(user){
      res.json(user)
    }
    else{
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  .catch(err => {
    res.status(500).json({ err: "The user could not be removed" });
  }); 
})

//POST Request
server.post('/api/users', (req, res) => {
  const newUser = req.body

  db.insert(newUser)
  .then(user => {
    if(newUser.name && newUser.bio){
      res.status(201).json(user)
    }
    else{
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
  })
  .catch(err => {
    res.status(500).json({ err: "There was an error while saving the user to the database" });
  }); 
})

//PUT Request
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const updatedUser = req.body
  const test = (updatedUser.name && updatedUser.bio) ? true : false;

  db.update(id, updatedUser)
  .then(updated => {
    if(updated && test){
      res.status(200).json(updated)
    }
    else if(test){
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
    else{
      res.status(500).json({ errorMessage: "Please provide name and bio for the user." });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user information could not be modified." });
  }); 
})

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

