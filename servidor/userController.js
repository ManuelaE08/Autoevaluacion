const express = require('express');
const tblUsuario = require('./models/tblUsuario');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

const bcrypt = require('bcrypt');
const saltRounds = 10; // puedes ajustar este número según tus necesidades




module.exports = (conexion) => {  

    async function obtenerHash(password) {
        try {
            const hash = await generarHash(password);
            return hash;
        } catch (err) {
            console.error('Error al generar el hash:', err);
        }
    }
    

  //obtener USUARIO por id 
  router.get('/:id',(req,res) => {
    const {id} = req.params;
    const query = `SELECT * FROM USUARIO WHERE USR_IDENTIFICACION = ${id};`;
    conexion.query(query, [id], (error,result) => {
        if(error) return console.error(error.message);
        if(result.length > 0){
            res.json(result.map(tblUsuario.fromDBRow));
            console.log('Usuario encontrado?');
        }else{
            res.json({message: 'Usuario not found'});
        }
    });
});

  //crear usuario 
  router.post('/agregar',authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {
      const nuevoUsuario = new tblUsuario( 
          req.body.id,
          req.body.nombre,
          req.body.apellido,
          req.body.genero,
          req.body.estudio,
          req.body.correo,
          req.body.contrasenia
      );
      
      const userRole = req.user ? req.user.rol : null;
      console.log(`Usuario logeado con rol: ${userRole}`);

      const passwordHash = obtenerHash(nuevoUsuario.atr_contrasenia).then(hash => {
        console.log('Hash generado:', hash);
    }).catch(err => {
        console.error('Error al generar el hash:', err);
    });

      console.log(nuevoUsuario);
      const query = `insert into usuario (USR_IDENTIFICACION, USU_NOMBRE, USU_APELLIDO, USU_GENERO, USU_ESTUDIO, USU_CORREO, USU_CONTRASENIA) values (${nuevoUsuario.atr_Identificacion}, '${nuevoUsuario.atr_nombre}', '${nuevoUsuario.atr_apellido}', '${nuevoUsuario.atr_genero}', '${nuevoUsuario.atr_estudio}', '${nuevoUsuario.atr_correo}', '${this.passwordHash}' )`;
      conexion.query(query, nuevoUsuario,(error) => {
          
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Usuario agregado');
      });
  });

  //actualizar usuario
  router.put('/editar/:id', (req,res) => {
      const {id} = req.params;
      const usuario = new tblUsuario(
        req.body.id,
        req.body.nombre,
        req.body.apellido,
        req.body.genero,
        req.body.estudio,
        req.body.correo,
        req.body.contrasenia
      );
      const query = `update usuario set usr_identificacion=${usuario.atr_Identificacion},
      usu_nombre=${usuario.atr_nombre}, usu_apellido='${usuario.atr_apellido}', 
      usu_genero=${usuario.atr_genero}', usu_estudio=${usuario.atr_estudio}', 
      usu_correo=${usuario.atr_correo}', usu_contrasenia=${usuario.atr_contrasenia}
      where usr_identificacion=${id}`;
      conexion.query(query, [tblUsuario,id],(error) =>{
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Usuario Updated');
      });
  });

  //Eliminar usuario
  router.delete('/eliminar/:id', (req,res) => {
      const {id} = req.params;
      const query = `DELETE FROM usuario WHERE usr_identificacion = ?`;
      conexion.query (query, [id], (error) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error: 'Internal Server Error'});
          }
          res.json('Usuario removed');
      });
  });

  //obtener todas los usuarios 
  router.get('', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req,res) => {

      const userRole = req.user ? req.user.rol : null;
      console.log(`Usuario logeado con rol: ${userRole}`);
      
      const query = 'SELECT * FROM usuario';
      conexion.query(query, (error,result) => {
          if(error){
              console.error(error.message);
              return res.status(500).json({error :'Internal Server error'});
          }
          const usuario = result.map(tblUsuario.fromDBRow);
          console.log('Imprimir Usuarios', usuario);
          res.json(usuario);
      });
  });
  return router;
}