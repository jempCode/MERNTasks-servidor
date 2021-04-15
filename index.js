const express = require('express');
const conectarDb = require('./config/db')

// crear el servidor
const app = express();

// conectar a la base de datos
conectarDb();

// habilitar express.json
app.use(express.json({ extended: true }));

// puerto de la app
const PORT = process.env.port || 4000;

// importar todas las rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));

// arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});

