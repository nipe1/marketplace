const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const postings = require('./services/postings');
const users = require('./services/users');
const app = express()
const port = 3000

app.use(bodyParser.json());

/*********************************************
 * API KEY DEMO
 ********************************************/
app.get('/apiKeyGenerate/:userId', (req, res) => {
    const userId = req.params.userId;
    let apiKey = users.getApiKey(userId);
    if(apiKey === false) // user not found
    {
      res.sendStatus(400);
    }
    if(apiKey === null)
    {
      apiKey = users.resetApiKey(userId)
    }
    res.json({
      apiKey
    })
  });
  
  function checkForApiKey(req, res, next)
  {
    const receivedKey = req.get('X-Api-Key');
    if(receivedKey === undefined) {
      return res.status(400).json({ reason: "X-Api-Key header missing"});
    }
  
    const user = users.getUserWithApiKey(receivedKey);
    if(user === undefined) {
      return res.status(400).json({ reason: "Incorrect api key"});
    }
  
    req.user = user;
  
    // pass the control to the next handler in line
    next();
  }
  
  app.get('/apiKeyProtectedResource', checkForApiKey, (req, res) => {
    res.json({
      yourResource: "foo"
    })
  });
  
  /*********************************************
   * HTTP Basic Authentication
   * Passport module used
   * http://www.passportjs.org/packages/passport-http/
   ********************************************/
  const passport = require('passport');
  const BasicStrategy = require('passport-http').BasicStrategy;
  
  passport.use(new BasicStrategy(
    function(username, password, done) {
  
      const user = users.getUserByName(username);
      if(user == undefined) {
        // Username not found
        console.log("HTTP Basic username not found");
        return done(null, false, { message: "HTTP Basic username not found" });
      }
  
      /* Verify password match */
      if(bcrypt.compareSync(password, user.password) == false) {
        // Password does not match
        console.log("HTTP Basic password not matching username");
        return done(null, false, { message: "HTTP Basic password not found" });
      }
      return done(null, user);
    }
  ));
  /*
  app.get('/httpBasicProtectedResource',
          passport.authenticate('basic', { session: false }),
          (req, res) => {
    res.json({
      yourProtectedResource: "profit"
    });
  });*/
  /*
  app.post('/registerBasic',
          (req, res) => {
  
    if('username' in req.body == false ) {
      res.status(400);
      res.json({status: "Missing username from body"})
      return;
    }
    if('password' in req.body == false ) {
      res.status(400);
      res.json({status: "Missing password from body"})
      return;
    }
    if('email' in req.body == false ) {
      res.status(400);
      res.json({status: "Missing email from body"})
      return;
    }
  
    const hashedPassword = bcrypt.hashSync(req.body.password, 6);
    console.log(hashedPassword);
    users.addUser(req.body.username, req.body.email, hashedPassword);
  
    res.status(201).json({ status: "created" });
  });*/
  
  
  /*********************************************
   * JWT authentication
   * Passport module is used, see documentation
   * http://www.passportjs.org/packages/passport-jwt/
   ********************************************/
  const jwt = require('jsonwebtoken');
  const JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;
  const jwtSecretKey = require('./jwt-key.json');
  
  
  let options = {}
  
  /* Configure the passport-jwt module to expect JWT
     in headers from Authorization field as Bearer token */
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  
  /* This is the secret signing key.
     You should NEVER store it in code  */
  options.secretOrKey = jwtSecretKey.secret;
  
  passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    console.log("Processing JWT payload for token content:");
    console.log(jwt_payload);
  
  
    /* Here you could do some processing based on the JWT payload.
    For example check if the key is still valid based on expires property.
    */
    const now = Date.now() / 1000;
    if(jwt_payload.exp > now) {
      done(null, jwt_payload.user);
    }
    else {// expired
      done(null, false);
    }
  }));
  
  
  app.get(
    '/jwtProtectedResource',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      console.log("jwt");
      res.json(
        {
          status: "Successfully accessed protected resource with JWT",
          user: req.user
        }
      );
    }
  );
  /*
  app.get('/todosJWT', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      console.log('GET /todosJWT')    
      const t = postings.getAllUserPostings(req.user.id);
      res.json(t);
  })*/
  
  /*
  Body JSON structure example
  {
      "description": "Example todo",
      "dueDate": "25-02-2020"
  }
  *//*
  app.post('/todosJWT', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      console.log('POST /todosJWT');
      console.log(req.body);
      if(('description' in req.body) && ( 'dueDate' in req.body)) {
        todos.insertTodo(req.body.description, req.body.dueDate, req.user.id);
        res.json(todos.getAllUserTodos(req.user.id));
      }
      else {
        res.sendStatus(400);
      }
      
  })*/
  
  app.get('/login',
    passport.authenticate('basic', { session: false }),
    (req, res) => {
      const body = {
        id: req.user.id,
        email : req.user.email
      };
  
      const payload = {
        user : body
      };
  
      const options = {
        expiresIn: '1d'
      }
  
      /* Sign the token with payload, key and options.
         Detailed documentation of the signing here:
         https://github.com/auth0/node-jsonwebtoken#readme */
      const token = jwt.sign(payload, jwtSecretKey.secret, options);
  
      return res.json({ token });
  })


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/postings',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const t = postings.getAllPostings();
        res.json(t);
})
/*
app.get('/todosJWT', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      console.log('GET /todosJWT')    
      const t = postings.getAllUserPostings(req.user.id);
      res.json(t);
  })*/

