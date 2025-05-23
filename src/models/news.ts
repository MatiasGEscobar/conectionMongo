// src/models/News.ts
import mongoose, { Schema } from 'mongoose';
import { INews } from '../interfaces/INews';


const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    unique: true, // Evitar duplicados por URL
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  pubDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  ingestionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  source: {
    type: String,
    required: true,
    enum: ['chile', 'argentina', 'mexico', 'tecnologia'], // Restricción a fuentes válidas
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  uniqueId: {
    type: String,
    required: true,
    unique: true, // Doble protección contra duplicados
    trim: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para optimizar consultas
NewsSchema.index({ source: 1 });
NewsSchema.index({ pubDate: -1 });
NewsSchema.index({ keywords: 1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ title: 'text', description: 'text' }); // Índice de texto para búsqueda

export default mongoose.model<INews>('News', NewsSchema);