
/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Mahsa Ghasemi Student ID:   152449195    Date: 14 october 2022
*
*  Online (Cyclic) Link: 
*
********************************************************************************/ 






const HTTP_PORT = process.env.PORT || 8080;

const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/uploaded')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })



const data = require(path.join(__dirname, 'blog-service.js'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/students', (req, res, next) => {
  if (req.query.status) {
    data.getStudentsByStatus()
      .then(data => { res.json(data) })
      .catch(err => console.log(err))
  }
  if (req.query.program) {
    data.getStudentsByProgramCode()
      .then(data => { res.json(data) })
      .catch(err => console.log(err))
  }
  if (req.query.credential) {
    data.getStudentsByExpectedCredential()
      .then(data => { res.json(data) })
      .catch(err => console.log(err))
  }
  data
    .getAllStudents()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('Error retrieving employees: ' + err);
      res.json({ message: err });
    });
});

app.get('/student/:sid', (req, res) => {
  data.getStudentById(req.params.sid)
    .then(data => res.json(data))
    .catch(err => console.log(err))
})

app.post('/students/add', (req, res) => {
  data.addStudent(req.body).then(
    res.redirect('/students')
  )
    .catch(err => console.log(err))
})

app.get('/intlstudents', (req, res, next) => {
  data
    .getInternationalStudents()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('Error retrieving managers: ' + err);
      res.json({ message: err });
    });
});

app.get('/programs', (req, res, next) => {
  data
    .getPrograms()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('Error retrieving departments: ' + err);
      res.json({ message: err });
    });
});

app.get('/students/add', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/addStudent.html'));
})
app.get('/images/add', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/addImage.html'));
})
app.post('/images/add', upload.single('imageFile'), (req, res) => {
  res.redirect('/images')
})

app.get('/images', (req, res) => {
  fs.readdir("./public/images/uploaded", function (err, items) {
    if (err) return console.log(err)
    res.json(items)
  })
})

app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

data
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT);
    console.log('Express http server listening on ' + HTTP_PORT);
  })
  .catch((err) => {
    console.log('Error starting server: ' + err + ' aborting startup');
  });
