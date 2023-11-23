class TipoLabor{
    constructor(atrTlId,atrTlCodigo,atrTlDescripcion){
        this.atrTlId = atrTlId;
        this.atrTlCodigo = atrTlCodigo;
        this.atrTlDescripcion = atrTlDescripcion;
    }

    static fromDBRow (row){
        return new TipoLabor(
            row.TL_ID,
            row.TL_CODIGO,
            row.TL_DESCRIPCION
            );
    }
}

module.exports = TipoLabor;