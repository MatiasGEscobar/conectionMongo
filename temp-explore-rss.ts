import axios from 'axios';
import * as xml2js from 'xml2js';

async function exploreRSSStructure() {
  try {
    // Probemos con el feed de Chile primero
    const feedUrl = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/chile/portada';
    
    console.log('Obteniendo feed RSS...');
    const response = await axios.get(feedUrl);
    const xmlData = response.data;
    
    console.log('XML crudo (primeros 500 caracteres):');
    console.log(xmlData.substring(0, 500));
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Transformar a JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const jsonData = await parser.parseStringPromise(xmlData);
    
    console.log('Estructura JSON:');
    console.log(JSON.stringify(jsonData, null, 2));
    
    // Explorar la estructura de un item específico
    if (jsonData.rss && jsonData.rss.channel && jsonData.rss.channel.item) {
      console.log('\n' + '='.repeat(50));
      console.log('Estructura de un item individual:');
      const firstItem = Array.isArray(jsonData.rss.channel.item) 
        ? jsonData.rss.channel.item[0] 
        : jsonData.rss.channel.item;
      console.log(JSON.stringify(firstItem, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

exploreRSSStructure();