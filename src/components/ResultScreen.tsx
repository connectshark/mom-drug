import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizResult, UserAnswer } from '../types';
import { formatTime, getPerformanceBadge } from '../utils/quizHelper';
import { 
  Award, RotateCcw, Sliders, BookOpen, CheckCircle2, XCircle, 
  Clock, ShieldCheck, Filter, ArrowUpRight, Check, AlertCircle 
} from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  onRestartSameQuiz: () => void;
  onResetToConfig: () => void;
  onOpenStudyBank: () => void;
  textSizeClass: string;
}

type FilterType = 'ALL' | 'WRONG' | 'CORRECT' | 'TIMED_OUT';

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRestartSameQuiz,
  onResetToConfig,
  onOpenStudyBank,
  textSizeClass,
}) => {
  const [reviewFilter, setReviewFilter] = useState<FilterType>('ALL');

  const { score, correctCount, wrongCount, timedOutCount, totalQuestions, totalTimeSpentSeconds, userAnswers } = result;
  const badgeInfo = getPerformanceBadge(score);

  // Trigger confetti for high score
  useEffect(() => {
    if (score >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // Fallback gracefully if confetti fails
      }
    }
  }, [score]);

  // Filter user answers for review
  const filteredAnswers = userAnswers.filter((item) => {
    if (reviewFilter === 'WRONG') return !item.isCorrect && !item.timedOut;
    if (reviewFilter === 'CORRECT') return item.isCorrect;
    if (reviewFilter === 'TIMED_OUT') return item.timedOut;
    return true;
  });

  const avgTimePerQuestion = Math.round(totalTimeSpentSeconds / totalQuestions);

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${textSizeClass}`}>
      {/* Top Score Summary Banner */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 text-center relative border-b-4 border-indigo-200">
          <div className="inline-flex items-center space-x-2 bg-pink-500/20 px-3 py-1 rounded-full text-pink-100 text-xs sm:text-sm font-bold mb-3 border border-pink-300/30">
            <Award className="w-4 h-4 text-amber-300" />
            <span>測驗完成！成績即時統計報告</span>
          </div>

          <div className="my-2">
            <div className="text-5xl sm:text-6xl font-black tracking-tight text-white inline-flex items-baseline">
              <span>{score}</span>
              <span className="text-xl sm:text-2xl font-bold text-pink-200 ml-1">分</span>
            </div>
          </div>

          <div className="mt-3">
            <span
              className={`inline-block px-4 py-1.5 rounded-full font-black text-sm sm:text-base border-2 ${badgeInfo.color} shadow-sm`}
            >
              {badgeInfo.badge} — {badgeInfo.title}
            </span>
          </div>

          <p className="text-indigo-100/90 text-xs sm:text-sm font-medium max-w-lg mx-auto mt-3">
            {badgeInfo.description}
          </p>
        </div>

        {/* Real-Time Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/80">
          <div className="p-3 text-center bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
            <div className="flex items-center justify-center space-x-1 text-emerald-700 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-black">答對題數</span>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {correctCount} <span className="text-xs text-slate-500 font-bold">/ {totalQuestions} 題</span>
            </div>
          </div>

          <div className="p-3 text-center bg-rose-50 border-2 border-rose-200 rounded-2xl">
            <div className="flex items-center justify-center space-x-1 text-rose-600 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-black">答錯題數</span>
            </div>
            <div className="text-2xl font-black text-rose-600">
              {wrongCount} <span className="text-xs text-slate-500 font-bold">題</span>
            </div>
          </div>

          <div className="p-3 text-center bg-orange-50 border-2 border-orange-200 rounded-2xl">
            <div className="flex items-center justify-center space-x-1 text-orange-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-black">逾時未答</span>
            </div>
            <div className="text-2xl font-black text-orange-600">
              {timedOutCount} <span className="text-xs text-slate-500 font-bold">題</span>
            </div>
          </div>

          <div className="p-3 text-center bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
            <div className="flex items-center justify-center space-x-1 text-indigo-700 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-black">總測驗時間</span>
            </div>
            <div className="text-xl font-black text-indigo-950">
              {formatTime(totalTimeSpentSeconds)}
            </div>
            <div className="text-[10px] text-indigo-700 font-bold">平均 {avgTimePerQuestion} 秒 / 題</div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          onClick={onRestartSameQuiz}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 flex items-center space-x-2 transition-all cursor-pointer"
          id="btn-restart-quiz"
        >
          <RotateCcw className="w-4 h-4" />
          <span>再測一次 (相同設定)</span>
        </button>

        <button
          onClick={onResetToConfig}
          className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border-2 border-slate-200 shadow-sm flex items-center space-x-2 transition-all cursor-pointer"
          id="btn-change-config"
        >
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>重新設定範圍與題數</span>
        </button>

        <button
          onClick={onOpenStudyBank}
          className="px-6 py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md shadow-pink-200 flex items-center space-x-2 transition-all cursor-pointer"
          id="btn-result-study-bank"
        >
          <BookOpen className="w-4 h-4" />
          <span>檢視與學習全題庫</span>
        </button>
      </div>

      {/* Detailed Review Section (檢討畫面) */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <span>詳細答題檢討畫面</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">點選下方標籤分類檢視答錯或答對題目的衛教重點說明：</p>
          </div>

          {/* Review Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200 text-xs font-black">
            <button
              onClick={() => setReviewFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                reviewFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部 ({totalQuestions})
            </button>
            <button
              onClick={() => setReviewFilter('WRONG')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                reviewFilter === 'WRONG'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              答錯 ({wrongCount})
            </button>
            <button
              onClick={() => setReviewFilter('CORRECT')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                reviewFilter === 'CORRECT'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              答對 ({correctCount})
            </button>
            {timedOutCount > 0 && (
              <button
                onClick={() => setReviewFilter('TIMED_OUT')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  reviewFilter === 'TIMED_OUT'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600'
                }`}
              >
                逾時未答 ({timedOutCount})
              </button>
            )}
          </div>
        </div>

        {/* Question Review Cards */}
        {filteredAnswers.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-indigo-500 mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm">無符合此篩選條件的題目</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAnswers.map((item, index) => {
              const { question, selectedOption, isCorrect, timedOut, timeSpentSeconds } = item;

              return (
                <div
                  key={index}
                  className={`rounded-2xl border-2 p-5 sm:p-6 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : timedOut
                      ? 'bg-orange-50/50 border-orange-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                  id={`review-item-${index + 1}`}
                >
                  {/* Question Header Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-md">
                        #{question.sectionId}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {question.mainCategory} • {question.subCategory}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-medium">費時 {timeSpentSeconds} 秒</span>
                      {isCorrect ? (
                        <span className="bg-emerald-100 text-emerald-800 border-2 border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-black flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>回答正確</span>
                        </span>
                      ) : timedOut ? (
                        <span className="bg-orange-100 text-orange-800 border-2 border-orange-300 text-xs px-2.5 py-0.5 rounded-full font-black flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>逾時未答</span>
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 border-2 border-rose-300 text-xs px-2.5 py-0.5 rounded-full font-black flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>回答不正確</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mb-4 leading-snug">
                    {question.question}
                  </h4>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {question.options.map((opt, optIdx) => {
                      const optNum = optIdx + 1;
                      const isUserChoice = selectedOption === optNum;
                      const isRightAns = question.answer === optNum;

                      let optBg = 'bg-white border-2 border-slate-200 text-slate-700';
                      if (isRightAns) {
                        optBg = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black ring-1 ring-emerald-500';
                      } else if (isUserChoice && !isCorrect) {
                        optBg = 'bg-rose-100 border-2 border-rose-400 text-rose-950 font-black';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-sm flex items-start space-x-2 ${optBg}`}
                        >
                          <span className="font-black shrink-0">{optNum}.</span>
                          <span className="flex-1 leading-snug font-medium">{opt}</span>
                          {isRightAns && (
                            <span className="text-emerald-800 font-black text-xs bg-emerald-200 px-2 py-0.5 rounded shrink-0">
                              正確答案
                            </span>
                          )}
                          {isUserChoice && !isRightAns && (
                            <span className="text-rose-800 font-black text-xs bg-rose-200 px-2 py-0.5 rounded shrink-0">
                              您的選擇
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Health Rationale / Explanation Box */}
                  <div className="bg-white border-2 border-indigo-100 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong className="text-indigo-800 font-black block mb-1">
                      💡 藥事與健康衛教解析：
                    </strong>
                    {question.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
