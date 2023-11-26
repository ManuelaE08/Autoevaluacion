const express = require('express');
const ItemEvaluacion = require('./models/ItemEvaluacion');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

function handleErrors(res, error) {
  console.error('Error:', error.message);
  return res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = (pool) => {
  // Obtener items según evaluación actual del usuario
  router.get('/:id_usuario', authMiddleware.verifyToken, (req, res) => {
    const { id_usuario } = req.params;
    console.log(`Solicitud para obtener items de autoevaluación del usuario ID ${id_usuario}`);

    const query = `
      SELECT
        IE.IEVA_ID,
        L.LAB_NOMBRE,
        TL.TL_DESCRIPCION AS TIPO_LABOR,
        L.LAB_HORAS,
        IE.IEVA_DESCRIPCION AS DESCRIPCION,
        IE.IEVA_ACTO,
        IE.IEVA_ESTADO,
        IE.IEVA_PUNTAJE,
        EA.EVI_TIPO,
        COALESCE(EA.EVI_CONTENIDO, 'valor_predeterminado') AS RESULTADOS
      FROM ITEM_EVALUACION IE
      JOIN EVALUACION E ON IE.EVA_ID = E.EVA_ID
      JOIN LABOR L ON IE.LAB_ID = L.LAB_ID
      JOIN TIPOLABOR TL ON L.TL_ID = TL.TL_ID
      LEFT JOIN EVIDENCIA_ACTIVIDAD EA ON IE.IEVA_ID = EA.IEVA_ID
      WHERE E.USR_IDENTIFICACION = ? AND E.EVA_ID = (
        SELECT EVA_ID
        FROM EVALUACION
        WHERE USR_IDENTIFICACION = ?
        ORDER BY PER_ID DESC
        LIMIT 1
      );
    `;

    pool.query(query, [id_usuario, id_usuario], (error, result) => {
      if (error) {
        return handleErrors(res, error);
      }

      console.log('Items de autoevaluación encontrados:', result);
      res.json(result);
    });
  });



  // Agregar item
  router.post('/:id_usuario/add', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {

    const nuevoItem = new ItemEvaluacion(
      null,
      req.body.Lab_Id,
      req.body.Eva_Id,
      req.body.Ieva_Acto,
      req.body.Ieva_Estado,
      req.body.Ieva_Puntaje
    );

    const userRole = req.user ? req.user.rol : null;
    console.log(`Usuario logeado con rol: ${userRole}`);

    const query = 'INSERT INTO item_evaluacion SET ?';
    pool.query(query, nuevoItem, (error) => {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json('Item added');
    });
  });



  // Actualizar item
  router.put('/editar/:ieva_id', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {
    const { ieva_id } = req.params;

    const item = new ItemEvaluacion(
      ieva_id,
      req.body.Lab_Id,
      req.body.Eva_Id,
      req.body.Ieva_Acto,
      req.body.Ieva_Estado,
      req.body.Ieva_Puntaje
    );

    const query = 'UPDATE item_evaluacion SET ? WHERE ieva_id = ?';
    pool.query(query, [item, ieva_id], (error) => {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json('Item updated');
    });
  });

  // Eliminar item
  router.delete('/eliminar/:ieva_id', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {
    const { ieva_id } = req.params;

    const query = 'DELETE FROM item_evaluacion WHERE ieva_id = ?';
    pool.query(query, [ieva_id], (error) => {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json('Item removed');
    });
  });

  return router;
};
