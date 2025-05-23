import { SaveResult } from "../interfaces/SaveResult";
import { TransformedNews } from '../interfaces/trasformedNews';
import News from '../models/news'
import { INews } from "../interfaces/INews";
import { PaginationOptions } from "../interfaces/PaginationOptions";
import { PaginatedResult } from "../interfaces/PaginatedResult";
import { NewsFilters } from "../interfaces/NewsFilters";

class NewsRepository {
  
  // Guardar múltiples noticias con manejo de duplicados
  async saveMany(newsArray: TransformedNews[]): Promise<SaveResult> {
    let saved = 0;
    let duplicates = 0;
    let errors = 0;

    for (const newsItem of newsArray) {
      try {
        const pubDate = new Date(newsItem.pubDate);
        
        const newsDoc = new News({
          title: newsItem.title,
          link: newsItem.link,
          description: newsItem.description,
          pubDate: pubDate,
          image: newsItem.image,
          category: newsItem.category,
          ingestionDate: newsItem.ingestionDate,
          source: newsItem.source,
          keywords: newsItem.keywords,
          uniqueId: newsItem.uniqueId
        });

        await newsDoc.save();
        saved++;
        
      } catch (error: any) {
        if (error.code === 11000) {
          duplicates++;
        } else {
          errors++;
          console.error(`Error guardando noticia "${newsItem.title}":`, error.message);
        }
      }
    }

    return { saved, duplicates, errors };
  }

  // Obtener todas las noticias con paginación
  async findAll(pagination: PaginationOptions): Promise<PaginatedResult<INews>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      News.find()
        .sort({ pubDate: -1 }) // Más recientes primero
        .skip(skip)
        .limit(limit)
        .exec(),
      News.countDocuments()
    ]);

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Buscar noticia por ID
  async findById(id: string): Promise<INews | null> {
    return await News.findById(id).exec();
  }

  // Buscar con filtros y paginación
  async findWithFilters(filters: NewsFilters, pagination: PaginationOptions): Promise<PaginatedResult<INews>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Construir el query
    const query: any = {};

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    if (filters.category) {
      query.category = { $regex: filters.category, $options: 'i' };
    }

    if (filters.source) {
      query.source = filters.source;
    }

    if (filters.from || filters.to) {
      query.pubDate = {};
      if (filters.from) query.pubDate.$gte = filters.from;
      if (filters.to) query.pubDate.$lte = filters.to;
    }

    const [results, total] = await Promise.all([
      News.find(query)
        .sort({ pubDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      News.countDocuments(query)
    ]);

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Eliminar noticia por ID
  async deleteById(id: string): Promise<boolean> {
    const result = await News.findByIdAndDelete(id);
    return result !== null;
  }

  // Estadísticas generales
  async getStats() {
    const [total, bySource] = await Promise.all([
      News.countDocuments(),
      News.aggregate([
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
            latest: { $max: '$pubDate' }
          }
        }
      ])
    ]);

    return {
      total,
      bySource
    };
  }
}

export default new NewsRepository();