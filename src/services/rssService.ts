// src/services/rssService.ts
import axios from 'axios';
import * as xml2js from 'xml2js';
import * as crypto from 'crypto';
import newsRepository from '../repository/NewsRepository';
import { TransformedNews } from '../interfaces/trasformedNews';

// Definimos las fuentes de RSS
const RSS_FEEDS = {
  argentina: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/argentina/portada',
  tecnologia: 'https://elpais.com/rss/tecnologia/portada.xml'
};


// Función para obtener el feed XML
async function fetchRssFeed(feedUrl: string): Promise<string> {
  try {
    const response = await axios.get(feedUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching RSS feed from ${feedUrl}:`, error);
    throw error;
  }
}

// Función para transformar XML a JSON
async function parseXmlToJson(xmlData: string): Promise<any> {
  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    return await parser.parseStringPromise(xmlData);
  } catch (error) {
    console.error('Error parsing XML to JSON:', error);
    throw error;
  }
}

// Función para extraer palabras clave (implementación básica)
function extractKeywords(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  
  // Palabras comunes que queremos filtrar
  const stopWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'le', 'ya', 'o', 'fue', 'este', 'ha', 'si', 'porque', 'esta', 'son', 'entre', 'cuando', 'muy', 'sin', 'sobre', 'ser', 'tiene', 'también', 'me', 'hasta', 'hay', 'donde', 'han', 'quien', 'están', 'estado', 'desde', 'todo', 'nos', 'durante', 'estados', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'fueron', 'ese', 'eso', 'había', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'haber', 'estas', 'estaba', 'estamos', 'algunas', 'algo', 'nosotros'];
  
  // Extraer palabras (solo letras, mínimo 3 caracteres)
  const words = text.match(/[a-záéíóúñü]{3,}/g) || [];
  
  // Filtrar stop words y contar frecuencia
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    if (!stopWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Obtener las 5 palabras más frecuentes
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

// Función para generar un ID único
function generateUniqueId(link: string, title: string): string {
  const crypto = require('crypto');
  const content = `${link}-${title}`;
  return crypto.createHash('md5').update(content).digest('hex');
}

// Función para extraer información relevante del JSON
function extractNewsFromJson(jsonData: any, source: string): TransformedNews[] {
  const news: TransformedNews[] = [];

  // Verificar que existe la estructura RSS esperada
  if (!jsonData.rss || !jsonData.rss.channel || !jsonData.rss.channel.item) {
    console.warn(`No se encontraron items en el feed de ${source}`);
    return news;
  }
  
  // Los items pueden ser un array o un objeto único
  const items = Array.isArray(jsonData.rss.channel.item) 
    ? jsonData.rss.channel.item 
    : [jsonData.rss.channel.item];
  
  items.forEach((item: any) => {
    try {
      // Extraer imagen si existe
      let imageUrl = '';
      if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
        imageUrl = item['media:content']['$'].url;
      }
      
      // Extraer categorías
      let categories: string[] = [];
      if (item.category) {
        categories = Array.isArray(item.category) ? item.category : [item.category];
      }
      
      // Crear la noticia transformada
      const transformedNews: TransformedNews = {
        title: item.title || '',
        link: item.link || '',
        description: item.description || item['dcterms:alternative'] || '',
        pubDate: item.pubDate || '',
        image: imageUrl,
        category: categories.join(', '), // Unir categorías con coma
        // Campos enriquecidos
        ingestionDate: new Date(),
        source: source,
        keywords: extractKeywords(item.title || '', item.description || ''),
        uniqueId: generateUniqueId(item.link || '', item.title || '')
      };
      
      news.push(transformedNews);
      
    } catch (error) {
      console.error(`Error procesando item del feed ${source}:`, error);
    }
  });
  
  return news;
}

// Función principal que procesa un feed completo
async function processRssFeed(feedKey: keyof typeof RSS_FEEDS): Promise<{ 
  source: string, 
  processed: number, 
  saved: number, 
  duplicates: number, 
  errors: number 
}> {
  try {
    console.log(`🔄 Procesando feed: ${feedKey}`);
    
    const transformedNews = await fetchAndTransformFeed(feedKey);
    console.log(`📄 ${transformedNews.length} noticias extraídas de ${feedKey}`);
    
    // Usar el repository para guardar
    const saveResult = await newsRepository.saveMany(transformedNews);
    console.log(`💾 Guardado para ${feedKey}: ${saveResult.saved} nuevas, ${saveResult.duplicates} duplicadas, ${saveResult.errors} errores`);
    
    return {
      source: feedKey,
      processed: transformedNews.length,
      saved: saveResult.saved,
      duplicates: saveResult.duplicates,
      errors: saveResult.errors
    };
    
  } catch (error) {
    console.error(`❌ Error procesando feed ${feedKey}:`, error);
    throw error;
  }
}

// Función principal que combina todo el proceso
async function fetchAndTransformFeed(feedKey: keyof typeof RSS_FEEDS): Promise<TransformedNews[]> {
  const feedUrl = RSS_FEEDS[feedKey];
  const xmlData = await fetchRssFeed(feedUrl);
  const jsonData = await parseXmlToJson(xmlData);
  return extractNewsFromJson(jsonData, feedKey);
}

export {
  fetchAndTransformFeed,
  RSS_FEEDS,
};