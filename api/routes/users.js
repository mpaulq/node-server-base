const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user.model');

// Retorna todos los usuarios
router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(result => {
        console.log(result);
        if (result.length) {
            res.status(200).json({retorno: result});
        } else {
            res.status(404).json({mensaje: 'No se encontraron usuarios'})
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
});

// Retorna un usuario por su id
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findOne(id)
    .exec()
    .then(result => {
        console.log(result);
        if (result) {
            res.status(200).json({retorno: result});
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
});

// Insertar un usuario
router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        permissionLevel: req.body.permissionLevel
    });
    user.save().then(result => {
        console.log(result);
        res.status(200).json({
            mensaje: 'Usuario creado exitosamente'
        });
    })
    .catch(err => {
        console.log(err);
    })
});

// Eliminar un usuario por su id
router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
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
        console.log(err);
    });
});

// Actualizar un usuario dado un id
router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for(let [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
    }
    User.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
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
});

module.exports = router;