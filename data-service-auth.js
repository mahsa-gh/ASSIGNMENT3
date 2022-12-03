const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{ dateTime: Date, userAgent: String }]
});

let User

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://m-ghasemi:sevita243@cluster0.ngf1bmd.mongodb.net/?retryWrites=true&w=majority");

        db.on('error', (err) => {
            reject(`${err} mongo`);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password !== userData.password2) {
            return reject("Passwords do not match")
        }
        console.log(userData.password)
        bcrypt.genSalt(10)  // Generate a "salt" using 10 rounds
            .then(salt => bcrypt.hash(userData.password, salt)) // encrypt the password: "myPassword123"
            .then(hash => {
                userData.password = hash
                let newUser = new User(userData);
                newUser.save().then(() => {
                    resolve()
                }).catch(err => {
                    if (err.code == 11000) {
                        reject("User Name already taken")
                    } else {
                        reject(`There was an error creating the user: ${err}`)
                    }
                })
            })
            .catch(err => {
                return reject('There was an error encrypting the password')
            });  
    });
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName }).then(users => {
            if (users.length < 0) {
                return reject(`Unable to find user: ${userData.userName}`)
            }
            bcrypt.compare(userData.password, users[0].password).then((result) => {
                if (result) {
                    User.updateOne(
                        { userName: userData.userName },
                        { $push:{loginHistory: { dateTime: (new Date()).toString(), userAgent: userData.userAgent }} }
                    ).exec().then(() => {
                        resolve(users[0])
                    }).catch(err => reject("There was an error verifying the user: err"))
                } else {
                    return reject(`Incorrect Password for user: ${userData.userName}`)
                }

            });

        }).catch(err => reject(`Unable to find user: ${userData.userName} `))
    });
};
