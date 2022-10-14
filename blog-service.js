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
    const filteredByStatus = students.filter((student) => {
      return student.status == status
    })
    if (filteredByStatus.length == 0) reject('No results found (getStudentsByStatus)')
    resolve(filteredByStatus)
  })
}

const getStudentsByProgramCode = (programCode) => {
  return new Promise((resolve, reject) => {
    const filteredByProgram = students.filter((student) => {
      return student.program == programCode
    })
    if (filteredByProgram.length == 0) reject('No results found (getStudentsByProgramCode)')
    resolve(filteredByProgram)
  })
}

const getStudentsByExpectedCredential = (credential) => {
  return new Promise((resolve, reject) => {
    const filteredByCredential = students.filter((student) => {
      return student.expectedCredential == credential
    })
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
    resolve(filteredBySid)
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

module.exports = {
  initialize,
  getAllStudents,
  getInternationalStudents,
  getPrograms,
  getStudentsByStatus,
  getStudentById,
  getStudentsByExpectedCredential,
  getStudentsByProgramCode,
  addStudent
};
