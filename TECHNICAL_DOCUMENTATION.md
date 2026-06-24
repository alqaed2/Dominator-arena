# 📘 AI DOMINATOR - Technical Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Data Flow](#data-flow)
3. [Service Layer Documentation](#service-layer-documentation)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Type System](#type-system)
7. [Performance Optimization](#performance-optimization)
8. [Scalability Strategy](#scalability-strategy)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Onboarding   │  │ DNA          │  │ Daily        │     │
│  │ Screen       │  │ Dashboard    │  │ Mission      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↕ ↕ ↕
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Vision AI    │  │ DNA Engine   │  │ Prediction   │     │
│  │ Service      │  │              │  │ Engine       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↕ ↕ ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ LocalStorage │  │ IndexedDB    │  │ Session      │     │
│  │ (Persistence)│  │ (Future)     │  │ Storage      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

1. **Singleton Pattern**: Used in all service classes
   ```typescript
   export class ServiceName {
     private static instance: ServiceName;
     private constructor() {}
     public static getInstance(): ServiceName {
       if (!ServiceName.instance) {
         ServiceName.instance = new ServiceName();
       }
       return ServiceName.instance;
     }
   }
   ```

2. **Factory Pattern**: Used in DNA trait generation
3. **Observer Pattern**: Future implementation for real-time updates
4. **Strategy Pattern**: Used in prediction algorithms

---

## Data Flow

### Upload Flow (Screenshot → Metrics → DNA)

```
User Action: Upload Screenshot
         ↓
┌────────────────────────────────┐
│ UploadScreen Component         │
│ - handleFileSelect()           │
│ - processImage()               │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ VisionAI Service               │
│ - extractMetricsFromScreenshot()│
│ - normalizeMetricValue()       │
│ - validateExtraction()         │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ DataStore Service              │
│ - createVideo()                │
│ - saveMetrics()                │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ DNA Engine                     │
│ - computeCreatorDNA()          │
│ - calculateBaseline()          │
│ - extractAllTraits()           │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ App State Update               │
│ - setCreatorDNA()              │
│ - Navigate to Dashboard        │
└────────────────────────────────┘
```

### Prediction Flow (Script → Analysis → Recommendation)

```
User Action: Enter Script
         ↓
┌────────────────────────────────┐
│ DailyMissionScreen             │
│ - handleAnalyze()              │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ PredictionEngine               │
│ - predictContentSuccess()      │
│ - analyzeScript()              │
│ - generatePrediction()         │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ Creator DNA + Niche Genome     │
│ (Data Fusion)                  │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ Result Display                 │
│ - Success Probability          │
│ - Risk Factors                 │
│ - Recommendations              │
└────────────────────────────────┘
```

---

## Service Layer Documentation

### 1. VisionAI Service

**File**: `src/services/visionAI.ts`

**Purpose**: Simulate OpenAI Vision API for extracting TikTok analytics from screenshots

**Key Methods**:

```typescript
class VisionAIService {
  // Main extraction method
  async extractMetricsFromScreenshot(imageData: string): Promise<ScreenshotExtractionResult>
  
  // Normalize values (K, M notation → numbers)
  normalizeMetricValue(value: string | number): number
  
  // Validate extraction quality
  validateExtraction(result: ScreenshotExtractionResult): {
    isValid: boolean;
    confidence: number;
    issues: string[];
  }
}
```

**Algorithm**:
```typescript
// Realistic TikTok metrics simulation using power law distribution
generateRealisticViews() {
  random = Math.random()
  if (random < 0.6)  return 100-5,000      // 60% low performers
  if (random < 0.85) return 5,000-50,000   // 25% medium
  if (random < 0.95) return 50,000-200,000 // 10% good
  else               return 200,000-1M     // 5% viral
}
```

**Future Production Integration**:
```typescript
// Replace simulation with actual API call:
const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [{
    role: "user",
    content: [
      { type: "text", text: EXTRACTION_PROMPT },
      { type: "image_url", image_url: { url: imageData } }
    ]
  }],
  response_format: { type: "json_object" }
});
```

### 2. DNA Engine

**File**: `src/services/dnaEngine.ts`

**Purpose**: Core analytics engine for extracting creator-specific success patterns

**Key Methods**:

```typescript
class DNAEngine {
  // Main computation function
  async computeCreatorDNA(
    creatorId: string,
    videoMetrics: VideoMetrics[]
  ): Promise<CreatorDNA>
  
  // Statistical baseline calculation
  private calculateBaseline(metrics: VideoMetrics[]): PerformanceBaseline
  
  // Extract traits across 6 categories
  private extractAllTraits(...): DNATrait[]
  
  // Category-specific analyzers
  private analyzeContentDNA(...): DNATrait[]
  private analyzeHookDNA(...): DNATrait[]
  private analyzeDeliveryDNA(...): DNATrait[]
  private analyzeVisualDNA(...): DNATrait[]
  private analyzeTimingDNA(...): DNATrait[]
  private analyzeAudienceDNA(...): DNATrait[]
}
```

**Statistical Formulas**:

```typescript
// Mean Calculation
mean = Σ(values) / n

// Standard Deviation
variance = Σ((value - mean)²) / n
stdDev = √variance

// Confidence Score
confidenceScore = min(100, sampleSize × 10)

// Overall DNA Score
successWeight = Σ(successDrivers.confidence × value)
failureWeight = Σ(failureDrivers.confidence × |value|)
overallScore = (successWeight / (successWeight + failureWeight)) × 100
```

**Minimum Sample Size Rule**:
```typescript
const MINIMUM_SAMPLE_SIZE = 10;

if (videoMetrics.length < MINIMUM_SAMPLE_SIZE) {
  return generateHypothesisState(); // Low confidence
}
```

### 3. Prediction Engine

**File**: `src/services/predictionEngine.ts`

**Purpose**: AI-powered content success prediction and mission generation

**Key Methods**:

```typescript
class PredictionEngine {
  // Predict content success before publishing
  async predictContentSuccess(
    input: PredictionInput,
    creatorDNA: CreatorDNA,
    nicheGenome?: NicheGenome
  ): Promise<PredictionResult>
  
  // Generate daily mission based on weaknesses
  async generateDailyMission(
    creatorId: string,
    creatorDNA: CreatorDNA
  ): Promise<DailyMission>
}
```

**Prediction Algorithm**:

```typescript
baseSuccessProbability = 50

// Align with success drivers
for each successDriver:
  if scriptAlignsWith(script, driver):
    baseSuccessProbability += driver.confidence × 0.15

// Penalize for failure drivers
for each failureDriver:
  if scriptAlignsWith(script, driver):
    baseSuccessProbability -= driver.confidence × 0.20

// Apply niche genome bonus
if nicheGenome:
  baseSuccessProbability += calculateNicheAlignment()

// Normalize to 5-95 range
finalProbability = clamp(baseSuccessProbability, 5, 95)
```

**Mission Generation Strategy**:

```typescript
// Identify primary weakness
primaryWeakness = failureDrivers[0]

// Create targeted mission
mission = {
  objective: "Improve {weaknessCategory}",
  instructions: getInstructionsFor(weaknessCategory),
  targetImprovement: "Address {specificWeakness}",
  status: "pending"
}
```

### 4. Data Store

**File**: `src/services/dataStore.ts`

**Purpose**: Client-side data management and persistence

**Storage Strategy**:

```typescript
// Current: LocalStorage
localStorage.setItem(key, JSON.stringify(data))

// Future: IndexedDB
const db = await openDB('ai_dominator', 1, {
  upgrade(db) {
    db.createObjectStore('users', { keyPath: 'id' });
    db.createObjectStore('videos', { keyPath: 'id' });
    db.createObjectStore('metrics', { keyPath: 'id' });
  }
});

// Production: PostgreSQL + Prisma
const user = await prisma.user.create({
  data: { email, passwordHash }
});
```

**Key Operations**:

```typescript
class DataStore {
  // User Management
  async createUser(email: string): Promise<User>
  async getUserByEmail(email: string): Promise<User | null>
  
  // Profile Management
  async createProfile(userId: string, data: OnboardingData): Promise<CreatorProfile>
  async getProfileByUserId(userId: string): Promise<CreatorProfile | null>
  
  // Video & Metrics
  async createVideo(...): Promise<Video>
  async saveMetrics(...): Promise<VideoMetrics>
  async getMetricsByCreatorId(...): Promise<VideoMetrics[]>
  
  // DNA & Missions
  async saveDNA(dna: CreatorDNA): Promise<CreatorDNA>
  async getDNAByCreatorId(...): Promise<CreatorDNA | null>
  async saveMission(mission: DailyMission): Promise<DailyMission>
}
```

---

## Component Architecture

### Component Hierarchy

```
App (Root State Manager)
├── OnboardingScreen
│   ├── Step1: Basic Info
│   ├── Step2: Channel Stats
│   └── Step3: Confirmation
│
├── UploadScreen
│   ├── DragDropArea
│   ├── ProcessingIndicator
│   └── MetricsReview
│
├── DNADashboard
│   ├── StatsBar
│   ├── HypothesisWarning (conditional)
│   ├── SuccessDriversCard
│   └── FailureDriversCard
│
└── DailyMissionScreen
    ├── MissionCard
    ├── ContentSimulator
    └── PredictionResults
```

### Component Props Interface

```typescript
// OnboardingScreen
interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => void;
}

// UploadScreen
interface UploadScreenProps {
  creatorId: string;
  onMetricsUploaded: () => void;
  onNavigate: (screen: string) => void;
}

// DNADashboard
interface DNADashboardProps {
  creatorDNA: CreatorDNA | null;
  onNavigate: (screen: string) => void;
  totalVideos: number;
}

// DailyMissionScreen
interface DailyMissionScreenProps {
  mission: DailyMission | null;
  creatorId: string;
  creatorDNA: CreatorDNA;
  onNavigate: (screen: string) => void;
}
```

---

## State Management

### App State Structure

```typescript
interface AppState {
  currentScreen: 'onboarding' | 'upload' | 'dna-dashboard' | 'daily-mission';
  user: User | null;
  creatorProfile: CreatorProfile | null;
  creatorDNA: CreatorDNA | null;
  dailyMission: DailyMission | null;
  isLoading: boolean;
  error: string | null;
}
```

### State Flow

```typescript
// Initial Load
useEffect(() => {
  initializeApp()
}, [])

// State Updates
setState(prev => ({
  ...prev,
  currentScreen: 'new-screen',
  isLoading: false
}))

// Derived State
const [totalVideos, setTotalVideos] = useState(0)

// Side Effects
useEffect(() => {
  if (creatorProfile) {
    loadVideos(creatorProfile.id)
  }
}, [creatorProfile])
```

---

## Type System

### Core Types Hierarchy

```
User (Base Entity)
  ├── id: string
  ├── email: string
  └── createdAt: Date

CreatorProfile (User Extension)
  ├── id: string
  ├── userId: string (FK)
  ├── niche: string
  ├── country: string
  └── ...

Video (Content Entity)
  ├── id: string
  ├── creatorId: string (FK)
  └── ...

VideoMetrics (Performance Data)
  ├── id: string
  ├── videoId: string (FK)
  ├── views: number
  ├── completionRate: number
  └── ...

CreatorDNA (Analytical Entity)
  ├── creatorId: string (FK)
  ├── traits: DNATrait[]
  ├── successDrivers: DNATrait[]
  └── failureDrivers: DNATrait[]
```

### Type Safety Rules

```typescript
// ✅ Use strict enums
enum DNACategory {
  CONTENT = 'CONTENT',
  HOOK = 'HOOK',
  // ...
}

// ✅ Use discriminated unions
type MetricStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED'

// ✅ Use generic types
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorObject;
}

// ✅ Use readonly where appropriate
interface PerformanceBaseline {
  readonly calculatedFrom: number;
  readonly lastCalculated: Date;
}
```

---

## Performance Optimization

### Current Optimizations

1. **Code Splitting**: React lazy loading (future)
2. **Memoization**: React.memo for heavy components (future)
3. **Virtual Scrolling**: For large lists (future)
4. **Image Optimization**: FileReader API with size limits

### Bundle Analysis

```bash
npm run build

# Output:
dist/index.html  295.11 kB
gzip:            82.51 kB
```

### Optimization Strategies

```typescript
// 1. Lazy Loading
const DNADashboard = lazy(() => import('./components/DNADashboard'))

// 2. Memoization
const MemoizedComponent = React.memo(({ data }) => {
  // Expensive render
}, (prev, next) => prev.data.id === next.data.id)

// 3. useCallback for handlers
const handleUpload = useCallback(async (file) => {
  // Process file
}, [dependency])

// 4. Debouncing
const debouncedSearch = useMemo(
  () => debounce((value) => search(value), 300),
  []
)
```

---

## Scalability Strategy

### Horizontal Scaling Plan

```
┌─────────────────────────────────────────────────────────┐
│                    LOAD BALANCER                         │
│                  (nginx / AWS ALB)                       │
└─────────────────────────────────────────────────────────┘
           ↓              ↓              ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Web Server 1 │ │ Web Server 2 │ │ Web Server N │
│  (Node.js)   │ │  (Node.js)   │ │  (Node.js)   │
└──────────────┘ └──────────────┘ └──────────────┘
           ↓              ↓              ↓
┌─────────────────────────────────────────────────────────┐
│                    REDIS CLUSTER                         │
│              (Session + Cache + Queue)                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL PRIMARY/REPLICA                  │
│                  (Write / Read Split)                    │
└─────────────────────────────────────────────────────────┘
```

### Microservices Architecture (Future)

```
├── api-gateway (Express.js)
├── auth-service (OAuth 2.0)
├── vision-service (Python + TensorFlow)
├── dna-engine-service (Python + NumPy)
├── prediction-service (Python + LLM APIs)
└── notification-service (WebSockets)
```

### Database Scaling

```sql
-- Partitioning Strategy
CREATE TABLE video_metrics (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL,
  ...
) PARTITION BY RANGE (created_at);

-- Indexes for Performance
CREATE INDEX idx_creator_videos ON videos(creator_id, created_at DESC);
CREATE INDEX idx_dna_traits ON creator_dna(creator_id, trait_name);
CREATE INDEX idx_niche_country ON creator_profile(niche, country);
```

### Caching Strategy

```typescript
// Redis Cache Layers
const CACHE_TTL = {
  DNA_PROFILE: 3600,        // 1 hour
  NICHE_GENOME: 86400,      // 24 hours
  GLOBAL_GENOME: 604800,    // 7 days
  PREDICTION_RESULT: 300    // 5 minutes
}

// Cache-Aside Pattern
async function getCreatorDNA(creatorId: string) {
  // Try cache first
  const cached = await redis.get(`dna:${creatorId}`);
  if (cached) return JSON.parse(cached);
  
  // Cache miss - compute and store
  const dna = await dnaEngine.compute(creatorId);
  await redis.setex(`dna:${creatorId}`, CACHE_TTL.DNA_PROFILE, JSON.stringify(dna));
  
  return dna;
}
```

---

## Deployment Checklist

### Pre-Production

- [ ] Environment variables configuration
- [ ] Database migrations tested
- [ ] API rate limiting configured
- [ ] Error tracking (Sentry) integrated
- [ ] Analytics (Google Analytics / Mixpanel) added
- [ ] CDN configured for static assets
- [ ] SSL/TLS certificates installed
- [ ] Backup strategy implemented

### Production Monitoring

```typescript
// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: await checkDatabaseConnection()
  });
});

// Metrics to Track
- Request latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Database connection pool status
- Redis cache hit ratio
- Vision AI processing time
- DNA computation duration
```

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: AI DOMINATOR Engineering Team
