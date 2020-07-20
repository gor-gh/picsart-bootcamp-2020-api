const mongoose = require('mongoose');
const User = require('../../models/user');
const Token = require('../../models/token');
const {validateUserData} = require('../../helpers/validators');
const {checkPasswordsForEquality} = require('../../helpers/checkPassword')
const {createToken, deleteToken, authenticate} = require('./tokensController');
const {hash} = require('../../helpers/hashPassword');

module.exports = {
    create: (req, res, next) => {
        const {
            email,
            password,
            firstName,
            lastName,
            birthDate,
            sex,
            avatarUrl,
            jsExperience,
            reactExperience,
            companyId
        } = req.body;

        if(companyId !== 1 && companyId !== 2){
            res.status(404).send("Company not found.")
        } else {
            if(companyId === 1 && mongoose.connection.name !== 'picsart-bootcamp-api-test'){
                mongoose.connection.close();
                mongoose.connect(
                    process.env.MONGODB_URI || "mongodb://localhost:27017/picsart-bootcamp-api-test",
                    { useNewUrlParser: true }
                )
            }
            User.findOne({email}, (err, user) => {
                if(user){
                    res.status(400).send("The user with specified email address already exists.")
                } else if(
                    !email ||
                    !password ||
                    !firstName ||
                    !lastName ||
                    !birthDate ||
                    !sex ||
                    !avatarUrl ||
                    jsExperience === undefined ||
                    reactExperience === undefined ||
                    !companyId
                ){
                    res.status(400).send("Missing required fields");
                } else {
                    const errorMessages = validateUserData(req.body);
                    if(errorMessages.length){
                        res.status(400).send(errorMessages.join(' & '));
                    } else {
                        const newUser = new User({
                            email,
                            password,
                            firstName,
                            lastName,
                            birthDate,
                            sex,
                            avatarUrl,
                            jsExperience,
                            reactExperience,
                            companyId
                        });
                        newUser.save((err, user) => {
                            if(err){
                                res.status(500).send("Sorry. Failed to create the user.")
                            } else {
                                res.status(200).send("User created successfully")
                            }
                        })
                    }
                }
            })
        }
    },

    getUserInfo: (req, res) => {
        const {token} = req.headers;
        if(!token){
            res.status(401).send("Failed to authenticate the user. There is no token mentioned.")
        } else {
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner', (err, token) => {
                        if(err || !token){
                            res.status(404).send("Could not find user with the specified email")
                        } else {
                            const userToSend = {
                                email: token.owner.email,
                                firstName: token.owner.firstName,
                                lastName: token.owner.lastName,
                                birthDate: token.owner.birthDate,
                                sex: token.owner.sex,
                                avatarUrl: token.owner.avatarUrl,
                                jsExperience: token.owner.jsExperience,
                                reactExperience: token.owner.reactExperience,
                                companyId: token.owner.companyId
                            }
                            res.status(200).json(userToSend);
                        }
                    });
                })
                .catch(err => res.status(401).send("Failed to authenticate the user. Invalid token."))
        }
    },

    login: (req, res) => {
        const { email, password } = req.body;
        if(email && password){
            User.findOne({ email }, (err, user) => {
                if (err || !user) {
                    res.status(404).send("Can't find user with specified username");
                } else {
                    checkPasswordsForEquality(password, user.password)
                        .then(passIsCorrect => {
                            if (passIsCorrect) {
                                createToken(user)
                                    .then(token => {
                                        const userToSend = {
                                            email: user.email,
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            birthDate: user.birthDate,
                                            sex: user.sex,
                                            avatarUrl: user.avatarUrl,
                                            jsExperience: user.jsExperience,
                                            reactExperience: user.reactExperience,
                                            companyId: user.companyId,
                                            token: token._id
                                        }
                                        res.status(200).json(userToSend);
                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                            msg: "Can't properly log in"
                                        });
                                    })
                            }
                        })
                        .catch(err => {
                            res.status(401).send(err.message);
                        })
                }
            })
        } else {
            res.status(400).send("Missing required fields");
        }
    },

    logout: (req, res) => {
        const { token } = req.headers;
        if (token) {
            deleteToken(token)
                .then(success => {
                    if (success) {
                        res.send("User logged out");
                    }
                })
                .catch(err => {
                    res.status(500).send("Can't logout the user");
                })
        } else {
            res.status(401).send("No token specified");
        }
    },

    updateUserInfo: (req, res) => {
        const contains = (arr, body) => {
            return Object.keys(body).every(k => arr.includes(k));
        }
        const validFields = ['email', 'password', 'firstName', 'lastName', 'avatarUrl', 'birthDate', 'sex', 'jsExperience', 'reactExperience', 'companyId'];
        const {token} = req.headers;
        const body = Object.assign({}, req.body);
        authenticate(token)
            .then(token => {
                Token.populate(token, 'owner', (err, token) => {
                    const errorMessages = validateUserData(body);
                    if(errorMessages.length){
                        res.status(400).send(errorMessages.jon(' & '));
                    } else {
                        if(contains(validFields, body)){
                            if(body.password){
                                body.password = hash(body.password);
                            }
                            User.findOneAndUpdate({email: token.owner.email}, body,{new: true},(err, user) => {
                                if(err || !user){
                                    res.status(500).send("Failed to update the user info");
                                } else {
                                    const updatedUser = {
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        birthDate: user.birthDate,
                                        sex: user.sex,
                                        avatarUrl: user.avatarUrl,
                                        jsExperience: user.jsExperience,
                                        reactExperience: user.reactExperience,
                                        companyId: user.companyId,
                                        token: token._id
                                    }
                                    res.status(200).json(updatedUser);
                                }
                            });
                        } else {
                            res.status(400).send("There is invalid fields in request body");
                        }
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(401).send("Failed to authenticate the user. Invalid token.")
            });
    }
}