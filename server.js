/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 8
*  Name: Mahsa Ghasemi  Student ID: 152449195  Date: November 18th
*
*  Online (Cyclic) Link: https://smoggy-dog-mittens.cyclic.app/
*
********************************************************************************/ 




const HTTP_PORT = process.env.PORT || 8080;

const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer')
const fs = require('fs')
const handleBars = require('express-handlebars')

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

app.engine('.hbs', handleBars.engine({
  extname: '.hbs', helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    }
    ,
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set('view engine', '.hbs');

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});



app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/about', (req, res, next) => {
  res.render('about');
});

app.get('/students', (req, res, next) => {
  if (req.query.status) {
    return data.getStudentsByStatus(req.query.status)
      .then(data => {
        if (data.length > 0) {
          return res.render("students", { students: data })
        } else {
          return res.render("students", { message: "no results" });
        }

      })
      .catch(err => console.log(err))
  }
  if (req.query.program) {
    return data.getStudentsByProgramCode(req.query.program)
      .then(data => {
        if (data.length > 0) {
          return res.render("students", { students: data })
        } else {
          return res.render("students", { message: "no results" });
        }
      })
      .catch(err => console.log(err))
  }
  if (req.query.credential) {
    return data.getStudentsByExpectedCredential(req.query.credential)
      .then(data => {
        if (data.length > 0) {
          return res.render("students", { students: data })
        } else {
          return res.render("students", { message: "no results" });
        }
      })
      .catch(err => console.log(err))
  }
  data
    .getAllStudents()
    .then((data) => {
      if (data.length > 0) {
        res.render("students", { students: data })
      } else {
        res.render("students", { message: "no results" });
      }
    })
    .catch((err) => {
      console.log('Error retrieving employees: ' + err);
      res.render("students", { message: err })
    });
});

app.get('/student/:sid', (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};

  data.getStudentById(req.params.sid).then((data) => {
    if (data) {
      viewData.student = data; //store student data in the "viewData" object as "student"
    } else {
      viewData.student = null; // set student to null if none were returned
    }
  }).catch(() => {
    viewData.student = null; // set student to null if there was an error 
  }).then(data.getPrograms)
    .then((data) => {
      viewData.programs = data; // store program data in the "viewData" object as "programs"

      // loop through viewData.programs and once we have found the programCode that matches
      // the student's "program" value, add a "selected" property to the matching 
      // viewData.programs object

      for (let i = 0; i < viewData.programs.length; i++) {
        if (viewData.programs[i].programCode == viewData.student.program) {
          viewData.programs[i].selected = true;
        }
      }

    }).catch(() => {
      viewData.programs = []; // set programs to empty if there was an error
    }).then(() => {
      if (viewData.student == null) { // if no student - return an error
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); // render the "student" view
      }
    }).catch((err) => {
      res.status(500).send("Unable to Show Students");
    });
});


app.post('/students/add', (req, res) => {
  data.addStudent(req.body).then(
    res.redirect('/students')
  )
    .catch(err => console.log(err))
})

app.post("/student/update", (req, res) => {
  data.updateStudent(req.body).then(() => {
    res.redirect("/students");
  }).catch(err => console.log(err))
});


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
      if (data.length > 0) {
        return res.render("programs", { programs: data })
      } else {
        return res.render("programs", { message: "no results" });
      };
    })
    .catch((err) => {
      console.log('Error retrieving departments: ' + err);
      res.json({ message: err });
    });
});

app.get('/students/add', (req, res) => {
  data.getPrograms().
    then(data => {
      res.render("addStudent", { programs: data });
    })
    .catch(err => {
      res.render("addStudent", { programs: [] });
    })
})
app.get('/images/add', (req, res) => {
  res.render('addImage');
})
app.post('/images/add', upload.single('imageFile'), (req, res) => {
  res.redirect('/images')
})

app.get('/images', (req, res) => {
  fs.readdir("./public/images/uploaded", function (err, data) {
    if (err) return console.log(err)
    console.log(data)
    res.render('images', {
      data: data,
      layout: false // do not use the default Layout (main.hbs)
    })
  })
})
app.get('/programs/add', (req, res) => {
  res.render("addProgram")
})

app.post('/programs/add', (req, res) => {
  data.addProgram(req.body).then(() => { res.redirect('/programs') })
})

app.post("/programs/add", (req, res) => {
  data.updateProgram(req.body).then(() => {
    res.redirect("/programs");
  }).catch(err => console.log(err))
});

app.get('/program/:programCode', (req, res) => {
  data.getProgramByCode(req.params.programCode)
    .then((data) => {
      if (data.length > 0) {
        return res.render("program", { program: data })
      } else {
        return res.status(404).send("Program Not Found");
      }
    })
    .catch(err => console.log(err))
})

app.get('/programs/delete/:programCode', (req, res) => {
  data.deleteProgramByCode(req.params.programCode).then(() => {
    res.redirect('/programs')
  }).catch(err => { res.status(500).send("Unable to Remove Program / Program not found)"); })
})
app.get('/students/delete/:studentID', (req, res) => {
  data.deleteStudentById(req.params.studentID).then(() => {
    res.redirect('/students')
  }).catch(err => { res.status(500).send("Unable to Remove Student / Student not found"); })
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
