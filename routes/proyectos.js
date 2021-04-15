const express = require('express');
const proyectoController = require('../controllers/proyectoController');

const router = express.Router();

//api/proyectos
router.post('/', proyectoController.crearProyecto);

module.exports = router;