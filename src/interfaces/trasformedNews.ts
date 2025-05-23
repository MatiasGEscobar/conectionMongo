// Interfaz para la noticia transformada
export interface TransformedNews {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image?: string;
  category: string;
  // Campos enriquecidos
  ingestionDate: Date;
  source: string;
  keywords: string[];
  uniqueId: string;
}