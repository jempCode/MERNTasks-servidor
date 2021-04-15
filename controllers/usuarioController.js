const Usuario = require("../models/Usuario");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // reisar si hay errores
    const errores = validationResult(req);

    if( ! errores.isEmpty() ) {
        return res.status(400).json( { errores: errores.array() });
    }

    const { email, pasword } = req.body;
    
    try {
        let usuario = await Usuario.findOne({ email });

        if( usuario ) {
            return res.status(400).json({ msg: 'El usuario ya existe'});
        }

        // objeto del nuevo usuario
        usuario = new Usuario(req.body);
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
        // guardar el nuevo usuario
        await usuario.save();

        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        // firmar el token
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 3600,
        },(error, token) => {
            if(error) throw error;

            // mensaje de confirmacion
            res.json({ token });
        });

    } catch (error) {
        console.log(error,'Error de catch');
        return res.status(400).json({ msg: 'error al crear el usuario'});
    }
}