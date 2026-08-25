import { Question, QuizConfig, MainCategory, SubCategory } from '../types';
import { QUESTIONS_DATA } from '../data/questions';

export function filterQuestions(
  mainCategoryFilter: 'ALL' | MainCategory,
  subCategoryFilter: 'ALL' | SubCategory
): Question[] {
  return QUESTIONS_DATA.filter((q) => {
    if (mainCategoryFilter !== 'ALL' && q.mainCategory !== mainCategoryFilter) {
      return false;
    }
    if (subCategoryFilter !== 'ALL' && q.subCategory !== subCategoryFilter) {
      return false;
    }
    return true;
  });
}

/**
 * Fisher-Yates random shuffle and pick N questions
 */
export function generateRandomQuizQuestions(config: QuizConfig): Question[] {
  const available = filterQuestions(config.mainCategoryFilter, config.subCategoryFilter);
  const shuffled = [...available];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const count = Math.min(Math.max(1, config.questionCount), shuffled.length);
  return shuffled.slice(0, count);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs} 秒`;
  }
  return `${mins} 分 ${secs} 秒`;
}

export function formatStopwatch(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mStr = String(mins).padStart(2, '0');
  const sStr = String(secs).padStart(2, '0');
  return `${mStr}:${sStr}`;
}

export function getPerformanceBadge(score: number): {
  title: string;
  badge: string;
  color: string;
  description: string;
} {
  if (score === 100) {
    return {
      title: '滿分狀元！',
      badge: '🥇 用藥健保大滿貫',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      description: '太厲害了！完全答對所有題目，用藥與健康知識滿分！'
    };
  } else if (score >= 80) {
    return {
      title: '優秀達人！',
      badge: '🥈 健康用藥小達人',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: '表現相當優異！絕大多數保健與用藥觀念都非常清晰。'
    };
  } else if (score >= 60) {
    return {
      title: '及格通過！',
      badge: '🥉 保健知識新星',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: '順利通過測驗！建議檢討答錯的題目，加強正確用藥觀念喔。'
    };
  } else {
    return {
      title: '加油，再接再厲！',
      badge: '📚 保健學習中',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: '沒關係，多測驗幾次並參考詳細檢討說明，很快就能掌握！'
    };
  }
}
