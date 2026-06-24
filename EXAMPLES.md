# 📚 AI DOMINATOR - Usage Examples & Demo Scenarios

## Table of Contents
1. [User Journey Examples](#user-journey-examples)
2. [API Usage Examples](#api-usage-examples)
3. [Data Structures Examples](#data-structures-examples)
4. [Common Workflows](#common-workflows)

---

## User Journey Examples

### Scenario 1: New Creator Onboarding

**User**: Ahmed, Tech Reviewer من السعودية

```typescript
// Step 1: Onboarding Data
const onboardingData = {
  email: "ahmed@example.com",
  niche: "تقنية ومراجعات",
  country: "السعودية",
  language: "ar",
  followerCount: 15000,
  contentFrequency: "weekly",
  primaryGoal: "growth"
}

// System Creates:
User {
  id: "user_1234567890_abc",
  email: "ahmed@example.com",
  createdAt: "2024-01-15T10:00:00Z"
}

CreatorProfile {
  id: "profile_1234567890_xyz",
  userId: "user_1234567890_abc",
  followerCount: 15000,
  niche: "تقنية ومراجعات",
  country: "السعودية",
  language: "ar"
}
```

### Scenario 2: First Video Upload

**Action**: Ahmed uploads screenshot of his first viral video

```typescript
// Screenshot Extraction Result
{
  views: 125000,
  likes: 8500,
  comments: 450,
  shares: 320,
  saves: 890,
  watchTimeSeconds: 28.5,
  completionRatePercentage: 68.2,
  confidence: 92
}

// System Creates Video Record
Video {
  id: "video_1234567890_def",
  creatorId: "profile_1234567890_xyz",
  platformVideoId: "tiktok_1234567890",
  publishTime: "2024-01-14T20:15:00Z"
}

// Linked Metrics
VideoMetrics {
  id: "metrics_1234567890_ghi",
  videoId: "video_1234567890_def",
  views: 125000,
  likes: 8500,
  comments: 450,
  shares: 320,
  saves: 890,
  watchTimeSeconds: 28.5,
  completionRatePercentage: 68.2,
  status: "PROCESSED"
}
```

### Scenario 3: DNA Profile After 10 Videos

**Status**: Ahmed has uploaded 10 videos, DNA analysis is ready

```typescript
CreatorDNA {
  creatorId: "profile_1234567890_xyz",
  overallScore: 72,
  confidenceLevel: 95,
  sampleSize: 10,
  
  successDrivers: [
    {
      id: "trait_001",
      traitName: "Hook Effectiveness (First 3s Retention)",
      traitValue: 92.5,
      confidenceScore: 100,
      category: "HOOK",
      impact: "positive",
      sampleSize: 10
    },
    {
      id: "trait_002",
      traitName: "Content Pacing & Retention",
      traitValue: 65.8,
      confidenceScore: 100,
      category: "DELIVERY",
      impact: "positive",
      sampleSize: 10
    },
    {
      id: "trait_003",
      traitName: "Visual Quality Score (Save Rate)",
      traitValue: 3.2,
      confidenceScore: 100,
      category: "VISUAL",
      impact: "positive",
      sampleSize: 10
    }
  ],
  
  failureDrivers: [
    {
      id: "trait_004",
      traitName: "Optimal Video Duration",
      traitValue: 45.2,
      confidenceScore: 100,
      category: "CONTENT",
      impact: "negative",
      sampleSize: 10
    },
    {
      id: "trait_005",
      traitName: "Publishing Consistency Impact",
      traitValue: 15000,
      confidenceScore: 100,
      category: "TIMING",
      impact: "negative",
      sampleSize: 10
    }
  ]
}
```

**Interpretation**:
- ✅ Ahmed excels at creating engaging hooks (92.5% first 3s retention)
- ✅ Good content pacing keeps viewers watching
- ✅ High visual quality leads to saves
- ❌ Videos are too long (45.2s avg, should be ~30s)
- ❌ Inconsistent publishing schedule hurts reach

### Scenario 4: Daily Mission Generation

**Generated Mission**: Target the main weakness (video duration)

```typescript
DailyMission {
  id: "mission_1234567890_jkl",
  creatorId: "profile_1234567890_xyz",
  date: "2024-01-20",
  objective: "Increase Completion Rate by 15%",
  
  specificInstructions: {
    contentType: "Fast-paced comparison or listicle",
    hookType: "Number-based promise (e.g., '3 secrets...')",
    targetDuration: "22-28 seconds",
    publishTime: "7:30 PM",
    
    visualRequirements: [
      "Face visible in frame 1",
      "Bold text overlay",
      "High contrast colors"
    ],
    
    deliveryTips: [
      "Speak 20% faster",
      "Cut pauses",
      "End with cliffhanger"
    ]
  },
  
  targetImprovement: "Address weakness in Optimal Video Duration while leveraging your strength: Hook Effectiveness",
  weaknessBeingTested: "Optimal Video Duration",
  status: "pending"
}
```

### Scenario 5: Pre-Publish Prediction

**Script**: Ahmed writes script for new video

```typescript
// Input Script
const script = `
في هذا الفيديو سأشرح 3 أخطاء شائعة يقع فيها صناع المحتوى 
المبتدئين عند شراء كاميرا جديدة. الخطأ الأول هو تجاهل العدسة 
والتركيز فقط على جسم الكاميرا...
`;

// Prediction Result
PredictionResult {
  successProbabilityPercentage: 78,
  confidenceScore: 95,
  
  predictedMetrics: {
    estimatedViews: {
      min: 85000,
      max: 180000
    },
    estimatedCompletionRate: {
      min: 61,
      max: 71
    }
  },
  
  riskFactors: [
    {
      category: "CONTENT",
      severity: "medium",
      description: "Optimal Video Duration shows negative pattern",
      suggestion: "Reduce video duration to 25-35 seconds and increase pacing"
    }
  ],
  
  structuralActionableRecommendation: `
⚠️ MINOR OPTIMIZATION NEEDED:

Your script aligns well with your success patterns (strong hook, good topic).
However, based on your DNA:

• Reduce total duration to ~28 seconds maximum
• Start with shocking statistic instead of introduction
• Use on-screen text to emphasize the "3 mistakes"
• Include visual examples for each mistake

Expected impact: +15% completion rate, +25% engagement
  `
}
```

---

## API Usage Examples

### Vision AI Service

```typescript
import { visionAI } from './services/visionAI';

// Example 1: Extract Metrics from Screenshot
async function processScreenshot(imageFile: File) {
  // Convert to base64
  const reader = new FileReader();
  const imageData = await new Promise<string>((resolve) => {
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(imageFile);
  });

  // Extract metrics
  const result = await visionAI.extractMetricsFromScreenshot(imageData);
  
  console.log(result);
  // {
  //   views: 125000,
  //   likes: 8500,
  //   comments: 450,
  //   shares: 320,
  //   saves: 890,
  //   watchTimeSeconds: 28.5,
  //   completionRatePercentage: 68.2,
  //   confidence: 92
  // }
}

// Example 2: Normalize Metric Values
const normalized = visionAI.normalizeMetricValue("125K");
console.log(normalized); // 125000

const percentage = visionAI.normalizeMetricValue("68.2%");
console.log(percentage); // 68.2

// Example 3: Validate Extraction
const validation = visionAI.validateExtraction(result);
console.log(validation);
// {
//   isValid: true,
//   confidence: 92,
//   issues: []
// }
```

### DNA Engine

```typescript
import { dnaEngine } from './services/dnaEngine';
import { dataStore } from './services/dataStore';

// Example 1: Compute DNA for Creator
async function analyzCreator(creatorId: string) {
  // Get all metrics
  const metrics = await dataStore.getMetricsByCreatorId(creatorId);
  
  // Compute DNA
  const dna = await dnaEngine.computeCreatorDNA(creatorId, metrics);
  
  console.log(`DNA Score: ${dna.overallScore}/100`);
  console.log(`Confidence: ${dna.confidenceLevel}%`);
  console.log(`Sample Size: ${dna.sampleSize}`);
  
  // Print success drivers
  console.log("\nSuccess Drivers:");
  dna.successDrivers.forEach(driver => {
    console.log(`  ${driver.traitName}: ${driver.confidenceScore}%`);
  });
  
  // Print failure drivers
  console.log("\nFailure Drivers:");
  dna.failureDrivers.forEach(driver => {
    console.log(`  ${driver.traitName}: ${driver.confidenceScore}%`);
  });
  
  return dna;
}

// Example 2: Check if Ready for Analysis
function isDNAReady(sampleSize: number): boolean {
  return sampleSize >= 10;
}

// Example 3: Get Confidence Level
function getConfidenceLevel(sampleSize: number): string {
  if (sampleSize < 10) return "Hypothesis Mode";
  if (sampleSize < 20) return "Moderate Confidence";
  if (sampleSize < 50) return "High Confidence";
  return "Very High Confidence";
}
```

### Prediction Engine

```typescript
import { predictionEngine } from './services/predictionEngine';

// Example 1: Predict Content Success
async function predictVideo(creatorId: string, script: string) {
  const creatorDNA = await dataStore.getDNAByCreatorId(creatorId);
  
  if (!creatorDNA) {
    throw new Error("DNA not available yet");
  }
  
  const prediction = await predictionEngine.predictContentSuccess(
    { creatorId, script },
    creatorDNA
  );
  
  console.log(`Success Probability: ${prediction.successProbabilityPercentage}%`);
  console.log(`Risk Factors: ${prediction.riskFactors.length}`);
  
  if (prediction.successProbabilityPercentage >= 70) {
    console.log("✅ HIGH SUCCESS PROBABILITY - Proceed with confidence!");
  } else if (prediction.successProbabilityPercentage >= 50) {
    console.log("⚠️ MODERATE SUCCESS - Apply recommendations");
  } else {
    console.log("❌ LOW SUCCESS - Major revision needed");
  }
  
  return prediction;
}

// Example 2: Generate Daily Mission
async function createMission(creatorId: string) {
  const creatorDNA = await dataStore.getDNAByCreatorId(creatorId);
  
  if (!creatorDNA || creatorDNA.sampleSize < 10) {
    console.log("Not enough data for mission generation");
    return null;
  }
  
  const mission = await predictionEngine.generateDailyMission(
    creatorId,
    creatorDNA
  );
  
  console.log(`Mission: ${mission.objective}`);
  console.log(`Testing: ${mission.weaknessBeingTested}`);
  
  await dataStore.saveMission(mission);
  
  return mission;
}
```

### Data Store

```typescript
import { dataStore } from './services/dataStore';

// Example 1: Complete User Registration Flow
async function registerNewCreator(email: string, profileData: OnboardingData) {
  // Create user
  const user = await dataStore.createUser(email);
  console.log(`User created: ${user.id}`);
  
  // Create profile
  const profile = await dataStore.createProfile(user.id, profileData);
  console.log(`Profile created: ${profile.id}`);
  
  return { user, profile };
}

// Example 2: Upload Video Workflow
async function uploadVideoMetrics(
  creatorId: string,
  screenshotData: string
) {
  // Extract metrics from screenshot
  const extracted = await visionAI.extractMetricsFromScreenshot(screenshotData);
  
  // Create video record
  const video = await dataStore.createVideo(
    creatorId,
    `tiktok_${Date.now()}`,
    new Date()
  );
  
  // Save metrics
  const metrics = await dataStore.saveMetrics(video.id, {
    views: extracted.views,
    likes: extracted.likes,
    comments: extracted.comments,
    shares: extracted.shares,
    saves: extracted.saves,
    watchTimeSeconds: extracted.watchTimeSeconds,
    completionRatePercentage: extracted.completionRatePercentage,
    retentionData: []
  });
  
  console.log(`Video uploaded: ${video.id}`);
  console.log(`Metrics saved: ${metrics.id}`);
  
  return { video, metrics };
}

// Example 3: Get Creator Statistics
async function getCreatorStats(creatorId: string) {
  const videos = await dataStore.getVideosByCreatorId(creatorId);
  const metrics = await dataStore.getMetricsByCreatorId(creatorId);
  const dna = await dataStore.getDNAByCreatorId(creatorId);
  
  const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
  const avgViews = totalViews / metrics.length;
  const avgCompletionRate = metrics.reduce(
    (sum, m) => sum + m.completionRatePercentage, 
    0
  ) / metrics.length;
  
  return {
    totalVideos: videos.length,
    totalViews,
    avgViews: Math.round(avgViews),
    avgCompletionRate: avgCompletionRate.toFixed(1),
    dnaScore: dna?.overallScore || 0,
    confidence: dna?.confidenceLevel || 0
  };
}
```

---

## Data Structures Examples

### Complete Creator Profile Example

```json
{
  "user": {
    "id": "user_1706180000000_a1b2c3",
    "email": "sarah@example.com",
    "createdAt": "2024-01-25T10:00:00.000Z"
  },
  
  "profile": {
    "id": "profile_1706180000000_d4e5f6",
    "userId": "user_1706180000000_a1b2c3",
    "followerCount": 45000,
    "niche": "لياقة وصحة",
    "country": "الإمارات",
    "language": "ar",
    "createdAt": "2024-01-25T10:00:00.000Z"
  },
  
  "videos": [
    {
      "id": "video_1706180000000_g7h8i9",
      "creatorId": "profile_1706180000000_d4e5f6",
      "platformVideoId": "tiktok_7890123456",
      "publishTime": "2024-01-20T19:30:00.000Z",
      "createdAt": "2024-01-25T10:00:00.000Z"
    }
  ],
  
  "metrics": [
    {
      "id": "metrics_1706180000000_j0k1l2",
      "videoId": "video_1706180000000_g7h8i9",
      "views": 89000,
      "likes": 6200,
      "comments": 380,
      "shares": 290,
      "saves": 720,
      "watchTimeSeconds": 26.8,
      "completionRatePercentage": 71.5,
      "retentionData": [
        { "timestamp": 0, "percentage": 100 },
        { "timestamp": 3, "percentage": 95 },
        { "timestamp": 10, "percentage": 82 },
        { "timestamp": 20, "percentage": 73 },
        { "timestamp": 30, "percentage": 60 }
      ],
      "status": "PROCESSED",
      "createdAt": "2024-01-25T10:00:00.000Z",
      "processedAt": "2024-01-25T10:01:30.000Z"
    }
  ],
  
  "dna": {
    "creatorId": "profile_1706180000000_d4e5f6",
    "overallScore": 78,
    "confidenceLevel": 95,
    "sampleSize": 12,
    "lastUpdated": "2024-01-25T10:05:00.000Z",
    "successDrivers": [...],
    "failureDrivers": [...]
  },
  
  "dailyMission": {
    "id": "mission_1706180000000_m3n4o5",
    "creatorId": "profile_1706180000000_d4e5f6",
    "date": "2024-01-26T00:00:00.000Z",
    "objective": "Boost Engagement and Shares",
    "status": "pending",
    "createdAt": "2024-01-25T10:06:00.000Z"
  }
}
```

---

## Common Workflows

### Workflow 1: New User Complete Journey

```typescript
// 1. User Registration
const userData = {
  email: "creator@example.com",
  niche: "تعليم وعلوم",
  country: "مصر",
  language: "ar",
  followerCount: 8000,
  contentFrequency: "daily",
  primaryGoal: "growth"
};

const { user, profile } = await registerNewCreator(
  userData.email,
  userData
);

// 2. Upload First Videos (need at least 10)
for (let i = 0; i < 10; i++) {
  const screenshot = await getUserUploadedScreenshot();
  await uploadVideoMetrics(profile.id, screenshot);
}

// 3. Generate DNA Profile
const metrics = await dataStore.getMetricsByCreatorId(profile.id);
const dna = await dnaEngine.computeCreatorDNA(profile.id, metrics);
await dataStore.saveDNA(dna);

// 4. Generate Daily Mission
const mission = await predictionEngine.generateDailyMission(profile.id, dna);
await dataStore.saveMission(mission);

// 5. Test Content Prediction
const script = "محتوى تعليمي عن الفيزياء...";
const prediction = await predictionEngine.predictContentSuccess(
  { creatorId: profile.id, script },
  dna
);

console.log(`Success Probability: ${prediction.successProbabilityPercentage}%`);
```

### Workflow 2: Daily Creator Routine

```typescript
// Morning: Check Daily Mission
const mission = await dataStore.getLatestMissionByCreatorId(creatorId);
console.log("Today's Mission:", mission.objective);
console.log("Instructions:", mission.specificInstructions);

// Afternoon: Test Content Ideas
const scripts = [
  "فكرة أولى...",
  "فكرة ثانية...",
  "فكرة ثالثة..."
];

const predictions = await Promise.all(
  scripts.map(script => 
    predictionEngine.predictContentSuccess(
      { creatorId, script },
      creatorDNA
    )
  )
);

const bestScript = predictions.reduce((best, current, index) => 
  current.successProbabilityPercentage > best.probability
    ? { script: scripts[index], probability: current.successProbabilityPercentage }
    : best,
  { script: "", probability: 0 }
);

console.log("Best Script:", bestScript);

// Evening: Upload Results
await uploadVideoMetrics(creatorId, screenshotData);
await dataStore.updateMissionStatus(mission.id, 'completed');
```

---

**Examples Version**: 1.0  
**Last Updated**: 2024  
**More examples coming soon!** 🚀
