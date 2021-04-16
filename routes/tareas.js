const express = require('express');
const tareaController = require('../controllers/tareaController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

const router = express.Router();

// creacion de tarea
router.post('/',
        auth,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('proyecto','El proyecto es obligatorio').not().isEmpty(),
        tareaController.crearTarea
);

// obtener las tarea spor poryecto 
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// actualizar tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

// eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;