const pool = require('../ruta/al/pool');
class Usuario {
  static findByEmail(email) {
    const query = `
      SELECT
        U.USR_IDENTIFICACION,
        U.USU_CORREO,
        U.USU_CONTRASENIA,
        R.ROL_DESCRIPCION,
        R.ROL_TIPO
      FROM
        usuario U
      LEFT JOIN
        userol UR ON U.USR_IDENTIFICACION = UR.USR_IDENTIFICACION
      JOIN
        rol R ON UR.ROL_ID = R.ROL_ID
      WHERE
        U.USU_CORREO = ?
      LIMIT 1
    `;

    return new Promise((resolve, reject) => {
      pool.query(query, [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0] || null);
        }
      });
    });
  }
}

module.exports = Usuario;
