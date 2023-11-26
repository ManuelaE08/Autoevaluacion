class tblUsuario{
    constructor(atr_identificacion, atr_nombre, atr_apellido, atr_genero, atr_estudio, atr_correo, atr_contrasenia){
        this.atr_Identificacion = atr_identificacion;
        this.atr_nombre = atr_nombre;
        this.atr_apellido = atr_apellido;
        this.atr_genero = atr_genero;
        this.atr_estudio = atr_estudio;
        this.atr_correo = atr_correo;
        this.atr_contrasenia = atr_contrasenia;
    }

  // Método para obtener un objeto Usuario desde una fila de la base de datos
    static fromDBRow(row) {
        const user = new tblUsuario(
        row.USR_IDENTIFICACION,
        row.USU_NOMBRE,
        row.USU_APELLIDO,
        row.USU_GENERO,
        row.USU_ESTUDIO,
        row.USU_CORREO,
        row.USU_CONTRASENIA);
        return user;
    }
}

module.exports = tblUsuario;