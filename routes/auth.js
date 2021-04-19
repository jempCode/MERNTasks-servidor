const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const autController = require('../controllers/authController');
const auth = require('../middlewares/auth');


// api/auth
router.post('/',
    autController.autenticarUsuario
);
    
// obtiene el usuario autenticado
router.get('/',
    auth,
    autController.usuarioAutenticado    
);
module.exports = router;