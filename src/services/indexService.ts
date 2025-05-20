import { IndexRepository } from "../repository/indexRepository";

const indexRepository = new IndexRepository();

export default class IndexService {
    public async getService (): Promise<void> {  /// TIENE QUE RETORNAR ALGO POR LO QUE SE GENERA UNA INTERFAZ (TALVEZ)
        return await indexRepository.getRepository();
    }
}