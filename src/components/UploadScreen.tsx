// ===================================================================
// AI DOMINATOR - Screenshot Upload & Processing Screen
// Vision AI Integration for Metrics Extraction
// ===================================================================

import React, { useState, useCallback } from 'react';
import { visionAI } from '../services/visionAI';
import { dataStore } from '../services/dataStore';
import { VideoMetrics } from '../types';

interface UploadScreenProps {
  creatorId: string;
  onMetricsUploaded: () => void;
  onNavigate: (screen: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ 
  creatorId, 
  onMetricsUploaded,
  onNavigate 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedMetrics, setExtractedMetrics] = useState<Partial<VideoMetrics> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(f => f.type.startsWith('image/'));

    if (imageFile) {
      await processImage(imageFile);
    } else {
      setError('الرجاء رفع ملف صورة فقط');
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;

        // Extract metrics using Vision AI
        const result = await visionAI.extractMetricsFromScreenshot(imageData);

        setUploadProgress(100);
        clearInterval(progressInterval);

        // Display extracted metrics for confirmation
        setExtractedMetrics({
          views: result.views,
          likes: result.likes,
          comments: result.comments,
          shares: result.shares,
          saves: result.saves,
          watchTimeSeconds: result.watchTimeSeconds,
          completionRatePercentage: result.completionRatePercentage
        });
      };

      reader.readAsDataURL(file);

    } catch (err) {
      setError('فشل في معالجة الصورة. حاول مرة أخرى.');
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleConfirmMetrics = async () => {
    if (!extractedMetrics) return;

    setIsProcessing(true);

    try {
      // Create video record
      const video = await dataStore.createVideo(
        creatorId,
        `tiktok_${Date.now()}`,
        new Date()
      );

      // Save metrics
      await dataStore.saveMetrics(video.id, extractedMetrics);

      // Reset state
      setExtractedMetrics(null);
      setIsProcessing(false);
      setUploadProgress(0);

      // Notify parent
      onMetricsUploaded();

    } catch (err) {
      setError('فشل في حفظ البيانات');
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleEditMetric = (key: keyof VideoMetrics, value: number) => {
    if (!extractedMetrics) return;
    setExtractedMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        
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
          <h1 className="text-3xl font-bold text-white mb-2">رفع بيانات الفيديو</h1>
          <p className="text-gray-400">قم برفع لقطة شاشة من تحليلات تيك توك</p>
        </div>

        {/* Upload Area */}
        {!extractedMetrics && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                : 'border-gray-700 bg-gray-900/30'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />

            {!isProcessing ? (
              <div className="pointer-events-none">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  اسحب الصورة هنا أو اضغط للرفع
                </h3>
                <p className="text-gray-400 mb-6">
                  نقبل PNG, JPG, JPEG
                </p>
                <div className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium">
                  اختر الصورة
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white font-medium mb-2">جاري المعالجة بالذكاء الاصطناعي...</p>
                <p className="text-gray-400 text-sm mb-4">استخراج البيانات من الصورة</p>
                
                {/* Progress Bar */}
                <div className="max-w-xs mx-auto">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-2">{uploadProgress}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extracted Metrics Review */}
        {extractedMetrics && !isProcessing && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">تأكيد البيانات</h2>
                <p className="text-gray-400">راجع البيانات المستخرجة وعدّل إذا لزم الأمر</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Views */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm text-gray-400 mb-2">المشاهدات</label>
                <input
                  type="number"
                  value={extractedMetrics.views || 0}
                  onChange={(e) => handleEditMetric('views', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Likes */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm text-gray-400 mb-2">الإعجابات</label>
                <input
                  type="number"
                  value={extractedMetrics.likes || 0}
                  onChange={(e) => handleEditMetric('likes', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Comments */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm text-gray-400 mb-2">التعليقات</label>
                <input
                  type="number"
                  value={extractedMetrics.comments || 0}
                  onChange={(e) => handleEditMetric('comments', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Shares */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm text-gray-400 mb-2">المشاركات</label>
                <input
                  type="number"
                  value={extractedMetrics.shares || 0}
                  onChange={(e) => handleEditMetric('shares', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Saves */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm text-gray-400 mb-2">الحفظ</label>
                <input
                  type="number"
                  value={extractedMetrics.saves || 0}
                  onChange={(e) => handleEditMetric('saves', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Completion Rate */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm text-gray-400 mb-2">نسبة الإكمال (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={extractedMetrics.completionRatePercentage || 0}
                  onChange={(e) => handleEditMetric('completionRatePercentage', parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setExtractedMetrics(null)}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmMetrics}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                تأكيد وحفظ البيانات
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-500/50 rounded-xl p-4 animate-fadeIn">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-900/30 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            كيفية الحصول على لقطة الشاشة من تيك توك
          </h3>
          <ol className="text-gray-400 space-y-2 list-decimal list-inside">
            <li>افتح تطبيق تيك توك وانتقل إلى الفيديو المطلوب</li>
            <li>اضغط على أيقونة الثلاث نقاط (⋯) واختر "Analytics"</li>
            <li>التقط لقطة شاشة تحتوي على جميع الأرقام (المشاهدات، الإعجابات، التعليقات، إلخ)</li>
            <li>ارفع الصورة هنا وسيقوم الذكاء الاصطناعي باستخراج البيانات تلقائياً</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
