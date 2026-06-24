// ===================================================================
// AI DOMINATOR - Core Type Definitions
// Enterprise-Grade Type System for Creator Genome Intelligence
// ===================================================================

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  followerCount: number;
  niche: string;
  country: string;
  language: string;
  createdAt: Date;
}

// Video & Metrics Types
export interface Video {
  id: string;
  creatorId: string;
  platformVideoId: string;
  publishTime: Date;
  createdAt: Date;
  script?: string;
  concept?: string;
}

export interface RetentionData {
  timestamp: number;
  percentage: number;
}

export enum MetricStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED'
}

export interface VideoMetrics {
  id: string;
  videoId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  watchTimeSeconds: number;
  completionRatePercentage: number;
  retentionData: RetentionData[];
  status: MetricStatus;
  createdAt: Date;
  processedAt?: Date;
}

// Creator DNA Types
export interface DNATrait {
  id: string;
  creatorId: string;
  traitName: string;
  traitValue: number;
  confidenceScore: number;
  sampleSize: number;
  category: DNACategory;
  impact: 'positive' | 'negative' | 'neutral';
  updatedAt: Date;
}

export enum DNACategory {
  CONTENT = 'CONTENT',
  HOOK = 'HOOK',
  DELIVERY = 'DELIVERY',
  VISUAL = 'VISUAL',
  TIMING = 'TIMING',
  AUDIENCE = 'AUDIENCE'
}

export interface CreatorDNA {
  creatorId: string;
  traits: DNATrait[];
  successDrivers: DNATrait[];
  failureDrivers: DNATrait[];
  overallScore: number;
  confidenceLevel: number;
  lastUpdated: Date;
  sampleSize: number;
}

// Prediction & Mission Types
export interface PredictionInput {
  creatorId: string;
  script: string;
  concept?: string;
  targetDuration?: number;
  plannedPublishTime?: Date;
}

export interface PredictionResult {
  successProbabilityPercentage: number;
  riskFactors: RiskFactor[];
  structuralActionableRecommendation: string;
  predictedMetrics: {
    estimatedViews: { min: number; max: number };
    estimatedCompletionRate: { min: number; max: number };
  };
  confidenceScore: number;
}

export interface RiskFactor {
  category: DNACategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion: string;
}

export interface DailyMission {
  id: string;
  creatorId: string;
  date: Date;
  objective: string;
  specificInstructions: {
    contentType: string;
    hookType: string;
    targetDuration: string;
    publishTime: string;
    visualRequirements?: string[];
    deliveryTips?: string[];
  };
  targetImprovement: string;
  weaknessBeingTested: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  createdAt: Date;
}

// Screenshot Processing Types
export interface ScreenshotUpload {
  id: string;
  creatorId: string;
  videoId: string;
  imageData: string; // Base64 or URL
  status: 'queued' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  extractedMetrics?: Partial<VideoMetrics>;
  errorMessage?: string;
  uploadedAt: Date;
  processedAt?: Date;
}

export interface ScreenshotExtractionResult {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  watchTimeSeconds: number;
  completionRatePercentage: number;
  confidence: number;
}

// Global Genome Types
export interface NicheGenome {
  niche: string;
  country: string;
  sampleSize: number;
  avgSuccessTraits: DNATrait[];
  commonPatterns: string[];
  topPerformingCharacteristics: {
    hookTypes: { type: string; successRate: number }[];
    contentFormats: { format: string; avgViews: number }[];
    optimalTiming: { hour: number; dayOfWeek: number; performance: number }[];
  };
  lastUpdated: Date;
}

export interface GlobalGenome {
  totalCreators: number;
  totalVideosAnalyzed: number;
  platformTrends: {
    trend: string;
    growthRate: number;
    affectedNiches: string[];
  }[];
  algorithmChanges: {
    detectedAt: Date;
    impact: string;
    affectedMetrics: string[];
  }[];
  lastUpdated: Date;
}

// Analytics & Dashboard Types
export interface GrowthMetrics {
  creatorId: string;
  period: 'day' | 'week' | 'month';
  viewsGrowth: number;
  followersGrowth: number;
  engagementRate: number;
  avgCompletionRate: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface PerformanceBaseline {
  creatorId: string;
  avgViews: number;
  avgCompletionRate: number;
  avgEngagementRate: number;
  stdDeviation: number;
  calculatedFrom: number; // number of videos
  lastCalculated: Date;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
  };
}

// Onboarding Types
export interface OnboardingData {
  email: string;
  niche: string;
  country: string;
  language: string;
  followerCount: number;
  contentFrequency: 'daily' | 'weekly' | 'occasional';
  primaryGoal: 'growth' | 'monetization' | 'branding' | 'education';
}

// UI State Types
export interface AppState {
  currentScreen: 'onboarding' | 'upload' | 'dna-dashboard' | 'daily-mission';
  user: User | null;
  creatorProfile: CreatorProfile | null;
  creatorDNA: CreatorDNA | null;
  dailyMission: DailyMission | null;
  isLoading: boolean;
  error: string | null;
}
