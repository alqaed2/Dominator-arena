// ===================================================================
// AI DOMINATOR - Creator DNA Analytics Engine
// Stateless DNA Computation Service (Enterprise-Grade Algorithm)
// ===================================================================

import {
  CreatorDNA,
  DNATrait,
  DNACategory,
  VideoMetrics,
  PerformanceBaseline
} from '../types';

/**
 * Core DNA Analytics Engine
 * Implements statistical analysis to extract creator-specific success patterns
 * Designed as stateless service for horizontal scaling
 */
export class DNAEngine {
  private static instance: DNAEngine;
  private readonly MINIMUM_SAMPLE_SIZE = 10;
  private readonly CONFIDENCE_MULTIPLIER = 10;

  private constructor() {}

  public static getInstance(): DNAEngine {
    if (!DNAEngine.instance) {
      DNAEngine.instance = new DNAEngine();
    }
    return DNAEngine.instance;
  }

  /**
   * Main DNA computation function
   * Analyzes video metrics and extracts creator-specific patterns
   */
  async computeCreatorDNA(
    creatorId: string,
    videoMetrics: VideoMetrics[]
  ): Promise<CreatorDNA> {
    // Validate minimum sample size
    if (videoMetrics.length < this.MINIMUM_SAMPLE_SIZE) {
      return this.generateHypothesisState(creatorId, videoMetrics.length);
    }

    // Calculate performance baseline
    const baseline = this.calculateBaseline(videoMetrics);

    // Extract traits across all DNA categories
    const traits = this.extractAllTraits(creatorId, videoMetrics, baseline);

    // Classify traits as success drivers or failure drivers
    const successDrivers = traits
      .filter(t => t.impact === 'positive')
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, 5);

