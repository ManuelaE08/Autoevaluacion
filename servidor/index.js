require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const itemController = require('./itemController');
const authController = require('./authController');
const evidenciaController = require('./evidenciaController');
//Tipo Labo y labor
const tipoLaborController = require('./tipoLaborController');
const laborController = require('./laborController');
const mysql = require('mysql');
const cors = require('cors');
const AuthMiddleware = require('./authMiddleware');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = require('./ruta/al/pool');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RUNNING SERVER IN: ${PORT}`);
});

const authMiddleware = new AuthMiddleware(process.env.SECRET_KEY || 'defaultSecret');

app.get('/', (req, res) => {
  res.send('HOLA');
});

// Rutas para items
app.use('/autoevaluacion', itemController(pool));

// Ruta para el inicio de sesión
app.use('/auth', authController);

// Ruta para tipo labor
app.use('/tipo-labor', tipoLaborController(pool));

// Ruta para labor
app.use('/labor', laborController(pool));

// Rutas para evidencias
app.use('/autoevaluacion/:id', evidenciaController(pool));


// Mensaje error general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
