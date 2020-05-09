const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user.controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Registra un usuario
router.post('/registrar', upload.single('userImg'), UserController.users_signup );

// Login de usuario
router.post('/login', UserController.users_login);

// Retorna todos los usuarios
router.get('/', checkAuth, UserController.users_get_all);

// Retorna un usuario por su id
router.get('/:userId', checkAuth, UserController.users_get_one);

// Eliminar un usuario por su id
router.delete('/:userId', checkAuth, UserController.users_delete);

// Actualizar un usuario dado un id
router.patch('/:userId', checkAuth, upload.single('userImg'), UserController.users_edit);

module.exports = router;