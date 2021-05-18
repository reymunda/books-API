const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express()

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Node JS API Project",
            version: "1.0.0"
        },
        servers: [
            {
                url: 'http://localhost:3001/'
            }
        ]
    },
    apis: ['./mongodb.js']
}

const swaggerspec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerspec))

app.use(express.json())

let database

app.get('/',(req,resp) => {
    resp.send('Welcome to MongoDB')
})

app.get('/api/books',(req,resp) => {
    database.collection('books').find().toArray((error,result) => {
        if(error) throw error
        resp.send(result)
    })
})
app.get('/api/books/:id',(req,resp) => {
    database.collection('books').find({id: parseInt(req.params.id)}).toArray((error,result) => {
        if(error) throw error
        resp.send(result)
    })
})
app.post('/api/books/addBooks',(req,resp) => {
    let res = database.collection('books').find().sort({id:-1}).limit(1)
    res.forEach(e => {
        let obj = {
            id: e.id +1,
            title: req.body.title,
            description : req.body.description,
            price : req.body.price
        }
        database.collection('books').insertOne(obj,(err,result) => {
            if(err) resp.status(500).send(err)
            resp.send('Added succesfully')
        })
    })
})

app.put('/api/books/:id',(req,resp) => {
    let editBooks = {
        id: parseInt(req.params.id),
        title: req.body.title,
        description : req.body.description,
        price : req.body.price
    }
    let dataset = {
        $set : editBooks
    }
    database.collection('books').updateOne({id: parseInt(req.params.id)},dataset,((error,result) => {
        if(error) throw error
        resp.send(editBooks)
    }))
})
app.delete('/api/books/:id',(req,resp) => {
    database.collection('books').deleteOne({id:parseInt(req.params.id)},(error,result) => {
        if(error) throw error
        resp.send('Deleted successfully')
    })
})
app.listen(3001,() => {
    MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser : true,useUnifiedTopology: true},(error,result) => {
        if(error) throw error
        database = result.db('programmingBooksDB')
        console.log('Connection Succesfull')
    })
})
