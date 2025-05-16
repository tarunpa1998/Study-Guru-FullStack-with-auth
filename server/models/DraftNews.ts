import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { INews } from './News';

// Interface for Draft News document (extends the regular news)
export interface IDraftNews extends INews {
  // Additional fields specific to drafts can be added here
  originalNewsId?: mongoose.Types.ObjectId; // Reference to the published news (if it exists)
}

// Create Draft News Schema (similar to regular NewsSchema but for drafts)
const DraftNewsSchema = new Schema<IDraftNews>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    publishDate: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    category: {
      type: String,
      required: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      required: true,
    },
    relatedArticles: {
      type: [String],
      default: []
    },
    seo: {
      metaTitle: {
        type: String,
        default: ''
      },
      metaDescription: {
        type: String,
        default: ''
      },
      keywords: {
        type: [String],
        default: []
      }
    },
    views: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: String,
      default: '5 min read'
    },
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
    tableOfContents: {
      type: [{
        id: String,
        title: String,
        level: Number
      }],
      default: []
    },
    faqs: {
      type: [{
        question: String,
        answer: String
      }],
      default: []
    },
    originalNewsId: {
      type: Schema.Types.ObjectId,
      ref: 'News'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to generate slug from title
DraftNewsSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Create text index for search functionality
DraftNewsSchema.index({ 
  title: 'text', 
  content: 'text',
  summary: 'text',
  category: 'text'
});

// Export Draft News model
export default mongoose.models.DraftNews || mongoose.model<IDraftNews>('DraftNews', DraftNewsSchema);