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

function isCoordinatorOrDean(user) {
  //console.log(`ItemC: El usuario es ${user.rol}`);
  return user && (user.rol === 'coordinador' || user.rol === 'decano');
}


function isOwner(userId, ownerId) {
  console.log(`ItemC: El usuario es dueño? ${userId} == ${ownerId}`);
  return userId == ownerId;
}


module.exports = (pool) => {
  // Obtener items segun evaluación actual del usuario
  router.get('/:id_usuario', authMiddleware.verifyToken, (req, res) => {
    const { id_usuario } = req.params;
    console.log(`Solicitud para obtener items de autoevaluación del usuario ID ${id_usuario}`);

    const userId = req.user ? req.user.userId || req.user.USR_IDENTIFICACION : null;

    // Verificar si el usuario tiene el rol de coordinador o decano
    const isCoordinatorOrDeanUser = isCoordinatorOrDean(req.user);

    if (!isCoordinatorOrDeanUser && !isOwner(userId, id_usuario)) {
      return res.status(403).json({ error: 'No tienes permisos para ver los items de esta evaluación' });
    }

    //Limitado a mostrar una fila

    const query = `
        SELECT
      IE.IEVA_ID,
      L.LAB_NOMBRE,
      TL.TL_DESCRIPCION AS TIPO_LABOR,
      L.LAB_HORAS,
      IE.IEVA_DESCRIPCION AS DESCRIPCION,
      E.EVA_ID,
      L.LAB_ID,
      IE.IEVA_ACTO,
      IE.IEVA_ESTADO,
      IE.IEVA_PUNTAJE,
      EA.EVI_TIPO,
      COALESCE(EA.EVI_CONTENIDO, 'valor_predeterminado') AS RESULTADOS
    FROM ITEM_EVALUACION IE
    JOIN EVALUACION E ON IE.EVA_ID = E.EVA_ID
    JOIN LABOR L ON IE.LAB_ID = L.LAB_ID
    JOIN TIPOLABOR TL ON L.TL_ID = TL.TL_ID
    LEFT JOIN (
      SELECT
        IEVA_ID,
        EVI_TIPO,
        EVI_CONTENIDO,
        ROW_NUMBER() OVER (PARTITION BY IEVA_ID ORDER BY EVI_ID) AS rn
      FROM EVIDENCIA_ACTIVIDAD
    ) EA ON IE.IEVA_ID = EA.IEVA_ID AND EA.rn = 1
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

      //console.log('Items de autoevaluación encontrados:', result);
      res.json(result);
    });
  });

  // Obtener detalle de un ítem de autoevaluación
  router.get('/detalle/:ieva_id', authMiddleware.verifyToken, (req, res) => {
    const { ieva_id } = req.params;
    console.log(`Solicitud para obtener detalle del ítem de autoevaluación con ID ${ieva_id}`);

    const userId = req.user ? req.user.userId || req.user.USR_IDENTIFICACION : null;

    const query = `
    SELECT
      IE.IEVA_ID,
      L.LAB_NOMBRE,
      TL.TL_DESCRIPCION AS TIPO_LABOR,
      L.LAB_HORAS,
      IE.IEVA_DESCRIPCION AS DESCRIPCION,
      E.EVA_ID,
      E.USR_IDENTIFICACION,
      L.LAB_ID,
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
    WHERE IE.IEVA_ID = ?;
  `;

    pool.query(query, [ieva_id], (error, result) => {
      if (error) {
        return handleErrors(res, error);
      }

      console.log('Detalle del ítem de autoevaluación encontrado:', result);
      res.json(result);
    });
  });

  // Agregar item
  router.post('/:id_usuario/add', authMiddleware.verifyToken, authMiddleware.checkRole(['decano', 'coordinador']), (req, res) => {
    const nuevoItem = new ItemEvaluacion(
      null,
      req.body.Lab_Id,
      req.body.Eva_Id,
      req.body.Ieva_Acto,
      req.body.Ieva_Estado,
      req.body.Ieva_Puntaje
    );

    const userId = req.user ? req.user.userId || req.user.USR_IDENTIFICACION : null;
    const evaluationId = req.body.Eva_Id;

    if (isOwner(req, userId)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }

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
  // Actualizar item
  router.put('/editar/:ieva_id', authMiddleware.verifyToken, (req, res) => {
    const { ieva_id } = req.params;

    console.log(`Solicitud para editar ítem con ID ${ieva_id}`);

    const item = {
      IEVA_ID: ieva_id,
      Lab_Id: req.body.Lab_Id,
      Eva_Id: req.body.Eva_Id,
      Ieva_Acto: req.body.Ieva_Acto,
      Ieva_Estado: req.body.Ieva_Estado,
      Ieva_Puntaje: req.body.Ieva_Puntaje
    };

    const itemCopy = { ...item };

    const userId = req.user ? req.user.userId || req.user.USR_IDENTIFICACION : null;

    console.log(`Usuario que realiza la solicitud: ${userId}`);

    // Obtener el propietario del ítem
    const getOwnershipQuery = 'SELECT USR_IDENTIFICACION FROM item_evaluacion JOIN evaluacion ON item_evaluacion.eva_id = evaluacion.eva_id WHERE ieva_id = ?';

    pool.query(getOwnershipQuery, [ieva_id], (ownershipError, ownershipResult) => {
      if (ownershipError) {
        return handleErrors(res, ownershipError);
      }

      const owner = ownershipResult.length > 0 ? ownershipResult[0].USR_IDENTIFICACION : null;

      console.log(`Propietario del ítem: ${owner}`);

      if (!owner) {
        return res.status(403).json({ error: 'No se encontró el propietario del ítem' });
      }

      if (!isOwner(userId, owner) && !isCoordinatorOrDean(req.user)) {
        // Si no es el propietario y no es coordinador, no tiene permisos
        console.log('Permiso denegado: No es el propietario y no es coordinador');
        return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
      }

      // Continuar con la actualización del item
      const updateQuery = 'UPDATE item_evaluacion SET ? WHERE ieva_id = ?';

      if (isOwner(userId, owner)) {
        // Si la evaluación le pertenece al usuario, solo se puede modificar el campo puntaje
        delete item.Lab_Id;
        delete item.Eva_Id;
        delete item.Ieva_Acto;
        delete item.Ieva_Estado;
      } else if (isCoordinatorOrDean(req.user)) {
        // Si el usuario es coordinador y la evaluación no le pertenece, se pueden modificar los demás campos excepto puntaje
        item.Ieva_Puntaje = item.Ieva_Puntaje !== undefined ? item.Ieva_Puntaje : 0;
      }

      pool.query(updateQuery, [item, ieva_id], (error) => {
        console.log('Ejecutando la consulta SQL para actualizar el ítem:', updateQuery);
        if (error) {
          console.error('Error al ejecutar la consulta SQL:', error);
          return handleErrors(res, error);
        }

        console.log('Ítem actualizado exitosamente');
        res.json('Item updated');
      });
    });
  });


  // Eliminar item
  router.delete('/eliminar/:ieva_id', authMiddleware.verifyToken, authMiddleware.checkRole(['decano', 'coordinador']), (req, res) => {
    const { ieva_id } = req.params;

    const userId = req.user ? req.user.USR_IDENTIFICACION : null;

    if (isOwner(req, userId)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }

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
