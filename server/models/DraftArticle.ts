import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { IArticle } from './Article';

// Interface for Draft Article document (extends the regular article)
export interface IDraftArticle extends IArticle {
  // Additional fields specific to drafts can be added here
  originalArticleId?: mongoose.Types.ObjectId; // Reference to the published article (if it exists)
}

// Create Draft Article Schema (similar to regular ArticleSchema but for drafts)
const DraftArticleSchema = new Schema<IDraftArticle>({
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
  },
  originalArticleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug from title
DraftArticleSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Create and export the model
export default mongoose.models.DraftArticle || mongoose.model<IDraftArticle>('DraftArticle', DraftArticleSchema);