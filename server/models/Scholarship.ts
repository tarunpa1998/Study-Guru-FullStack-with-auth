import mongoose, { Document, Schema } from 'mongoose';

// Interface for Scholarship document
export interface IScholarship extends Document {
  title: string;
  slug: string;
  overview: string;
  description: string;
  highlights: string[];
  
  amount: string;
  deadline: string;
  duration: string;
  level: string;
  fieldsCovered: string[];
  eligibility: string | string[];
  isRenewable: boolean;
  
  benefits: string[];
  applicationProcedure: string | string[];
  country: string;
  tags: string[];
  link?: string;
}

// Define Scholarship schema
const ScholarshipSchema = new Schema<IScholarship>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    overview: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    highlights: {
      type: [String],
      default: []
    },
    
    amount: {
      type: String,
      required: true
    },
    deadline: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      default: '1 year'
    },
    level: {
      type: String,
      default: 'Undergraduate, Graduate'
    },
    fieldsCovered: {
      type: [String],
      default: []
    },
    eligibility: {
      type: Schema.Types.Mixed,
      default: ''
    },
    isRenewable: {
      type: Boolean,
      default: false
    },
    
    benefits: {
      type: [String],
      default: []
    },
    applicationProcedure: {
      type: Schema.Types.Mixed,
      default: ''
    },
    country: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    link: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search functionality
ScholarshipSchema.index({ 
  title: 'text', 
  description: 'text', 
  overview: 'text',
  country: 'text'
});

// Export Scholarship model
export default mongoose.models.Scholarship || mongoose.model<IScholarship>('Scholarship', ScholarshipSchema);