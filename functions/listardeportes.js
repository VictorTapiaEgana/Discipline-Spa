import fs from 'fs'

function listardeportes(){

    try {

        const data = JSON.parse(fs.readFileSync("tmp/deportes.json", "utf8"));
        return data;

    } catch (error) {
        
        console.log('Error al leer el archivo')

    }

};

export default listardeportes;