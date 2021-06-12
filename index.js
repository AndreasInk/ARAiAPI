const express = require('express')
const multer = require('multer')

const app = express()
const port = process.env.PORT || 3000

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, callback) {
      callback(null, file.originalname)
  }
});
var printed = "This can be accessed anywhere!";
var ids = [String]
const upload = multer({ storage: storage })

app.get('/getIDs', function (req, res) {
    
    res.send({"ids": ids});
});

app.get('/getImage', function (req, res) {
    
    res.sendFile(__dirname + "/uploads/" + req.query.id + ".jpg");
});
app.get('/', function(req, res) {
    res.send("Cool! The server is running!")
})
app.get('/getUploads', function(req, res) {
    res.send(upload.files)
})
app.get('/printNow', function(req, res) {
    printed = req.query.print
    res.send(printed)
    return 'hello'
})
app.get('/getLogs', function(req, res) {
    res.send({ id: "", "process": printed })
    return 'hello'
})
app.post('/upload', upload.single('uploadedFile'), (req, res) => {
    if (req.file) {
        console.log(req.file)
        console.log(req.body)
        
        return res.send({ id: "", "savedImg": "", "process": printed })
    } else {
        return res.send({ id: "", "savedImg": "", "process": printed })
    }
})


app.post('/multiupload', upload.array('uploadedFile', 10), (req, res) => {
    if (req.files) {
        console.log("Received files:")
        for (let i=0; i<req.files.length; i++) {
            console.log(req.files[i])
            ids.push(req.files[i].originalname)
        }

        return res.send({ result: true })
    } else {
        return res.send({ result: false })
    }
})

app.listen(port)
console.log('Server started successfully on port ' + port + "!")