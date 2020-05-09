const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.users_signup = (req, res, next) => {
    User.find({ user: req.body.email })
        .exec()
        .then(user => {
            if(user.length) {
                return res.status(422).json("Un usuario con este email ya existe")
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            userImg: req.file? req.file.path: null
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    mensaje: 'Usuario creado exitosamente',
                                    usuarioCreado: {
                                        _id: result._id,
                                        email: result.email,
                                        password: result.password,
                                        userImg: result.userImg,
                                        request: {
                                            type: 'GET',
                                            url: 'localhost:3000/users/' + result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
}

exports.users_login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    mensaje: 'Autenticación fallida'
                })
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                    return res.status(200).json({
                        mensaje: 'Autenticación correcta',
                        token: token
                    })
                }
                if(err) {
                    return res.status(401).json({
                        mensaje: 'Autenticación fallida'
                    })
                }
                res.status(401).json({
                    mensaje: 'Autenticación fallida'
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.users_get_all = (req, res, next) => {
    User.find()
    .select('_id email password permissionLevel userImg')
    .exec()
    .then(result => {
        const response = {
            count: result.length,
            users: result.map(user => {
                return {
                    _id: user._id,
                    email: user.email,
                    password: user.password,
                    userImg: user.userImg,
                    request: {
                        type: 'GET',
                        url: 'localhost:3000/users/' + user._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
}

exports.users_get_one = (req, res, next) => {
    const id = req.params.userId;
    User.findOne({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                mensaje: 'No se encontraron usuarios'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
}

exports.users_delete = (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        if (result.ok) {
            res.status(200).json({
                mensaje: 'Usuario eliminado exitosamente'
            });
        } else {
            res.status(500).json({
                mensaje: 'Operación terminada con errores'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.users_edit = (req, res, next) => {
    const id = req.params.userId;
    const values = {
        email: req.body.email || null,
        password: req.body.password || null,
        userImg: req.file? req.file.path : null
    }
    const updateOps = {}
    for(let [key, value] of Object.entries(values)) {
        if (value) {
            updateOps[key] = value;
        }
    }
    User.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        if (result.ok) {
            res.status(200).json({
                mensaje: 'Usuario actualizado exitosamente'
            });
        } else {
            res.status(500).json({
                mensaje: 'Operación terminada con errores'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
}