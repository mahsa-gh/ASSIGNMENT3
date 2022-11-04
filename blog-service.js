const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

var students = [];
var programs = [];

const initialize = () => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(
        path.join(__dirname, '/data/students.json'),
        'utf-8',
        (err, data) => {
          if (err) {
            console.log(err);
            throw err;
          }

          students = JSON.parse(data);
        }
      );

      fs.readFile(
        path.join(__dirname, '/data/programs.json'),
        'utf-8',
        (err, data) => {
          if (err) {
            console.log(err);
            throw err;
          }

          programs = JSON.parse(data);
        }
      );
    } catch (ex) {
      console.log('Error encountered in file reading.');
      reject('Error encountered in file reading.');
    }
    resolve();
  });
};

const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    if (students.length === 0) {
      reject('No students found!');
    } else {
      resolve(
        students.filter(() => {
          return true;
        })
      );
    }
  });
};

const getInternationalStudents = () => {
  return new Promise((resolve, reject) => {
    const all_students = students.filter((student) => {
      return student.isInternationalStudent === true;
    });
    if (all_students.length > 0) {
      resolve(all_students);
    } else {
      reject('No results found!');
    }
  });
};

const getPrograms = () => {
  return new Promise((resolve, reject) => {
    if (programs.length === 0) {
      reject('No results found');
    } else {
      resolve(
        programs.filter(() => {
          return true;
        })
      );
    }
  });
};

const getStudentsByStatus = (status) => {
  return new Promise((resolve, reject) => {
    const filteredByStatus = []
    for (let index = 0; index < students.length; index++) {
      if (students[index].status == status) {
        filteredByStatus.push(students[index])
      }

    }
    if (filteredByStatus.length == 0) reject('No results found (getStudentsByStatus)')
    resolve(filteredByStatus)
  })
}

const getStudentsByProgramCode = (programCode) => {
  return new Promise((resolve, reject) => {
    const filteredByProgram = []
    for (let index = 0; index < students.length; index++) {
      if (students[index].program == programCode) {
        filteredByProgram.push(students[index])
      }

    }
    if (filteredByProgram.length == 0) reject('No results found (getStudentsByProgramCode)')
    resolve(filteredByProgram)
  })
}

const getStudentsByExpectedCredential = (credential) => {
  return new Promise((resolve, reject) => {
    const filteredByCredential = []
    for (let index = 0; index < students.length; index++) {
      if (students[index].expectedCredential == credential) {
        filteredByCredential.push(students[index])
      }

    }
    if (filteredByCredential.length == 0) reject('No results found (getStudentsByExpectedCredential)')
    resolve(filteredByCredential)
  })
}

const getStudentById = (sid) => {
  return new Promise((resolve, reject) => {
    const filteredBySid = students.filter((student) => {
      return student.studentID == sid
    })
    if (filteredBySid.length == 0) reject('No results found (getStudentById)')
    resolve(filteredBySid[0])
  })
}
const addStudent = (StudentData) => {
  return new Promise((resolve, reject) => {
    let isInternational
    if (StudentData.isInternationalStudent == undefined) {
      isInternational = false
    } else {
      isInternational = true
    }
    const studentID = students.length + 1
    const studentObject = {
      "studentID": studentID,
      "firstName": StudentData.firstName,
      "lastName": StudentData.lastName,
      "email": StudentData.email,
      "phone": StudentData.phone,
      "addressStreet": StudentData.addressStreet,
      "addressCity": StudentData.addressCity,
      "addressState": StudentData.addressState,
      "addressPostal": StudentData.addressPostal,
      "gender": StudentData.gender,
      "isInternationalStudent": isInternational,
      "expectedCredential": StudentData.expectedCredential,
      "status": StudentData.status,
      "program": StudentData.program,
      "registrationDate": StudentData.registrationDate
    }
    students.push(studentObject)
    resolve()
  })
}
const updateStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < students.length; i++) {
      const id = studentData.studentID
      if (students[i].studentID.trim() == id.trim()) {
        students[i].firstName = studentData.firstName
        students[i].lastName = studentData.lastName
        students[i].email = studentData.email
        students[i].phone = studentData.phone
        students[i].addressStreet = studentData.addressStreet
        students[i].addressCity = studentData.addressCity
        students[i].addressState = studentData.addressState
        students[i].addressPostal = studentData.addressPostal
        students[i].isInternationalStudent = studentData.isInternationalStudent
        students[i].expectedCredential = studentData.expectedCredential
        students[i].status = studentData.status
        students[i].program = studentData.program
        students[i].registrationDate = studentData.registrationDate
      }
    }
    resolve()
  })
}

module.exports = {
  initialize,
  getAllStudents,
  getInternationalStudents,
  getPrograms,
  getStudentsByStatus,
  getStudentById,
  getStudentsByExpectedCredential,
  getStudentsByProgramCode,
  addStudent,
  updateStudent
};
