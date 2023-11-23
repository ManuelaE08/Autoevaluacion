const express = require('express');
const TipoLabor = require('./models/TipoLabor');

const router = express.Router();

module.exports = (conexion) => {

    //obtener todos los tipos de labor
    router.get('/', (req,res) => {
        
        const query = 'SELECT * FROM TipoLabor';
        conexion.query(query, (error, result) => {
            if(error){
                console.error(error.message);
                return res.status(500).json({ error :'Internal server Error'});
            }
            const tipoLabores = result.map(TipoLabor.fromDBRow);
            console.log('Imprimir Tipo labor', tipoLabores);
            res.json(tipoLabores);
        });
    });

    //obtener tipo de labor por id 
    router.get ('/tipolabor_id:id',(req,res) => {
        const {id} = req.params;
        const query = `SELECT * FROM TipoLabor WHERE TL_ID = ${id}`;
        conexion.query(query, (error, result) => {
            if (error) return console.error(error.message);

            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: 'Tipo Labor not found' });
            }
        });
    });

    return router;
}