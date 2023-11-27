class Rol{
    constructor(atr_id, atr_descripcion, atr_tipo){
        this.atr_id = atr_id;
        this.atr_descripcion = atr_descripcion;
        this.atr_tipo = atr_tipo;
    }

  // Método para obtener un objeto Usuario desde una fila de la base de datos
    static fromDBRow(row) {
        const user = new Rol(
        row.ROL_ID,
        row.ROL_DESCRIPCION,
        row.ROL_TIPO,);
        return user;
    }
}

module.exports = Rol;