const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection;
// check connection
db.once('open', ()=>{
console.log('Connected to MongoDB')
})
// Check for an error 
db.on('error', (err) => {
    console.log(err)
})

const app = express()
const port = process.env.PORT || 3000

//Bring in modals
const Article = require('./models/article')

// Load View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// body parser middleware
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

//set public forlder 
app.use(express.static(path.join(__dirname,'public')))

app.get('/', (req, res) => {
    Article.find({}, (err,articles) =>{
        if(err){
            console.log(err)
        }
        else{
            res.render('index', {
                title : 'Articles',
                articles : articles
            })
        }
    })
})

//Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title : 'Add Article'
    })
})

//Add submit POST Route
app.post('/articles/add', (req, res) =>{

    let article = new Article();
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save((err)=>{
        if(err){
            console.log(err)
            return
        }
        else{
            res.redirect('/')
            console.log('submitted')
        }
    })
    
})

app.listen(port, () => {
    console.group(`Server is up running on port ${port}` )
})
