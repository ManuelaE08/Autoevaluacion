const express = require ('express');
const Labor = require('./models/Labor');
const AuthMiddleware = require('./authMiddleware');

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultSecret';
const authMiddleware = new AuthMiddleware(secretKey);

module.exports = (conexion) => {
    
    //obtener labor por id 
    router.get('/id/:id',(req,res) => {
        const {id} = req.params;
        const query = `SELECT * FROM Labor WHERE LAB_ID = ${id}`;
        conexion.query(query,(error,result) => {
            if(error) return console.error(error.message);

            if(result.length > 0){
                res.json(result.map(Labor.fromDBRow));
            }else{
                res.json({message: 'Labor not found'});
            }
        });
    });

    //crear labor 
    router.post('/agregar',authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req, res) => {
        const nuevaLabor = new Labor( 
            req.body.id,
            req.body.idTipoLabor,
            req.body.nombre,
            req.body.horas
        );
        
        const userRole = req.user ? req.user.rol : null;
        console.log(`Usuario logeado con rol: ${userRole}`);

        console.log(nuevaLabor);
        const query = `insert into labor (tl_id, lab_nombre, lab_horas) values (${nuevaLabor.atrTlID}, '${nuevaLabor.atrLabNombre}', ${nuevaLabor.atrLabHoras})`;
        conexion.query(query, nuevaLabor,(error) => {
            
            if(error){
                console.error(error.message);
                return res.status(500).json({error: 'Internal Server Error'});
            }
            res.json('Labor agregada');
        });
    });

    //actualizar labor
    router.put('/editar/:id', (req,res) => {
        const {id} = req.params;
        const labor = new Labor(
            req.body.id,
            req.body.idTipoLabor,
            req.body.nombre,
            req.body.horas
        );
        const query = `update labor set lab_id=${labor.atrLabID},
        tl_id=${labor.atrTlID}, lab_nombre='${labor.atrLabNombre}', 
        lab_horas=${labor.atrLabHoras} where lab_id=${labor.atrLabID}`;
        conexion.query(query, [labor,id],(error) =>{
            if(error){
                console.error(error.message);
                return res.status(500).json({error: 'Internal Server Error'});
            }
            res.json('Labor Updated');
        });
    });

    //Eliminar Labor
    router.delete('/eliminar/:id', (req,res) => {
        const {id} = req.params;
        const query = 'DELETE FROM labor WHERE LAB_ID = ?';
        conexion.query (query, [id], (error) => {
            if(error){
                console.error(error.message);
                return res.status(500).json({error: 'Internal Server Error'});
            }
            res.json('Labor removed');
        });
    });

    //obtener todas las labores 
    router.get('', authMiddleware.verifyToken, authMiddleware.checkRole(['decano']), (req,res) => {

        const userRole = req.user ? req.user.rol : null;
        console.log(`Usuario logeado con rol: ${userRole}`);
        
        const query = 'SELECT * FROM Labor';
        conexion.query(query, (error,result) => {
            if(error){
                console.error(error.message);
                return res.status(500).json({error :'Internal Server error'});
            }
            const labores = result.map(Labor.fromDBRow);
            console.log('Imprimir labores', labores);
            res.json(labores);
        });
    });
    return router;
}