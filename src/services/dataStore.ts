// ===================================================================
// AI DOMINATOR - Local Data Store (IndexedDB Simulation)
// Enterprise-Grade Client-Side Data Management
// Production: Replace with PostgreSQL + Prisma + Redis
// ===================================================================

import {
  User,
  CreatorProfile,
  Video,
  VideoMetrics,
  CreatorDNA,
  DailyMission,
  ScreenshotUpload,
  OnboardingData,
  MetricStatus
} from '../types';

/**
 * Local Data Store Service
 * Simulates backend database operations in browser
 * Uses localStorage for persistence (in production: PostgreSQL + Redis)
 */
export class DataStore {
  private static instance: DataStore;
  private readonly STORAGE_PREFIX = 'ai_dominator_';

  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // ============= INITIALIZATION =============

  private initializeStorage(): void {
    // Initialize storage structure if not exists
    if (!this.getItem('initialized')) {
      this.setItem('initialized', 'true');
      this.setItem('users', JSON.stringify([]));
      this.setItem('profiles', JSON.stringify([]));
      this.setItem('videos', JSON.stringify([]));
      this.setItem('metrics', JSON.stringify([]));
      this.setItem('dna_records', JSON.stringify([]));
      this.setItem('missions', JSON.stringify([]));
      this.setItem('screenshots', JSON.stringify([]));
    }
  }

  // ============= USER OPERATIONS =============

  async createUser(email: string): Promise<User> {
    const users = this.getUsers();
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return existingUser;
    }

    const newUser: User = {
      id: this.generateId('user'),
      email,
      createdAt: new Date()
    };

    users.push(newUser);
    this.setItem('users', JSON.stringify(users));
    
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  private getUsers(): User[] {
    const data = this.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  // ============= CREATOR PROFILE OPERATIONS =============

  async createProfile(userId: string, data: OnboardingData): Promise<CreatorProfile> {
    const profiles = this.getProfiles();

    const newProfile: CreatorProfile = {
      id: this.generateId('profile'),
      userId,
      followerCount: data.followerCount,
      niche: data.niche,
      country: data.country,
      language: data.language,
      createdAt: new Date()
    };

    profiles.push(newProfile);
    this.setItem('profiles', JSON.stringify(profiles));

    return newProfile;
  }

  async getProfileByUserId(userId: string): Promise<CreatorProfile | null> {
    const profiles = this.getProfiles();
    return profiles.find(p => p.userId === userId) || null;
  }

  async updateProfile(profileId: string, updates: Partial<CreatorProfile>): Promise<CreatorProfile> {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profileId);
    
    if (index === -1) {
      throw new Error('Profile not found');
    }

    profiles[index] = { ...profiles[index], ...updates };
    this.setItem('profiles', JSON.stringify(profiles));

    return profiles[index];
  }

  private getProfiles(): CreatorProfile[] {
    const data = this.getItem('profiles');
    return data ? JSON.parse(data) : [];
  }

  // ============= VIDEO OPERATIONS =============

  async createVideo(creatorId: string, platformVideoId: string, publishTime?: Date): Promise<Video> {
    const videos = this.getVideos();

    const newVideo: Video = {
      id: this.generateId('video'),
      creatorId,
      platformVideoId,
      publishTime: publishTime || new Date(),
      createdAt: new Date()
    };

    videos.push(newVideo);
    this.setItem('videos', JSON.stringify(videos));

    return newVideo;
  }

  async getVideosByCreatorId(creatorId: string): Promise<Video[]> {
    const videos = this.getVideos();
    return videos.filter(v => v.creatorId === creatorId);
  }

  async getVideoById(videoId: string): Promise<Video | null> {
    const videos = this.getVideos();
    return videos.find(v => v.id === videoId) || null;
  }

  private getVideos(): Video[] {
    const data = this.getItem('videos');
    return data ? JSON.parse(data) : [];
  }

  // ============= VIDEO METRICS OPERATIONS =============

  async saveMetrics(videoId: string, metrics: Partial<VideoMetrics>): Promise<VideoMetrics> {
    const allMetrics = this.getMetrics();
    
    const existingIndex = allMetrics.findIndex(m => m.videoId === videoId);

    const newMetrics: VideoMetrics = {
      id: existingIndex >= 0 ? allMetrics[existingIndex].id : this.generateId('metrics'),
      videoId,
      views: metrics.views || 0,
      likes: metrics.likes || 0,
      comments: metrics.comments || 0,
      shares: metrics.shares || 0,
      saves: metrics.saves || 0,
      watchTimeSeconds: metrics.watchTimeSeconds || 0,
      completionRatePercentage: metrics.completionRatePercentage || 0,
      retentionData: metrics.retentionData || [],
      status: metrics.status || MetricStatus.PROCESSED,
      createdAt: existingIndex >= 0 ? allMetrics[existingIndex].createdAt : new Date(),
      processedAt: new Date()
    };

    if (existingIndex >= 0) {
      allMetrics[existingIndex] = newMetrics;
    } else {
      allMetrics.push(newMetrics);
    }

    this.setItem('metrics', JSON.stringify(allMetrics));
    return newMetrics;
  }

