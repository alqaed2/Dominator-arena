// ===================================================================
// AI DOMINATOR - Vision AI Service (Screenshot Intelligence)
// Simulates OpenAI Vision API for Screenshot Metrics Extraction
// Production: Replace with actual OpenAI/Google Vision API
// ===================================================================

import { ScreenshotExtractionResult } from '../types';

/**
 * Simulates Vision AI processing of TikTok analytics screenshots
 * In production, this would call OpenAI GPT-4 Vision or Google Cloud Vision API
 */
export class VisionAIService {
  private static instance: VisionAIService;

  private constructor() {}

  public static getInstance(): VisionAIService {
    if (!VisionAIService.instance) {
      VisionAIService.instance = new VisionAIService();
    }
    return VisionAIService.instance;
  }

  /**
   * Extract metrics from screenshot using Vision AI
   * Simulates OCR and pattern recognition from TikTok analytics screen
   */
  async extractMetricsFromScreenshot(
    _imageData: string
  ): Promise<ScreenshotExtractionResult> {
    // Simulate API processing time (500ms - 2s)
    await this.simulateProcessingDelay();

    // In production, this would be:
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-vision-preview",
    //   messages: [{
    //     role: "user",
    //     content: [
    //       { type: "text", text: EXTRACTION_PROMPT },
    //       { type: "image_url", image_url: { url: imageData } }
    //     ]
    //   }],
    //   response_format: { type: "json_object" }
    // });

    // Simulate realistic metrics extraction
    return this.generateSimulatedMetrics();
  }

  /**
   * Validates extracted data and converts notation (K, M) to numbers
   */
  normalizeMetricValue(value: string | number): number {
    if (typeof value === 'number') return value;
    
    const str = value.toString().toUpperCase().trim();
    
    // Handle K notation (thousands)
    if (str.includes('K')) {
      return parseFloat(str.replace('K', '')) * 1000;
    }
    
    // Handle M notation (millions)
    if (str.includes('M')) {
      return parseFloat(str.replace('M', '')) * 1000000;
    }
    
    // Handle percentage
    if (str.includes('%')) {
      return parseFloat(str.replace('%', ''));
    }
    
    return parseFloat(str) || 0;
  }

  /**
   * Validates the completeness and accuracy of extracted data
   */
  validateExtraction(result: ScreenshotExtractionResult): {
    isValid: boolean;
    confidence: number;
    issues: string[];
  } {
    const issues: string[] = [];
    let confidence = 100;

    // Check for unrealistic values
    if (result.views < 0 || result.views > 1000000000) {
      issues.push('Views count appears unrealistic');
      confidence -= 20;
    }

    if (result.completionRatePercentage < 0 || result.completionRatePercentage > 100) {
      issues.push('Completion rate must be between 0-100%');
      confidence -= 30;
    }

    if (result.watchTimeSeconds < 0 || result.watchTimeSeconds > 600) {
      issues.push('Watch time appears unrealistic');
      confidence -= 20;
    }

    // Check for missing critical data
    if (!result.views || !result.completionRatePercentage) {
      issues.push('Missing critical metrics');
      confidence -= 40;
    }

    return {
      isValid: confidence >= 60,
      confidence: Math.max(0, confidence),
      issues
    };
  }

  // ============= SIMULATION HELPERS =============
  
  private async simulateProcessingDelay(): Promise<void> {
    const delay = 500 + Math.random() * 1500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateSimulatedMetrics(): ScreenshotExtractionResult {
    // Generate realistic TikTok metrics
    const views = this.generateRealisticViews();
    const completionRate = this.generateRealisticCompletionRate(views);
    const avgWatchTime = this.generateWatchTime(completionRate);
    const engagement = this.generateEngagement(views);

    return {
      views,
      likes: Math.floor(views * engagement.likeRate),
      comments: Math.floor(views * engagement.commentRate),
      shares: Math.floor(views * engagement.shareRate),
      saves: Math.floor(views * engagement.saveRate),
      watchTimeSeconds: avgWatchTime,
      completionRatePercentage: completionRate,
      confidence: 85 + Math.random() * 10 // 85-95% confidence
    };
  }

  private generateRealisticViews(): number {
    // Simulate power law distribution (most videos get low views, few get viral)
    const random = Math.random();
    
    if (random < 0.6) {
      // 60% of videos: 100 - 5,000 views
      return Math.floor(100 + Math.random() * 4900);
    } else if (random < 0.85) {
      // 25% of videos: 5,000 - 50,000 views
      return Math.floor(5000 + Math.random() * 45000);
    } else if (random < 0.95) {
      // 10% of videos: 50,000 - 200,000 views
      return Math.floor(50000 + Math.random() * 150000);
    } else {
      // 5% of videos: 200,000 - 1,000,000 views (viral)
      return Math.floor(200000 + Math.random() * 800000);
    }
  }

  private generateRealisticCompletionRate(views: number): number {
    // Higher view videos tend to have better completion rates
    const baseRate = 35 + Math.random() * 30; // 35-65%
    
    if (views > 100000) {
      return Math.min(95, baseRate + 15);
    } else if (views > 10000) {
      return Math.min(85, baseRate + 8);
    }
    
    return baseRate;
  }

  private generateWatchTime(completionRate: number): number {
    // Average TikTok video is 15-60 seconds
    const avgVideoDuration = 20 + Math.random() * 35;
    return (avgVideoDuration * completionRate) / 100;
  }

  private generateEngagement(views: number): {
    likeRate: number;
    commentRate: number;
    shareRate: number;
    saveRate: number;
  } {
    // Engagement rates decrease as views increase (law of large numbers)
    const baseLikeRate = 0.05 + Math.random() * 0.1; // 5-15%
    const viewFactor = Math.min(views / 100000, 1);
    
    return {
      likeRate: baseLikeRate * (1 - viewFactor * 0.3),
      commentRate: (0.005 + Math.random() * 0.02) * (1 - viewFactor * 0.4),
      shareRate: (0.002 + Math.random() * 0.01) * (1 - viewFactor * 0.3),
      saveRate: (0.01 + Math.random() * 0.03) * (1 - viewFactor * 0.2)
    };
  }
}

export const visionAI = VisionAIService.getInstance();
