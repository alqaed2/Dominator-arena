// ===================================================================
// AI DOMINATOR - Main Application Component
// Enterprise-Grade Creator Intelligence Platform
// ===================================================================

import './index.css';
import { useState, useEffect } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { UploadScreen } from './components/UploadScreen';
import { DNADashboard } from './components/DNADashboard';
import { DailyMissionScreen } from './components/DailyMissionScreen';
import { dataStore } from './services/dataStore';
import { dnaEngine } from './services/dnaEngine';
import { predictionEngine } from './services/predictionEngine';
import type { 
  AppState, 
  OnboardingData, 
  User, 
  CreatorDNA, 
  DailyMission 
} from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'onboarding',
    user: null,
    creatorProfile: null,
    creatorDNA: null,
    dailyMission: null,
    isLoading: true,
    error: null
  });

  const [totalVideos, setTotalVideos] = useState(0);

  // Initialize app - check for existing user
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user already exists (for demo, we'll use a simple check)
      const stats = await dataStore.getStats();
      
      if (stats.totalUsers > 0) {
        // Load existing user data
        // For demo, we'll simulate loading the first user
        const email = localStorage.getItem('ai_dominator_current_user');
        if (email) {
          const user = await dataStore.getUserByEmail(email);
          if (user) {
            await loadUserData(user);
            return;
          }
        }
      }

      // No existing user, show onboarding
      setAppState(prev => ({
        ...prev,
        currentScreen: 'onboarding',
        isLoading: false
      }));
    } catch (error) {
      console.error('Initialization error:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: 'فشل في تحميل التطبيق'
      }));
    }
  };

  const loadUserData = async (user: User) => {
    try {
      const profile = await dataStore.getProfileByUserId(user.id);
      if (!profile) {
        setAppState(prev => ({
          ...prev,
          currentScreen: 'onboarding',
          isLoading: false
        }));
        return;
      }

      const videos = await dataStore.getVideosByCreatorId(profile.id);
      setTotalVideos(videos.length);

      let dna: CreatorDNA | null = null;
      let mission: DailyMission | null = null;

      // Load DNA if enough videos
      if (videos.length >= 3) {
        const metrics = await dataStore.getMetricsByCreatorId(profile.id);
        dna = await dnaEngine.computeCreatorDNA(profile.id, metrics);
        await dataStore.saveDNA(dna);

        // Generate daily mission if DNA is ready
        if (dna.sampleSize >= 10) {
          mission = await predictionEngine.generateDailyMission(profile.id, dna);
          await dataStore.saveMission(mission);
        } else {
          // Try to load existing mission
          mission = await dataStore.getLatestMissionByCreatorId(profile.id);
        }
      }

      setAppState({
        currentScreen: videos.length > 0 ? 'dna-dashboard' : 'upload',
        user,
        creatorProfile: profile,
        creatorDNA: dna,
        dailyMission: mission,
        isLoading: false,
        error: null
      });

      // Save current user email for persistence
      localStorage.setItem('ai_dominator_current_user', user.email);
    } catch (error) {
      console.error('Error loading user data:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: 'فشل في تحميل بيانات المستخدم'
      }));
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setAppState(prev => ({ ...prev, isLoading: true }));

    try {
      // Create user
      const user = await dataStore.createUser(data.email);
      
      // Create profile
      const profile = await dataStore.createProfile(user.id, data);

      setAppState({
        currentScreen: 'upload',
        user,
        creatorProfile: profile,
        creatorDNA: null,
        dailyMission: null,
        isLoading: false,
        error: null
      });

      // Save current user
      localStorage.setItem('ai_dominator_current_user', user.email);
    } catch (error) {
      console.error('Onboarding error:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: 'فشل في إنشاء الحساب'
      }));
    }
  };

  const handleMetricsUploaded = async () => {
    if (!appState.creatorProfile) return;

    setAppState(prev => ({ ...prev, isLoading: true }));

    try {
      // Reload videos
      const videos = await dataStore.getVideosByCreatorId(appState.creatorProfile.id);
      setTotalVideos(videos.length);

      // Recompute DNA if enough data
      let dna: CreatorDNA | null = null;
      if (videos.length >= 3) {
        const metrics = await dataStore.getMetricsByCreatorId(appState.creatorProfile.id);
        dna = await dnaEngine.computeCreatorDNA(appState.creatorProfile.id, metrics);
        await dataStore.saveDNA(dna);
      }

      // Generate/update mission if DNA is ready
      let mission: DailyMission | null = null;
      if (dna && dna.sampleSize >= 10) {
        mission = await predictionEngine.generateDailyMission(appState.creatorProfile.id, dna);
        await dataStore.saveMission(mission);
      }

      setAppState(prev => ({
        ...prev,
        currentScreen: 'dna-dashboard',
        creatorDNA: dna,
        dailyMission: mission,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating after upload:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: 'فشل في تحديث البيانات'
      }));
    }
  };

  const handleNavigate = (screen: string) => {
    setAppState(prev => ({
      ...prev,
      currentScreen: screen as AppState['currentScreen']
    }));
  };

  // Loading State
  if (appState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">جاري التحميل...</p>
          <p className="text-gray-400 text-sm mt-2">AI DOMINATOR</p>
        </div>
      </div>
    );
  }

  // Error State
  if (appState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 max-w-md text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">حدث خطأ</h2>
          <p className="text-red-200 mb-6">{appState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Render Current Screen
  return (
    <>
      {appState.currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {appState.currentScreen === 'upload' && appState.creatorProfile && (
        <UploadScreen
          creatorId={appState.creatorProfile.id}
          onMetricsUploaded={handleMetricsUploaded}
          onNavigate={handleNavigate}
        />
      )}

      {appState.currentScreen === 'dna-dashboard' && (
        <DNADashboard
          creatorDNA={appState.creatorDNA}
          onNavigate={handleNavigate}
          totalVideos={totalVideos}
        />
      )}

      {appState.currentScreen === 'daily-mission' && (
        <DailyMissionScreen
          mission={appState.dailyMission}
          creatorId={appState.creatorProfile?.id || ''}
          creatorDNA={appState.creatorDNA}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
