class Labor{
    constructor (atrLabID, atrTlID, atrLabNombre, atrLabHoras){
        this.atrLabID = atrLabID;
        this.atrTlID = atrTlID;
        this.atrLabNombre = atrLabNombre;
        this.atrLabHoras = atrLabHoras;
    }

    static fromDBRow (row){
        const lab = new Labor(row.LAB_ID,
            row.TL_ID,
            row.LAB_NOMBRE,
            row.LAB_HORAS);
        return lab;
    }
}

module.exports = Labor;