  async getMetricsByCreatorId(creatorId: string): Promise<VideoMetrics[]> {
    const videos = await this.getVideosByCreatorId(creatorId);
    const videoIds = videos.map(v => v.id);
    const allMetrics = this.getMetrics();
    
    return allMetrics.filter(m => videoIds.includes(m.videoId));
  }

  async getMetricsByVideoId(videoId: string): Promise<VideoMetrics | null> {
    const allMetrics = this.getMetrics();
    return allMetrics.find(m => m.videoId === videoId) || null;
  }

  private getMetrics(): VideoMetrics[] {
    const data = this.getItem('metrics');
    return data ? JSON.parse(data) : [];
  }

  // ============= DNA OPERATIONS =============

  async saveDNA(dna: CreatorDNA): Promise<CreatorDNA> {
    const dnaRecords = this.getDNARecords();
    
    const existingIndex = dnaRecords.findIndex(d => d.creatorId === dna.creatorId);

    if (existingIndex >= 0) {
      dnaRecords[existingIndex] = dna;
    } else {
      dnaRecords.push(dna);
    }

    this.setItem('dna_records', JSON.stringify(dnaRecords));
    return dna;
  }

  async getDNAByCreatorId(creatorId: string): Promise<CreatorDNA | null> {
    const dnaRecords = this.getDNARecords();
    return dnaRecords.find(d => d.creatorId === creatorId) || null;
  }

  private getDNARecords(): CreatorDNA[] {
    const data = this.getItem('dna_records');
    return data ? JSON.parse(data) : [];
  }

  // ============= MISSION OPERATIONS =============

  async saveMission(mission: DailyMission): Promise<DailyMission> {
    const missions = this.getMissions();
    
    const existingIndex = missions.findIndex(m => m.id === mission.id);

    if (existingIndex >= 0) {
      missions[existingIndex] = mission;
    } else {
      missions.push(mission);
    }

    this.setItem('missions', JSON.stringify(missions));
    return mission;
  }

  async getLatestMissionByCreatorId(creatorId: string): Promise<DailyMission | null> {
    const missions = this.getMissions()
      .filter(m => m.creatorId === creatorId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return missions[0] || null;
  }

  async updateMissionStatus(missionId: string, status: DailyMission['status']): Promise<void> {
    const missions = this.getMissions();
    const index = missions.findIndex(m => m.id === missionId);
    
    if (index >= 0) {
      missions[index].status = status;
      this.setItem('missions', JSON.stringify(missions));
    }
  }

  private getMissions(): DailyMission[] {
    const data = this.getItem('missions');
    return data ? JSON.parse(data) : [];
  }

  // ============= SCREENSHOT OPERATIONS =============

  async saveScreenshot(screenshot: ScreenshotUpload): Promise<ScreenshotUpload> {
    const screenshots = this.getScreenshots();
    screenshots.push(screenshot);
    this.setItem('screenshots', JSON.stringify(screenshots));
    return screenshot;
  }

  async updateScreenshotStatus(
    screenshotId: string, 
    status: ScreenshotUpload['status'],
    extractedMetrics?: Partial<VideoMetrics>
  ): Promise<void> {
    const screenshots = this.getScreenshots();
    const index = screenshots.findIndex(s => s.id === screenshotId);
    
    if (index >= 0) {
      screenshots[index].status = status;
      screenshots[index].processedAt = new Date();
      if (extractedMetrics) {
        screenshots[index].extractedMetrics = extractedMetrics;
      }
      this.setItem('screenshots', JSON.stringify(screenshots));
    }
  }

  private getScreenshots(): ScreenshotUpload[] {
    const data = this.getItem('screenshots');
    return data ? JSON.parse(data) : [];
  }

  // ============= UTILITY METHODS =============

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getItem(key: string): string | null {
    return localStorage.getItem(this.STORAGE_PREFIX + key);
  }

  private setItem(key: string, value: string): void {
    localStorage.setItem(this.STORAGE_PREFIX + key, value);
  }

  async clearAllData(): Promise<void> {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    this.initializeStorage();
  }

  async getStats(): Promise<{
    totalUsers: number;
    totalVideos: number;
    totalMetrics: number;
  }> {
    return {
      totalUsers: this.getUsers().length,
      totalVideos: this.getVideos().length,
      totalMetrics: this.getMetrics().length
    };
  }
}

export const dataStore = DataStore.getInstance();
