import mongoose, { Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  subscribed: boolean;
  subscribedAt: Date;
}

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Create text index for potential search functionality
NewsletterSchema.index({ email: 'text' });

// Export Newsletter model
export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);