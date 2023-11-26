const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'resultados'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({ storage: storage });
};

const handleErrors = (res, error) => {
  console.error(error.message);
  return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = (pool) => {
  router.post('/:usr_identificacion/:ieva_id/subir', authMiddleware.verifyToken, configureMulter().single('archivo'), (req, res) => {
    const { usr_identificacion, ieva_id } = req.params;
    const archivo = req.file;

    const query = 'INSERT INTO EVIDENCIA_ACTIVIDAD (IEVA_ID, EVI_TIPO, EVI_CONTENIDO) VALUES (?, 1, ?)';
    pool.query(query, [ieva_id, archivo.filename], (error) => {
      if (error) {
        return handleErrors(res, error);
      }

      res.json({ message: 'Archivo subido exitosamente' });
    });
  });

  router.get('/evidencias/descargar/:ieva_id', authMiddleware.verifyToken, (req, res) => {
    const { ieva_id } = req.params;

    if (!pool) {
      console.error('Error: pool is undefined');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT EVI_CONTENIDO, EVI_TIPO FROM EVIDENCIA_ACTIVIDAD WHERE IEVA_ID = ?';

    pool.query(query, [ieva_id], (error, result) => {
      if (error) {
        return handleErrors(res, error);
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Evidencia no encontrada' });
      }

      const evidencia = result[0];

      if (evidencia.EVI_TIPO !== 1) {
        return res.status(400).json({ error: 'La evidencia no es un archivo descargable' });
      }

      const filePath = path.join(__dirname, 'resultados', evidencia.EVI_CONTENIDO);

      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/zip');
        res.sendFile(filePath);
        console.error('Archivo enviado');
      } else {
        res.status(404).json({ error: 'Archivo no encontrado' });
      }
    });
  });

  return router;
};
