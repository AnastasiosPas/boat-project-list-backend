

    const express = require('express');
    const bodyParser = require('body-parser');
    const bcrypt = require('bcrypt');
    const cors = require('cors');
    const knex = require('knex');
    
    const saltRound = 10;

    const db = knex({   //because database variable is currently taken
        client: 'pg',
        connection: {
          host : '127.0.0.1',
          port : 5432,
          user : 'anastasiospasalis',
          password : '',
          database : 'boating-list'
        }
      });

db.select('*').from('users').then(data=> {
    console.log(data)
})

    const app = express();


    // const database = {
    //     users: [
    //         {
    //             id: '123',
    //             name: 'Tassos',
    //             email: 'tassos@gmail.com',
    //             password: 'tassos',
    //             mylist: 'myList',
    //             joined: new Date()
    //         },
    //         {
    //             id: '124',
    //             name: 'Nikos',
    //             email: 'nikos@gmail.com',
    //             password: 'nikos',
    //             mylist: 'myList',
    //             joined: new Date()
    //         },
            
    //     ]
    //     ,
    //     login: [
    //         {
    //             id: '987',
    //             hash: '',
    //             email: 'tassos@gmail.com'
    //         }
    //     ]
    // }


    app.use(cors());
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.json(database.users);
    })

    app.post('/login', (req, res) => {
    // bcrypt.compare('tassos', '$2b$10$IZB6EPXeRLoNIOrjJzCvRONzqZHQB3ELatmUZdqq27lLINOCP8Rt2', function(err, result) {
    //     console.log('first guess', result)    });
    // bcrypt.compare('kokoroza', '$2b$10$IZB6EPXeRLoNIOrjJzCvRONzqZHQB3ELatmUZdqq27lLINOCP8Rt2', function(err, result) {
    //     console.log('second guess', result)    });
    
        if (req.body.email === database.users[0].email && 
            req.body.password === database.users[0].password) {
                res.json(database.users[0]);
        }   else {
            res.status(400).json('wrong email or password');
    }
    });

      

    app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const saltRounds = 10;
    const myPlaintextPassword = 's0/\/\P4$$w0rD';
    const someOtherPlaintextPassword = 'not_bacon';
      db('users')
      .returning('*')  
      .insert({ 
            email: email,
            name: name,
            joined: new Date(),
         })
      .then((user)=> { //instead of response let's name it user 
        res.json(user[0]); //in ordedr to get the object of the array -->[0]
      }) 
      .catch(err=> res.status(400).json('unable to register'))
    })

    app.get('/profile/:id', (req, res) => {
        const {id} = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
        res.json(user[0])
        } else {
            res.status(400).json('user not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
    })

    

    app.post('/mylist', (req, res) => {
        const {id} = req.body;
        let found = false;
    database.users.forEach(user => {
    if (user.id === id) {
        found = true;
    return res.json(user.mylist);
    } 
    })
    if ( !found) {
        res.status(400).json('not found');
    }
    } )


    app.listen(3000,() => {
    console.log('app is running on port 3000')
    });