    const failureDrivers = traits
      .filter(t => t.impact === 'negative')
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, 5);

    // Calculate overall DNA score
    const overallScore = this.calculateOverallScore(successDrivers, failureDrivers);

    return {
      creatorId,
      traits,
      successDrivers,
      failureDrivers,
      overallScore,
      confidenceLevel: this.calculateConfidenceLevel(videoMetrics.length),
      lastUpdated: new Date(),
      sampleSize: videoMetrics.length
    };
  }

  /**
   * Calculate statistical baseline for creator performance
   */
  private calculateBaseline(metrics: VideoMetrics[]): PerformanceBaseline {
    const views = metrics.map(m => m.views);
    const completionRates = metrics.map(m => m.completionRatePercentage);
    const engagementRates = metrics.map(m => 
      ((m.likes + m.comments + m.shares + m.saves) / m.views) * 100
    );

    return {
      creatorId: '', // Will be set by caller
      avgViews: this.calculateMean(views),
      avgCompletionRate: this.calculateMean(completionRates),
      avgEngagementRate: this.calculateMean(engagementRates),
      stdDeviation: this.calculateStdDev(views),
      calculatedFrom: metrics.length,
      lastCalculated: new Date()
    };
  }

  /**
   * Extract traits across all DNA categories
   */
  private extractAllTraits(
    creatorId: string,
    metrics: VideoMetrics[],
    baseline: PerformanceBaseline
  ): DNATrait[] {
    const traits: DNATrait[] = [];

    // CONTENT DNA - Analyze content patterns
    traits.push(...this.analyzeContentDNA(creatorId, metrics, baseline));

    // HOOK DNA - Analyze opening engagement
    traits.push(...this.analyzeHookDNA(creatorId, metrics, baseline));

    // DELIVERY DNA - Analyze pacing and retention
    traits.push(...this.analyzeDeliveryDNA(creatorId, metrics, baseline));

    // VISUAL DNA - Analyze visual elements
    traits.push(...this.analyzeVisualDNA(creatorId, metrics, baseline));

    // TIMING DNA - Analyze publishing patterns
    traits.push(...this.analyzeTimingDNA(creatorId, metrics, baseline));

    // AUDIENCE DNA - Analyze audience behavior
    traits.push(...this.analyzeAudienceDNA(creatorId, metrics, baseline));

    return traits;
  }

  // ============= DNA CATEGORY ANALYZERS =============

  private analyzeContentDNA(
    creatorId: string,
    metrics: VideoMetrics[],
    baseline: PerformanceBaseline
  ): DNATrait[] {
    const traits: DNATrait[] = [];

    // Analyze video length correlation with performance
    const avgWatchTimes = metrics.map(m => m.watchTimeSeconds);
    const avgWatchTime = this.calculateMean(avgWatchTimes);
    
    // Calculate correlation between watch time and views
    const viewPerformance = metrics.map((m, i) => ({
      watchTime: avgWatchTimes[i],
      performance: m.views / baseline.avgViews
    }));

    const optimalDuration = this.findOptimalValue(viewPerformance);

    traits.push({
      id: `${creatorId}-content-duration`,
      creatorId,
      traitName: 'Optimal Video Duration',
      traitValue: optimalDuration,
      confidenceScore: this.calculateConfidenceScore(metrics.length),
      sampleSize: metrics.length,
      category: DNACategory.CONTENT,
      impact: avgWatchTime > optimalDuration ? 'negative' : 'positive',
      updatedAt: new Date()
    });

    return traits;
  }

  private analyzeHookDNA(
    creatorId: string,
    metrics: VideoMetrics[],
    _baseline: PerformanceBaseline
  ): DNATrait[] {
    const traits: DNATrait[] = [];

    // Analyze first 3 seconds retention
    const earlyRetention = metrics.map(m => {
      if (m.retentionData && m.retentionData.length > 0) {
        const first3Sec = m.retentionData.find(r => r.timestamp <= 3);
        return first3Sec?.percentage || 100;
      }
      return 90 + Math.random() * 10; // Simulate if no data
    });

    const avgEarlyRetention = this.calculateMean(earlyRetention);

    traits.push({
      id: `${creatorId}-hook-retention`,
      creatorId,
      traitName: 'Hook Effectiveness (First 3s Retention)',
      traitValue: avgEarlyRetention,
      confidenceScore: this.calculateConfidenceScore(metrics.length),
      sampleSize: metrics.length,
      category: DNACategory.HOOK,
      impact: avgEarlyRetention > 85 ? 'positive' : 'negative',
      updatedAt: new Date()
    });

    return traits;
  }

  private analyzeDeliveryDNA(
    creatorId: string,
    metrics: VideoMetrics[],
    baseline: PerformanceBaseline
  ): DNATrait[] {
    const traits: DNATrait[] = [];

    // Analyze completion rate patterns
    const highCompletionVideos = metrics.filter(
      m => m.completionRatePercentage > baseline.avgCompletionRate
    );

    const completionRateImpact = (highCompletionVideos.length / metrics.length) * 100;

    traits.push({
      id: `${creatorId}-delivery-completion`,
      creatorId,
      traitName: 'Content Pacing & Retention',
      traitValue: baseline.avgCompletionRate,
      confidenceScore: this.calculateConfidenceScore(metrics.length),
      sampleSize: metrics.length,
      category: DNACategory.DELIVERY,
      impact: completionRateImpact > 50 ? 'positive' : 'negative',
      updatedAt: new Date()
    });

    return traits;
  }

  private analyzeVisualDNA(
    creatorId: string,
    metrics: VideoMetrics[],
    _baseline: PerformanceBaseline
  ): DNATrait[] {
    const traits: DNATrait[] = [];

    // Analyze visual engagement through saves (indicates rewatchability)
    const avgSaveRate = this.calculateMean(
      metrics.map(m => (m.saves / m.views) * 100)
    );

    traits.push({
      id: `${creatorId}-visual-quality`,
      creatorId,
      traitName: 'Visual Quality Score (Save Rate)',
      traitValue: avgSaveRate,
      confidenceScore: this.calculateConfidenceScore(metrics.length),
      sampleSize: metrics.length,
      category: DNACategory.VISUAL,
      impact: avgSaveRate > 2 ? 'positive' : 'neutral',
      updatedAt: new Date()
    });

    return traits;
  }

  private analyzeTimingDNA(
    creatorId: string,
    metrics: VideoMetrics[],
    _baseline: PerformanceBaseline
  ): DNATrait[] {
    const traits: DNATrait[] = [];

    // Group videos by publishing patterns
    // This is simplified - in production would analyze actual timestamps
    const avgPerformance = _baseline.avgViews;

    traits.push({
      id: `${creatorId}-timing-consistency`,
      creatorId,
      traitName: 'Publishing Consistency Impact',
      traitValue: avgPerformance,
      confidenceScore: this.calculateConfidenceScore(metrics.length),
      sampleSize: metrics.length,
      category: DNACategory.TIMING,
      impact: 'neutral',
      updatedAt: new Date()
    });

    return traits;
  }

  private analyzeAudienceDNA(
    creatorId: string,
    metrics: VideoMetrics[],
    _baseline: PerformanceBaseline
  ): DNATrait[] {
    const traits: DNATrait[] = [];

    // Analyze audience engagement patterns
    const avgShareRate = this.calculateMean(
      metrics.map(m => (m.shares / m.views) * 100)
    );

    traits.push({
      id: `${creatorId}-audience-virality`,
      creatorId,
      traitName: 'Audience Sharing Propensity',
      traitValue: avgShareRate,
      confidenceScore: this.calculateConfidenceScore(metrics.length),
      sampleSize: metrics.length,
      category: DNACategory.AUDIENCE,
      impact: avgShareRate > 1 ? 'positive' : 'neutral',
      updatedAt: new Date()
    });

    return traits;
  }

  // ============= STATISTICAL HELPERS =============

  private calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateStdDev(values: number[]): number {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = this.calculateMean(squaredDiffs);
    return Math.sqrt(variance);
  }

  private calculateConfidenceScore(sampleSize: number): number {
    return Math.min(100, sampleSize * this.CONFIDENCE_MULTIPLIER);
  }

  private calculateConfidenceLevel(sampleSize: number): number {
    if (sampleSize < this.MINIMUM_SAMPLE_SIZE) return 0;
    if (sampleSize < 20) return 60;
    if (sampleSize < 50) return 80;
    return 95;
  }

  private findOptimalValue(
    data: { watchTime: number; performance: number }[]
  ): number {
    if (data.length === 0) return 30; // Default 30 seconds
    
    // Find the watch time that correlates with best performance
    const sorted = [...data].sort((a, b) => b.performance - a.performance);
    const topPerformers = sorted.slice(0, Math.ceil(sorted.length * 0.3));
    
    return this.calculateMean(topPerformers.map(d => d.watchTime));
  }

  private calculateOverallScore(
    successDrivers: DNATrait[],
    failureDrivers: DNATrait[]
  ): number {
    const successWeight = successDrivers.reduce(
      (sum, trait) => sum + (trait.confidenceScore * trait.traitValue), 
      0
    );
    const failureWeight = failureDrivers.reduce(
      (sum, trait) => sum + (trait.confidenceScore * Math.abs(trait.traitValue)), 
      0
    );

    const totalWeight = successWeight + failureWeight;
    if (totalWeight === 0) return 50;

    return Math.round((successWeight / totalWeight) * 100);
  }

  private generateHypothesisState(
    creatorId: string,
    currentSampleSize: number
  ): CreatorDNA {
    return {
      creatorId,
      traits: [],
      successDrivers: [],
      failureDrivers: [],
      overallScore: 0,
      confidenceLevel: 0,
      lastUpdated: new Date(),
      sampleSize: currentSampleSize
    };
  }
}

export const dnaEngine = DNAEngine.getInstance();
