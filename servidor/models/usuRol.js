class usuRol{
    constructor(atr_identificacion, atr_id, atr_fecha_inicio, atr_fecha_fin){
        this.atr_identificacion = atr_identificacion,
        this.atr_id = atr_id,
        this.atr_fecha_inicio = atr_fecha_inicio,
        this.atr_fecha_fin = atr_fecha_fin
    }
    
  // Método para obtener un objeto usuRol desde una fila de la base de datos
  static fromDBRow(row){
    const usu_rol = new usuRol(
        row.USR_IDENTIFICACION,
        row.ROL_ID,
        row.UR_FECHAINICIO,
        row.UR_FECHAFIN);
    return usu_rol;
  }
}


module.exports = usuRol;