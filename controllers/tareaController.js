const { validationResult } = require("express-validator");
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");

// Crear una tarea
exports.crearTarea = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores:errores.array()});
    }

    
    try {
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encotrado' });
        }

        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado'});
        }

        // creamos la tarea
        const tarea =  new Tarea(req.body);
        await tarea.save();

        return res.status(201).json({tarea});

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error'});
    }
     
}

// obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encotrado' });
        }

        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado'});
        }

        const tareas =  await Tarea.find({proyecto});
        return res.status(200).json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'})
    }
}


// actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const { proyecto, nombre, estado } = req.body;

        // si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg:'La tarea no existe'});
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        // extraer proyecto
        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado'});
        }


        const nuevaTarea = {};

        if(nombre){
            nuevaTarea.nombre = nombre;
        }
        
        if(estado){
            nuevaTarea.estado = estado;
        }

        // guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id},nuevaTarea,{ new: true});

        return res.status(201).json({tarea});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error'});
    }
}

// eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto} = req.body;
        // si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg:'La tarea no existe'});
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        // extraer proyecto
        if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No Autorizado'});
        }

        // eliminar
        await Tarea.findOneAndRemove({_id:req.params.id});
        return res.status(200).json({msg:'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Error en el servidor'});
    }
}
