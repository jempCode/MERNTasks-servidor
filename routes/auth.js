const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const autController = require('../controllers/authController');

// api/auth
router.post('/',
    [
        check('email', 'Agregar un email valdo').isEmail(),
        check('password', 'El pasword debe ser minimo de 6 caractres').isLength({ min: 6 }),
    ],
    autController.autenticarUsuario
);

module.exports = router;