// ===================================================================
// AI DOMINATOR - Onboarding Screen Component
// First-Time User Experience & Profile Creation
// ===================================================================

import React, { useState } from 'react';
import { OnboardingData } from '../types';

interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    email: '',
    niche: '',
    country: '',
    language: 'ar',
    followerCount: 0,
    contentFrequency: 'weekly',
    primaryGoal: 'growth'
  });

  const niches = [
    'تقنية ومراجعات',
    'طبخ وطعام',
    'لياقة وصحة',
    'تعليم وعلوم',
    'كوميديا وترفيه',
    'أزياء وجمال',
    'سفر ومغامرات',
    'أعمال وريادة',
    'فن وإبداع',
    'ألعاب ورياضة إلكترونية'
  ];

  const countries = [
    'السعودية',
    'الإمارات',
    'مصر',
    'الكويت',
    'قطر',
    'البحرين',
    'الأردن',
    'لبنان',
    'المغرب',
    'الجزائر'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            AI DOMINATOR
          </h1>
          <p className="text-gray-400 text-lg">
            نظام التشغيل الذكي لنمو صناع المحتوى
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-12 bg-purple-500' : 
                  s < step ? 'w-8 bg-purple-500/50' : 
                  'w-8 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">مرحباً بك</h2>
                  <p className="text-gray-400">لنبدأ بالمعلومات الأساسية</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    مجال المحتوى (Niche)
                  </label>
                  <select
                    required
                    value={formData.niche}
                    onChange={(e) => updateField('niche', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">اختر المجال</option>
                    {niches.map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      الدولة
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">اختر الدولة</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      اللغة
                    </label>
                    <select
                      required
                      value={formData.language}
                      onChange={(e) => updateField('language', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Channel Stats */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">معلومات القناة</h2>
                  <p className="text-gray-400">ساعدنا في فهم وضعك الحالي</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    عدد المتابعين الحالي
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.followerCount || ''}
                    onChange={(e) => updateField('followerCount', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="مثال: 15000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    معدل النشر
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'daily', label: 'يومي' },
                      { value: 'weekly', label: 'أسبوعي' },
                      { value: 'occasional', label: 'أحياناً' }
                    ].map(freq => (
                      <button
                        key={freq.value}
                        type="button"
                        onClick={() => updateField('contentFrequency', freq.value)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          formData.contentFrequency === freq.value
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الهدف الأساسي
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'growth', label: '📈 النمو السريع', desc: 'زيادة المتابعين' },
                      { value: 'monetization', label: '💰 الربح المالي', desc: 'تحقيق الدخل' },
                      { value: 'branding', label: '🎯 بناء العلامة', desc: 'التأثير والسمعة' },
                      { value: 'education', label: '📚 التعليم', desc: 'نشر المعرفة' }
                    ].map(goal => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => updateField('primaryGoal', goal.value)}
                        className={`p-4 rounded-xl text-right transition-all ${
                          formData.primaryGoal === goal.value
                            ? 'bg-purple-600/20 border-2 border-purple-500'
                            : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
                        }`}
                      >
                        <div className="font-medium text-white mb-1">{goal.label}</div>
                        <div className="text-xs text-gray-400">{goal.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">جاهز للانطلاق! 🚀</h2>
                  <p className="text-gray-400">تأكد من البيانات قبل البدء</p>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6 space-y-4 border border-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">البريد الإلكتروني</span>
                    <span className="text-white font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">المجال</span>
                    <span className="text-white font-medium">{formData.niche}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">الدولة</span>
                    <span className="text-white font-medium">{formData.country}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">المتابعون</span>
                    <span className="text-white font-medium">{formData.followerCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">الهدف</span>
                    <span className="text-white font-medium">
                      {formData.primaryGoal === 'growth' && 'النمو السريع'}
                      {formData.primaryGoal === 'monetization' && 'الربح المالي'}
                      {formData.primaryGoal === 'branding' && 'بناء العلامة'}
                      {formData.primaryGoal === 'education' && 'التعليم'}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                  <p className="text-purple-200 text-sm leading-relaxed">
                    💡 <strong>نصيحة:</strong> للحصول على تحليل دقيق، قم برفع بيانات آخر 10-15 فيديو على الأقل.
                    كلما زادت البيانات، كلما كانت التوصيات أكثر دقة وتخصيصاً.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all"
                >
                  السابق
                </button>
              )}
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02]"
              >
                {step < 3 ? 'التالي' : 'ابدأ الآن'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          بتسجيلك، أنت توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </div>
    </div>
  );
};
