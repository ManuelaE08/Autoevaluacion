const express = require('express');
const usuRol = require('./models/usuRol');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

module.exports = (conexion) => {
    
  //obtener use-Rol por id 
  router.get('/id/:id_ur/:id_rol',(req,res) => {
      const {id_ur, id_rol} = req.params;
      const query = `SELECT * FROM USEROL WHERE USR_IDENTIFICACION = ${id_ur} AND ROL_ID = ${id_rol}`;
      conexion.query(query,(error,result) => {
          if(error) return console.error(error.message);

          if(result.length > 0){
              res.json(result.map(usuRol.fromDBRow));
          }else{
              res.json({message: 'Use-Rol not found'});
          }
      });
  });

  //crear use-Rol 
  router.post('/agregar',authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {
      const nuevouseRol = new usuRol( 
          req.body.usr_identificaodor,
          req.body.rol_id,
          req.body.ur_fechaInicio,
          req.body.ur_fechaFin
      );
      
      const userRole = req.user ? req.user.rol : null;
      console.log(`Use-Rol logeado con rol: ${userRole}`);

      console.log(nuevouseRol);
      const query = `insert into userol (USR_IDENTIFICACION, ROL_ID, UR_FECHAINICIO, UR_FECHA_FIN) values (${nuevouseRol.atr_identificacion}, ${nuevouseRol.atr_id}, '${nuevouseRol.atr_fecha_inicio}','${nuevouseRol.atr_fecha_fin}')`;
      conexion.query(query, nuevouseRol,(error) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Use-Rol agregado');
      });
  });

  //actualizar rol
  router.put('/editar/:id_us/:id_rol', (req,res) => {
      const {id_us, id_rol} = req.params;
      const useRol = new usuRol( 
        req.body.usr_identificaodor,
        req.body.rol_id,
        req.body.ur_fechaInicio,
        req.body.ur_fechaFin
    );
      const query = `update USEROL set USR_IDENTIFICACION=${useRol.atr_identificacion},
      ROL_ID=${useRol.atr_id}, UR_FECHAINICIO='${useRol.atr_fecha_inicio}', UR_FECHAFIN='${useRol.atr_fecha_fin}'
      where ROL_ID=${id_rol} and USR_IDENTICICACION = ${id_us}`;
      conexion.query(query, [usuRol,id_us,id_rol],(error) =>{
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Use-Rol Updated');
      });
  });

  //Eliminar rol
  router.delete('/eliminar/:id_us/:id_rol', (req,res) => {
      const {id_us, id_rol} = req.params;
      const query = `DELETE FROM USEROL WHERE ROL_ID = ${id_rol} AND USR_IDENTIFICACION=  ${id_us}`;
      conexion.query (query, [id_us,id_rol], (error) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Use-Rol removed');
      });
  });

  //obtener todas los roles 
  router.get('', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req,res) => {

      const userRole = req.user ? req.user.rol : null;
      console.log(`Usuario logeado con rol: ${userRole}`);
      
      const query = 'SELECT * FROM USEROL';
      conexion.query(query, (error,result) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error :'Internal Server error'});
          }
          const userol = result.map(usuRol.fromDBRow);
          console.log('Imprimir use-roles', userol);
          res.json(userol);
      });
  });
  return router;
}