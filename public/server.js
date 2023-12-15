var mongoose = require('mongoose')
var dbURL = 'mongodb+srv://sgopalakrishna8644:manage@nodeproject.eymepv8.mongodb.net/?retryWrites=true&w=majority';
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var cors = require('cors')
app.use(cors())
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//MongoDB cloud connection
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    console.log("MongoDB database connection", err)
})

var server = app.listen(3001, () => {
    console.log('Server is listening on port : ', server.address().port)
})

var Product = mongoose.model('product', {
    "id": Number,
    "product": {
        "productid": Number,
        "category": String,
        "price": Number,
        "name": String,
        "instock": Boolean
    }
});

// Fetch products using get API
app.get('/product/get/', (req, res) => {
    Product.find({}, (err, products) => {
        let productsToDisplay = {};
        products.forEach((prod) => {            
            productsToDisplay[prod.id] = prod;
        })
        res.send(productsToDisplay)
    })
})

//Create using post API
app.post('/product/create', (req, res) => {
    var product = new Product(req.body)
    product.save((err) => {
        if(err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    })
})

//Update using post API
app.post('/product/update/:id', (req, res) => {
    Product.updateOne(req.params, req.body, (err, data) => {
        res.redirect('/product/get');        
    })
})

//Delete using API
app.get('/product/delete/:id', (req, res) => {
    Product.deleteOne(req.params, (err, data) => {
        res.redirect('/product/get');        
    })  
})
