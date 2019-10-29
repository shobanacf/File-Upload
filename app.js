const express = require('express');
const bodyParser = require(
	'body-parser');
const multer = require('multer')
const fs = require('fs')

//connect to mongoDB
const { MongoClient, ObjectId } = require('mongodb')
const url = 'mongodb://localhost:27017'
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
	if (err) return console.log(err)
		console.log('Successful connection to mongodb');
	db = client.db('Upload_db')
}) 

//create express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

//Routes
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

//set storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		let a = file.originalname.split('.')
     cb(null, `${file.fieldname}-${Date.now()}.${a[a.length-1]}`)	
 }
});

const upload = multer({ storage: storage });

// Uploading single file
app.post('/uploadfile', upload.single('file'), (req, res) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)

   db.collection('images').insertOne(file, (err, result) => {
	console.log(result)
	
   })
});

app.listen(3000, () => console.log('server listening to port 3000'));