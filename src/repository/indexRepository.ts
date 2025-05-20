export class IndexRepository {
    public getRepository = async (): Promise<any> => {    //CONECTAR A LA BDD
        return await "Hello World!";
    }
}