const { validationResult } = require("express-validator");
const Proyecto = require("../models/Proyecto");
exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores:errores.array()});
    }

    try {
        // crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        // Guardadndo el creador via JWT
        proyecto. creador = req.usuario.id;

        // guardando el proyecto
        proyecto.save()
        res.status(201).json(proyecto)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}

// obtienes todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({creado: -1});
        res.status(200).json(proyectos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'hubo un error'});
    }
}


// actualiza un proyecto
exports.actualizarProyecto = async (req,res)=> {
    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores:errores.array()});
    }

    // extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        
        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        
        // revisar si existe el prooyecto
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})   ;
        }
        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({mgs: 'No autorizado'});
        }
        // actualizar
        // proyecto = await Proyecto.findByIdAndUpdate( id:{ req.params.id}, {$set: nuevoProyecto} )

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Error en el servidor'});
    }
}