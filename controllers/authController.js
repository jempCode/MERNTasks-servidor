const Usuario = require("../models/Usuario");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async (req, res) => {
    // reisar si hay errores
    const errores = validationResult(req);

    if( ! errores.isEmpty() ) {
        return res.status(400).json( { errores: errores.array() });
    }

    const { email, password } =  req.body;

    try {
        // revisar que sea un usuario registrado
        let usuario =  await Usuario.findOne({email});

        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        // revisar el password
        const passCorrecto = await bcrypt.compare(password, usuario.password);

        if(!passCorrecto) {
            return res.status(401).send({msg: 'Password incorrecto'})
        }

        // si todo es correcto se crea el JWT
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
        console.log(error);
    }
}

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        return res.status(200).json({usuario});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error'});
    }
}