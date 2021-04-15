const express = require('express');
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middlewares/auth');
const router = express.Router();
const { check } = require('express-validator');


//api/proyectos
router.post('/',
            [
                check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
            ],
            auth,
            proyectoController.crearProyecto
            );

router.get('/',
                auth,
                proyectoController.obtenerProyectos
            );

router.put('/:id',
            auth,
            [
                check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
            ],            
            proyectoController.actualizarProyecto
        );

module.exports = router;