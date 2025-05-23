import { Document } from 'mongoose'

export interface INews extends Document {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  image?: string;
  category: string;
  ingestionDate: Date;
  source: string;
  keywords: string[];
  uniqueId: string;
  // Campos adicionales que podrían ser útiles
  createdAt: Date;
  updatedAt: Date;
}