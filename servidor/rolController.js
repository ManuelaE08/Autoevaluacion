const express = require('express');
const Rol = require('./models/Rol');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

module.exports = (conexion) => {
    
  //obtener Rol por id 
  router.get('/id/:id',(req,res) => {
      const {id} = req.params;
      const query = `SELECT * FROM ROL WHERE ROL_ID = ${id}`;
      conexion.query(query,(error,result) => {
          if(error) return console.error(error.message);

          if(result.length > 0){
              res.json(result.map(tblUsuario.fromDBRow));
          }else{
              res.json({message: 'Rol not found'});
          }
      });
  });

  //crear Rol 
  router.post('/agregar',authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {
      const nuevoRol = new Rol( 
          req.body.id,
          req.body.descripcion,
          req.body.tipo,
      );
      
      const userRole = req.user ? req.user.rol : null;
      console.log(`Rol logeado con rol: ${userRole}`);

      console.log(nuevoRol);
      const query = `insert into ROL (ROL_ID, ROL_DESCRIPCION, ROL_TIPO) values (${nuevoRol.atr_id}, '${nuevoRol.atr_descripcion}', '${nuevoRol.atr_tipo}}' )`;
      conexion.query(query, nuevoRol,(error) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Rol agregado');
      });
  });

  //actualizar rol
  router.put('/editar/:id', (req,res) => {
      const {id} = req.params;
      const rol = new Rol(
        req.body.id,
        req.body.descripcion,
        req.body.tipo
      );
      const query = `update ROL set ROL_ID=${rol.atr_id},
      ROL_DESCRIPCION=${rol.atr_descripcion}, ROL_TIPO='${rol.atr_tipo}
      where ROL_ID=${id}`;
      conexion.query(query, [Rol,id],(error) =>{
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Rol Updated');
      });
  });

  //Eliminar rol
  router.delete('/eliminar/:id', (req,res) => {
      const {id} = req.params;
      const query = `DELETE FROM ROL WHERE ROL_ID = ${id}`;
      conexion.query (query, [id], (error) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Rol removed');
      });
  });

  //obtener todas los roles 
  router.get('', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req,res) => {

      const userRole = req.user ? req.user.rol : null;
      console.log(`Usuario logeado con rol: ${userRole}`);
      
      const query = 'SELECT * FROM ROL';
      conexion.query(query, (error,result) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error :'Internal Server error'});
          }
          const rol = result.map(Rol.fromDBRow);
          console.log('Imprimir roles', rol);
          res.json(rol);
      });
  });
  return router;
}