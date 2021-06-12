const express = require('express')
const multer = require('multer')
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
const app = express()
const port = process.env.PORT || 3000

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, callback) {
      callback(null, file.originalname)
  }
});
var printed = "...";
var ids = [];
var queue = [];
const upload = multer({ storage: storage })
var complete = false;
var ready = "";
app.get('/checkIDFinishedUploading', function (req, res) {
 
         res.send({"complete": complete});
    
    
});
app.get('/finishedUploading', function (req, res) {
    
        complete = true
         res.send({"complete": complete});
    
    
});
app.get('/checkQueue', function (req, res) {
    
    res.send({"queue": queue});
});
app.get('/joinQueue', function (req, res) {
    queue.push(req.query.userID)
    res.send({"queue": queue});
});
app.get('/leaveQueue', function (req, res) {
    queue.shift()
    ids = []
    printed = ""
    complete = false
    async function start() {
    unlinkAsync(__dirname + "/uploads/")
    }
    start()
    res.send({"complete": true});
});
app.get('/getIDs', function (req, res) {
    
    res.send({"ids": ids});
});

app.get('/getImage', function (req, res) {
    start()
    async function start() {
    //unlinkAsync(__dirname + "/uploads/" + req.query.id)
    ids.shift()
    res.sendFile(__dirname + "/uploads/" + req.query.id);
    
    }
    

});

app.get('/getUSDZ', function (req, res) {
    start()
    async function start() {
    //unlinkAsync(__dirname + "/uploads/" + req.query.id)
    //ids.shift()
    res.sendFile(__dirname + "/uploads/result.usdz");
    
    }
    

});
app.get('/setIDs', function(req, res) {

    ids = req.query.ids
    res.send({"complete": true})
})
app.get('/getIsReady', function(req, res) {

    res.send({"ready" : ready})
})
app.get('/isReady', function(req, res) {
    ready = true
    res.send({"ready" : ready})
})
app.get('/', function(req, res) {
    res.send("Cool! The server is running!")
})
app.get('/getUploads', function(req, res) {
    res.sendFile(__dirname + "/uploads");
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
            //ids.push(req.file.originalname)
            return res.send({ id: "", "savedImg": "", "process": printed })
            ready = true
    } else {
            return res.send({ id: "", "savedImg": "", "process": printed })
    }

})


app.post('/multiupload', upload.array('uploadedFile', 10), (req, res) => {
    if (req.files) {
        console.log("Received files:")
        for (let i=0; i<req.files.length; i++) {
            console.log(req.files[i])
            //ids.push(req.files[i].originalname)
        }
        ready = true
        return res.send({ result: true })
    } else {
        return res.send({ result: false })
    }
})

app.listen(port)
console.log('Server started successfully on port ' + port + "!")