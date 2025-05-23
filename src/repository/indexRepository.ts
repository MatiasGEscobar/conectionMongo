export class IndexRepository {
    public getRepository = async (): Promise<any> => {    //CONECTAR A LA BDD
        return await "Hello World!"; // crear un schema en carpeta models y crear o importar los datos
    }
}