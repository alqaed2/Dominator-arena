// ===================================================================
// AI DOMINATOR - Daily Mission & Content Simulator Screen
// AI-Powered Daily Growth Loop
// ===================================================================

import React, { useState } from 'react';
import { DailyMission, PredictionResult } from '../types';
import { predictionEngine } from '../services/predictionEngine';

interface DailyMissionScreenProps {
  mission: DailyMission | null;
  creatorId: string;
  creatorDNA: any;
  onNavigate: (screen: string) => void;
}

export const DailyMissionScreen: React.FC<DailyMissionScreenProps> = ({ 
  mission, 
  creatorId,
  creatorDNA,
  onNavigate 
}) => {
  const [scriptInput, setScriptInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleAnalyze = async () => {
    if (!scriptInput.trim() || !creatorDNA) return;

    setIsAnalyzing(true);
    setPrediction(null);

    try {
      const result = await predictionEngine.predictContentSuccess(
        {
          creatorId,
          script: scriptInput
        },
        creatorDNA
      );

      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSuccessProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-400';
    if (probability >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSuccessProbabilityGradient = (probability: number) => {
    if (probability >= 70) return 'from-green-500 to-emerald-500';
    if (probability >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-orange-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('dna-dashboard')}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">المهمة اليومية 🎯</h1>
          <p className="text-gray-400">خطة النمو المخصصة بناءً على Creator DNA</p>
        </div>

        {/* Daily Mission Card */}
        {mission ? (
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-500/30 rounded-3xl p-8 mb-8 shadow-2xl shadow-purple-500/10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{mission.objective}</h2>
                  <p className="text-purple-300">
                    {new Date(mission.date).toLocaleDateString('ar-SA', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <span className="text-purple-200 font-semibold">
                  {mission.status === 'pending' && '⏳ قيد الانتظار'}
                  {mission.status === 'in_progress' && '🔄 قيد التنفيذ'}
                  {mission.status === 'completed' && '✅ مكتملة'}
                </span>
              </div>
            </div>

            {/* Mission Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  التعليمات التنفيذية
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div>
                    <span className="text-gray-500 text-sm">نوع المحتوى:</span>
                    <div className="text-white font-medium mt-1">{mission.specificInstructions.contentType}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">نوع الخطاف:</span>
                    <div className="text-white font-medium mt-1">{mission.specificInstructions.hookType}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">المدة المستهدفة:</span>
                    <div className="text-white font-medium mt-1">{mission.specificInstructions.targetDuration}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">وقت النشر المثالي:</span>
                    <div className="text-white font-medium mt-1">{mission.specificInstructions.publishTime}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  نصائح الإلقاء والبصريات
                </h3>
                
                {mission.specificInstructions.visualRequirements && (
                  <div className="mb-4">
                    <div className="text-gray-500 text-sm mb-2">المتطلبات البصرية:</div>
                    <ul className="space-y-1">
                      {mission.specificInstructions.visualRequirements.map((req, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {mission.specificInstructions.deliveryTips && (
                  <div>
                    <div className="text-gray-500 text-sm mb-2">نصائح التقديم:</div>
                    <ul className="space-y-1">
                      {mission.specificInstructions.deliveryTips.map((tip, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Target Improvement */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-blue-200 font-medium mb-1">الهدف من هذه المهمة:</div>
                  <div className="text-blue-100 text-sm">{mission.targetImprovement}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 text-center mb-8">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد مهمة يومية بعد</h3>
            <p className="text-gray-400">ارفع المزيد من الفيديوهات لإنشاء مهمتك المخصصة</p>
          </div>
        )}

        {/* Content Simulator */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">محاكي ما قبل النشر</h2>
              <p className="text-gray-400 text-sm">Future Video Simulator</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-3">
              اكتب السكربت أو الفكرة المقترحة
            </label>
            <textarea
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              placeholder="مثال: في هذا الفيديو سأشرح 3 أخطاء شائعة يقع فيها صناع المحتوى المبتدئين..."
              className="w-full h-40 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!scriptInput.trim() || isAnalyzing}
            className={`w-full px-6 py-4 rounded-xl font-semibold transition-all ${
              scriptInput.trim() && !isAnalyzing
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحليل بالذكاء الاصطناعي...
              </span>
            ) : (
              'تحليل احتمالية النجاح'
            )}
          </button>

          {/* Prediction Results */}
          {prediction && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              
              {/* Success Probability */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="text-center mb-4">
                  <div className="text-gray-400 mb-2">احتمالية النجاح</div>
                  <div className={`text-6xl font-bold ${getSuccessProbabilityColor(prediction.successProbabilityPercentage)}`}>
                    {prediction.successProbabilityPercentage}%
                  </div>
                </div>
                
                <div className="h-4 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getSuccessProbabilityGradient(prediction.successProbabilityPercentage)} transition-all duration-1000`}
                    style={{ width: `${prediction.successProbabilityPercentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">المشاهدات المتوقعة</div>
                    <div className="text-white font-semibold">
                      {prediction.predictedMetrics.estimatedViews.min.toLocaleString()} - {prediction.predictedMetrics.estimatedViews.max.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">نسبة الإكمال المتوقعة</div>
                    <div className="text-white font-semibold">
                      {prediction.predictedMetrics.estimatedCompletionRate.min}% - {prediction.predictedMetrics.estimatedCompletionRate.max}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              {prediction.riskFactors.length > 0 && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                  <h3 className="text-red-200 font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    عوامل الخطر المكتشفة
                  </h3>
                  <div className="space-y-3">
                    {prediction.riskFactors.map((risk, i) => (
                      <div key={i} className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-red-100 font-medium">{risk.description}</div>
                          <span className={`px-2 py-1 rounded-lg text-xs ${
                            risk.severity === 'critical' ? 'bg-red-500 text-white' :
                            risk.severity === 'high' ? 'bg-orange-500 text-white' :
                            'bg-yellow-500 text-black'
                          }`}>
                            {risk.severity === 'critical' && 'حرج'}
                            {risk.severity === 'high' && 'عالي'}
                            {risk.severity === 'medium' && 'متوسط'}
                            {risk.severity === 'low' && 'منخفض'}
                          </span>
                        </div>
                        <div className="text-red-200 text-sm">💡 {risk.suggestion}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
                <h3 className="text-blue-200 font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  التوصية التنفيذية
                </h3>
                <p className="text-blue-100 whitespace-pre-line leading-relaxed">
                  {prediction.structuralActionableRecommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
