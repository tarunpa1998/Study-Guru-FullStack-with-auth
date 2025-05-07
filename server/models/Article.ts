import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IArticle extends Document {
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  image?: string;
  category: string;
  likes: mongoose.Types.ObjectId[];
  // Comments are stored in the ActiveUser model for better organization
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  readingTime?: string;
  relatedArticles?: string[] | mongoose.Types.ObjectId[];
  tableOfContents?: Array<{
    id: string;
    title: string;
    level: number;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  helpful?: {
    yes: number;
    no: number;
  };
  views?: number;
  isFeatured?: boolean;
}

// Create Article Schema
const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  publishDate: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorTitle: {
    type: String,
  },
  authorImage: {
    type: String,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'ActiveUser'
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  readingTime: {
    type: String,
    default: "1 min read"
  },
  relatedArticles: [{
    type: String,
    default: []
  }],
  tableOfContents: [{
    id: String,
    title: String,
    level: Number
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  helpful: {
    yes: {
      type: Number,
      default: 0
    },
    no: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug from title
ArticleSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Create text index for search functionality
ArticleSchema.index({ 
  title: 'text', 
  content: 'text',
  summary: 'text',
  category: 'text'
});

// Create and export the model
export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);