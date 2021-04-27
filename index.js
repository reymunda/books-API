const express = require('express')

const app = express()

app.use(express.json())

const programmingBooks = [
    {title: "Algorithm & Data Structure",description:"Basic algorithm concept",price:100000,id:1},
    {title: "Front End Lesson",description:"Basic front end with HTML,CSS,JS,and ReactJS",price:25000,id:2},
    {title: "Back End Lesson",description:"Basic back end with ExpressJS",price:20000,id:3},
    {title: "Fullstack Web Developer",description:"With MongoDB,ExpressJS,ReactJS,NodeJS",price:100000,id:4}
]

app.get('/',(req,resp) => {
    resp.send('This is my first API with ExpressJS') 
})

app.get('/api/programmingbooks/',(req,resp) => {
    resp.send(programmingBooks)
})
app.get('/api/programmingbooks/:id',(req,resp) => {
    let programmingBook = programmingBooks.find(e => e.id == req.params.id)
    if(!programmingBook) resp.status(404).send('Book not found')
    resp.send(programmingBook)
})
app.listen(8080)