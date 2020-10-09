const express = require('express')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 3000

app.use(bodyParser.json());

let users = [
    {
        id : uuidv4(),
        username : 'test',
        name : 'Testi Teppo',
        email : 'teppo@mail.com',
        password : '12345',
        address : {
            street : 'Testitie 1',
            country : 'Finland',
            postalCode : '11111',
            city : 'Helsinki'
        }
    },
    {
        userid : uuidv4(),
        username : "teppo1",
        name : "Testi Teppo",
        email : "teppo.testi@mail.com",
        password : "string",
        address : {
            street : "kaduntie 1",
            country : "Finland",
            postalCode : "012234",
            city : "Kaupunkila"
        }
    }
]

let postings = [
    {
        id : uuidv4(),
        title : "Bicycle",
        description : "A mountain bike, no issues.",
        category : "bicycles",
        location : "Helsinki",
        images : "string",
        price : 275,
        date : "14.9.2020",
        delivery : "pickup",
        seller : users[0]
    }
]

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/postings', (req, res) => {
    res.json({ postings });
})

app.get('/postings/:id', (req, res) => {
    const result = postings.find(t => t.id == req.params.id);
    if(result !== undefined)
    {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
})

app.get('/postings/:id/data', (req, res) => {
    
})

app.get('/users/:id', (req, res) => {
    const result = users.find(t => t.userid == req.params.id);
    if(result !== undefined)
    {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
})

app.post('/login', (req, res) => {

})

app.post('/postings', (req, res) => {

    const newPosting = {
        id : uuidv4(),
        title : req.body.title,
        description : req.body.description,
        category : req.body.category,
        location : req.body.location,
        images : req.body.images,
        price : req.body.price,
        date : req.body.date,
        delivery : req.body.delivery,
        seller : req.body.seller
    }
    postings.push(newPosting);

    res.sendStatus(200);
})

app.post('/postings/:id/data', (req, res) => {

    res.sendStatus(200);
})

app.post('/users', (req, res) => {

    const newUser = {
        userid : uuidv4(),
        username : req.body.username,
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        address : req.body.address
    }
    sensors.push(newUser);

    res.sendStatus(200);
})

app.delete('/sensors/:id', (req, res) => {

})

app.delete('/users/:id', (req, res) => {

})

app.put('/sensors/:id', (req, res) => {

})

app.put('/users/:id', (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})