// ===================================================================
// AI DOMINATOR - Creator DNA Dashboard
// Visual Display of Creator Genome Analysis
// ===================================================================

import React from 'react';
import { CreatorDNA, DNACategory } from '../types';

interface DNADashboardProps {
  creatorDNA: CreatorDNA | null;
  onNavigate: (screen: string) => void;
  totalVideos: number;
}

export const DNADashboard: React.FC<DNADashboardProps> = ({ 
  creatorDNA, 
  onNavigate,
  totalVideos 
}) => {
  const getCategoryIcon = (category: DNACategory) => {
    const icons: Record<DNACategory, string> = {
      [DNACategory.CONTENT]: '📝',
      [DNACategory.HOOK]: '🎣',
      [DNACategory.DELIVERY]: '🎤',
      [DNACategory.VISUAL]: '🎨',
      [DNACategory.TIMING]: '⏰',
      [DNACategory.AUDIENCE]: '👥'
    };
    return icons[category] || '📊';
  };

  const getCategoryColor = (category: DNACategory) => {
    const colors: Record<DNACategory, string> = {
      [DNACategory.CONTENT]: 'from-blue-500 to-cyan-500',
      [DNACategory.HOOK]: 'from-purple-500 to-pink-500',
      [DNACategory.DELIVERY]: 'from-orange-500 to-red-500',
      [DNACategory.VISUAL]: 'from-green-500 to-emerald-500',
      [DNACategory.TIMING]: 'from-yellow-500 to-orange-500',
      [DNACategory.AUDIENCE]: 'from-indigo-500 to-purple-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return { text: 'عالية', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (confidence >= 60) return { text: 'متوسطة', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { text: 'منخفضة', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  const isHypothesisMode = !creatorDNA || creatorDNA.sampleSize < 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Creator DNA Profile</h1>
              <p className="text-gray-400">البصمة الجينية لحسابك على تيك توك</p>
            </div>
            
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              رفع فيديو جديد
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="text-gray-400 text-sm mb-1">إجمالي الفيديوهات</div>
              <div className="text-3xl font-bold text-white">{totalVideos}</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="text-gray-400 text-sm mb-1">DNA Score</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-white">{creatorDNA?.overallScore || 0}</div>
                <div className="text-gray-500">/100</div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="text-gray-400 text-sm mb-1">مستوى الثقة</div>
              <div className="text-3xl font-bold text-white">{creatorDNA?.confidenceLevel || 0}%</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
              <div className="text-gray-400 text-sm mb-1">حجم العينة</div>
              <div className="text-3xl font-bold text-white">{creatorDNA?.sampleSize || 0}</div>
            </div>
          </div>
        </div>

        {/* Hypothesis Mode Warning */}
        {isHypothesisMode && (
          <div className="mb-8 bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-yellow-200 font-semibold mb-2">⚠️ وضع الفرضيات (Hypothesis Mode)</h3>
                <p className="text-yellow-200/80 mb-3">
                  لديك حالياً {totalVideos} فيديو فقط. نحتاج إلى 10 فيديوهات على الأقل لتوليد تحليل DNA دقيق وموثوق.
                </p>
                <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-200 text-sm">التقدم نحو التحليل الكامل</span>
                    <span className="text-yellow-200 text-sm font-semibold">{totalVideos}/10</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${(totalVideos / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DNA Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Success Drivers */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">عوامل النجاح</h2>
                <p className="text-gray-400 text-sm">Success Drivers</p>
              </div>
            </div>

            {creatorDNA && creatorDNA.successDrivers.length > 0 ? (
              <div className="space-y-4">
                {creatorDNA.successDrivers.map((trait) => (
                  <div 
                    key={trait.id}
                    className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 hover:border-green-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(trait.category)}</span>
                        <div>
                          <div className="text-white font-medium">{trait.traitName}</div>
                          <div className="text-gray-400 text-xs">{trait.category}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs border ${getConfidenceBadge(trait.confidenceScore).color}`}>
                        {getConfidenceBadge(trait.confidenceScore).text}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getCategoryColor(trait.category)}`}
                          style={{ width: `${trait.confidenceScore}%` }}
                        />
                      </div>
                      <div className="text-green-400 text-sm font-semibold">{trait.confidenceScore}%</div>
                    </div>

                    <div className="mt-2 text-gray-400 text-xs">
                      حجم العينة: {trait.sampleSize} فيديو
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">لا توجد بيانات كافية بعد</p>
                <p className="text-gray-600 text-sm mt-1">ارفع المزيد من الفيديوهات لبناء ملف DNA</p>
              </div>
            )}
          </div>

          {/* Failure Drivers */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">نقاط الضعف</h2>
                <p className="text-gray-400 text-sm">Failure Drivers</p>
              </div>
            </div>

            {creatorDNA && creatorDNA.failureDrivers.length > 0 ? (
              <div className="space-y-4">
                {creatorDNA.failureDrivers.map((trait) => (
                  <div 
                    key={trait.id}
                    className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(trait.category)}</span>
                        <div>
                          <div className="text-white font-medium">{trait.traitName}</div>
                          <div className="text-gray-400 text-xs">{trait.category}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs border ${getConfidenceBadge(trait.confidenceScore).color}`}>
                        {getConfidenceBadge(trait.confidenceScore).text}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getCategoryColor(trait.category)}`}
                          style={{ width: `${trait.confidenceScore}%` }}
                        />
                      </div>
                      <div className="text-red-400 text-sm font-semibold">{trait.confidenceScore}%</div>
                    </div>

                    <div className="mt-2 text-gray-400 text-xs">
                      حجم العينة: {trait.sampleSize} فيديو
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">لا توجد بيانات كافية بعد</p>
                <p className="text-gray-600 text-sm mt-1">ارفع المزيد من الفيديوهات لتحديد نقاط التحسين</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA to Daily Mission */}
        {!isHypothesisMode && (
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">جاهز لمهمة اليوم؟ 🎯</h3>
                <p className="text-gray-300">بناءً على تحليل DNA، قمنا بإنشاء مهمة نمو مخصصة لك</p>
              </div>
              <button
                onClick={() => onNavigate('daily-mission')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-105"
              >
                عرض المهمة اليومية
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
