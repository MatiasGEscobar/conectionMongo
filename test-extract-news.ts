// test-extract-news.ts
import axios from 'axios';
import * as xml2js from 'xml2js';
import * as crypto from 'crypto';

// Copiamos las interfaces y funciones que implementamos
interface TransformedNews {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image?: string;
  category: string;
  ingestionDate: Date;
  source: string;
  keywords: string[];
  uniqueId: string;
}

function extractKeywords(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  
  const stopWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'le', 'ya', 'o', 'fue', 'este', 'ha', 'si', 'porque', 'esta', 'son', 'entre', 'cuando', 'muy', 'sin', 'sobre', 'ser', 'tiene', 'también', 'me', 'hasta', 'hay', 'donde', 'han', 'quien', 'están', 'estado', 'desde', 'todo', 'nos', 'durante', 'estados', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'fueron', 'ese', 'eso', 'había', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'haber', 'estas', 'estaba', 'estamos', 'algunas', 'algo', 'nosotros'];
  
  const words = text.match(/[a-záéíóúñü]{3,}/g) || [];
  
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    if (!stopWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

function generateUniqueId(link: string, title: string): string {
  const content = `${link}-${title}`;
  return crypto.createHash('md5').update(content).digest('hex');
}

function extractNewsFromJson(jsonData: any, source: string): TransformedNews[] {
  const news: TransformedNews[] = [];
  
  if (!jsonData.rss || !jsonData.rss.channel || !jsonData.rss.channel.item) {
    console.warn(`No se encontraron items en el feed de ${source}`);
    return news;
  }
  
  const items = Array.isArray(jsonData.rss.channel.item) 
    ? jsonData.rss.channel.item 
    : [jsonData.rss.channel.item];
  
  items.forEach((item: any) => {
    try {
      let imageUrl = '';
      if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
        imageUrl = item['media:content']['$'].url;
      }
      
      let categories: string[] = [];
      if (item.category) {
        categories = Array.isArray(item.category) ? item.category : [item.category];
      }
      
      const transformedNews: TransformedNews = {
        title: item.title || '',
        link: item.link || '',
        description: item.description || item['dcterms:alternative'] || '',
        pubDate: item.pubDate || '',
        image: imageUrl,
        category: categories.join(', '),
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

// Función principal de prueba
async function testExtractNews() {
  try {
    const feedUrl = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/chile/portada';
    
    console.log('🔄 Obteniendo feed RSS...');
    const response = await axios.get(feedUrl);
    
    console.log('🔄 Transformando XML a JSON...');
    const parser = new xml2js.Parser({ explicitArray: false });
    const jsonData = await parser.parseStringPromise(response.data);
    
    console.log('🔄 Extrayendo noticias...');
    const extractedNews = extractNewsFromJson(jsonData, 'chile');
    
    console.log(`✅ Se extrajeron ${extractedNews.length} noticias`);
    console.log('\n' + '='.repeat(50));
    console.log('📰 MUESTRA DE NOTICIAS EXTRAÍDAS:');
    console.log('='.repeat(50));
    
    // Mostrar las primeras 3 noticias como ejemplo
    extractedNews.slice(0, 3).forEach((news, index) => {
      console.log(`\n📄 NOTICIA ${index + 1}:`);
      console.log(`Título: ${news.title}`);
      console.log(`Enlace: ${news.link}`);
      console.log(`Descripción: ${news.description.substring(0, 100)}...`);
      console.log(`Fecha: ${news.pubDate}`);
      console.log(`Imagen: ${news.image ? 'SÍ' : 'NO'}`);
      console.log(`Categorías: ${news.category}`);
      console.log(`Fuente: ${news.source}`);
      console.log(`Keywords: ${news.keywords.join(', ')}`);
      console.log(`ID único: ${news.uniqueId}`);
      console.log(`Fecha ingestión: ${news.ingestionDate.toISOString()}`);
    });
    
    console.log(`\n📊 RESUMEN:`);
    console.log(`- Total de noticias: ${extractedNews.length}`);
    console.log(`- Noticias con imagen: ${extractedNews.filter(n => n.image).length}`);
    console.log(`- Promedio de keywords por noticia: ${(extractedNews.reduce((acc, n) => acc + n.keywords.length, 0) / extractedNews.length).toFixed(1)}`);
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testExtractNews();