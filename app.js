const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID;
//var db = mongojs('somiu', ['data']);
var db = mongojs("mongodb+srv://jeel:6809@StudentData-tm21t.mongodb.net/somiu?retryWrites=true&w=majority");


const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var path = require('path');

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
/*app.use('/', router);*/

app.listen(process.env.PORT, (req, res) => {
  
    console.log("The server started on port  !!!!!!");
});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })
   
//let upload = multer({ dest: 'uploads/' })

app.get("/", (req, res) => {
    res.send(
      `<h1 style='text-align: center'>
            Wellcome
            <br><br>
            <b style="font-size: 182px;">😃👻</b>
        </h1>`
    );
  });

  app.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
  })

  app.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send({sttus:  'ok'});
  })
app.get('/getdata/:id',(req ,res)=>{
  var id = ObjectId(req.params.id.toString());
  console.log(id);
  db.data.find({_id:id},{},(err ,data)=>{
    if (!err) {
      res.status(200).json({
          msg: data
      })
  } else {
      res.status(500).json({
          msg: err
      });
  }
  });
})
app.get('/alldata',(req ,res)=>{
  db.data.find({},(err ,data)=>{
    if (!err) {
      res.status(200).json({
          msg: data
      })
  } else {
      res.status(500).json({
          msg: err
      });
  }
  });
})

app.put('/update/:id',(req ,res)=>{
  console.log(req.params.id.toString()+" update");
  console.log(req.body);
  
  db.data.update({
    _id: ObjectId(req.params.id.toString())
  },
  {$set:{'user':req.body}},
  (err , data)=>{
    if (!err) {
      res.status(200).json({
          "msg": data
      });
  } else {
      res.status(500).json({
          "msg": err
          
      });
  }
  });
});

app.delete('/delrecord/:id', (req, res) => {

  var t = ObjectId(req.params.id.toString());
  db.data.remove({
      _id: t
  }, (err, msg) => {
      if (!err) {
          res.status(200).json({
              msg: msg
          });
      } else {
          res.status(500).json({
              msg: err
          });
      }
  })
})

  app.post('/addnew', (req, res) => {
    //onsole.log(req.body);
    db.data.save({
      'user':req.body
  }, (err, data) => {
      if (!err) {
          res.status(200).json({
              msg: data
          })
      } else {
          res.status(500).json({
              msg: err
          });
      }
  });
})

