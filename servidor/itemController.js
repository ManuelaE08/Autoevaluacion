const express = require('express');
const ItemEvaluacion = require('./models/ItemEvaluacion');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

module.exports = (pool) => {
  // Obtener items según evaluación
  router.get('/:eva_id', authMiddleware.verifyToken, (req, res) => {
    const { eva_id } = req.params;
    console.log(`Solicitud para obtener items de la evaluación ID ${eva_id}`);
    if (req.user && req.user.rol !== 'guest') {
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  });

  // Obtener un solo ítem por ID
  router.get('/detalle/:ieva_id', authMiddleware.verifyToken, (req, res) => {
    const { ieva_id } = req.params;
    console.log(`Solicitud para obtener detalles del ítem ID ${ieva_id}`);
    const query = 'SELECT * FROM item_evaluacion WHERE ieva_id = ?';

    pool.query(query, [ieva_id], (error, result) => {
      if (error) {
        console.error('Error en la consulta:', error.message);
        return handleErrors(res, error);
      }

      if (result.length > 0) {
        console.log('Detalles del ítem encontrados:', result[0]);
        res.json(ItemEvaluacion.fromDBRow(result[0]));
      } else {
        console.log('Ítem no encontrado');
        res.json({ message: 'Item not found' });
      }
    });
  });

  // Agregar item
  router.post('/add', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {

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