app.get('/postings/:id',
  passport.authenticate('jwt', { session: false }),    
  (req, res) => {
      const t = postings.getPosting(req.params.id)
      if(t !== undefined){
        res.json(t)
      }
      else{
        res.sendStatus(404)
      }
})
app.get('/search/category/:category',
  passport.authenticate('jwt', { session: false }),    
  (req, res) => {
      const t = postings.byCategory(req.params.category)
      if(t !== undefined){
        res.json(t)
      }
      else{
        res.sendStatus(404)
      }
})
app.get('/search/location/:location',
  passport.authenticate('jwt', { session: false }),    
  (req, res) => {
      const t = postings.byLocation(req.params.location)
      if(t !== undefined){
        res.json(t)
      }
      else{
        res.sendStatus(404)
      }
})
app.get('/search/date/:date',
  passport.authenticate('jwt', { session: false }),    
  (req, res) => {
      const t = postings.byDate(req.params.date)
      if(t !== undefined){
        res.json(t)
      }
      else{
        res.sendStatus(404)
      }
})
/*
app.get('/postings/:id/data', (req, res) => {
    
})*/

app.get('/users/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
      const t = users.getUserById(req.params.id)
      if(t !== undefined){
        res.json(t)
      }
      else{
        res.sendStatus(404)
      }
})

app.post('/postings',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
      if('title' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing title from body'
        });
      }
      if('description' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing description from body'
        });
      }
      if('category' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing category from body'
        });
      }
      if('location' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing location from body'
        });
      }
      if('images' in req.body == false ) {
      return res.status(400).json({
           status: 'error',
            error: 'Missing images from body'
        });
      }
      if('price' in req.body == false ) {
        return res.status(400).json({
              status: 'error',
              error: 'Missing price from body'
          });
      }
      if('date' in req.body == false ) {
        return res.status(400).json({
              status: 'error',
              error: 'Missing date from body'
          });
      }
      if('delivery' in req.body == false ) {
        return res.status(400).json({
              status: 'error',
              error: 'Missing delivery from body'
          });
      }

      postings.createPosting (req.body.title, req.body.description, req.body.category, req.body.location,
          req.body.images, req.body.price, req.body.date, req.body.delivery, req.user.id)

      res.sendStatus(201);
})
/*
app.post('/postings/:id/data', (req, res) => {

    res.sendStatus(200);
})*/

app.post('/users', (req, res) => {

    if('username' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing username from body'
        });
    }
    if('name' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing name from body'
        });
    }
    if('email' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing email from body'
        });
    }
    if('password' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing password from body'
        });
    }
    if('address' in req.body == false ) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing address from body'
        });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 6);

    console.log(hashedPassword);
    users.addUser(req.body.username, req.body.name, req.body.email, hashedPassword, req.body.address)
    res.sendStatus(201)
})

app.delete('/postings/:id', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      postings.removePosting(req.body.id)
      res.sendStatus(200)
})

app.put('/postings/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    postings.editPosting (req.body.id, req.body.title, req.body.description, req.body.category, req.body.location,
        req.body.images, req.body.price, req.body.date, req.body.delivery)
    res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})