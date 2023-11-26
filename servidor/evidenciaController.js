const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'resultados'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Ruta para subir un archivo
router.post('/:ieva_id/subir', authMiddleware.verifyToken,  upload.single('archivo'), (req, res) => {
  const { ieva_id } = req.params;
  const archivo = req.file;

  const query = 'INSERT INTO EVIDENCIA_ACTIVIDAD (IEVA_ID, EVI_TIPO, EVI_CONTENIDO) VALUES (?, 1, ?)';
  req.db.query(query, [ieva_id, archivo.filename], (error) => {
    if (error) {
      console.error('Error al guardar información de evidencia:', error.message);
      return handleErrors(res, error);
    }

    res.json({ message: 'Archivo subido exitosamente' });
  });
});

// Ruta para descargar un archivo
router.get('/:ieva_id/descargar', authMiddleware.verifyToken, (req, res) => {
  const { ieva_id } = req.params;

  const query = 'SELECT EVI_CONTENIDO, EVI_TIPO FROM EVIDENCIA_ACTIVIDAD WHERE IEVA_ID = ?';

  req.db.query(query, [ieva_id], (error, result) => {
    if (error) {
      console.error('Error al obtener información de evidencia:', error.message);
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
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Archivo no encontrado' });
    }
  });
});

module.exports = router;
