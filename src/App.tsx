import React, { useState } from 'react';
import { AppMode, QuizConfig, QuizResult, Question } from './types';
import { generateRandomQuizQuestions } from './utils/quizHelper';
import { Header } from './components/Header';
import { ConfigScreen } from './components/ConfigScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { StudyBankModal } from './components/StudyBankModal';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('CONFIG');
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('large'); // Default 'large' for senior readability
  const [enableSound, setEnableSound] = useState<boolean>(true);

  // Default quiz settings: 10s timer enabled, 5 questions
  const [config, setConfig] = useState<QuizConfig>({
    mainCategoryFilter: 'ALL',
    subCategoryFilter: 'ALL',
    questionCount: 5, // Default 5 questions as required
    enableTimer: true, // Default 10s timer enabled as requested
    timerDurationSeconds: 10, // Default 10s
    showInstantAnswer: false, // Default exam mode with final review
  });

  // Active quiz state
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isStudyBankOpen, setIsStudyBankOpen] = useState<boolean>(false);

  // Text size styling class
  const textSizeClass = 
    textSize === 'xlarge'
      ? 'text-lg sm:text-xl'
      : textSize === 'large'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  // Start new random quiz
  const handleStartQuiz = () => {
    const picked = generateRandomQuizQuestions(config);
    setCurrentQuestions(picked);
    setAppMode('QUIZ');
  };

  // Complete quiz and view results
  const handleFinishQuiz = (result: QuizResult) => {
    setQuizResult(result);
    setAppMode('RESULT');
  };

  // Restart quiz with identical settings
  const handleRestartSameQuiz = () => {
    handleStartQuiz();
  };

  // Reset back to config screen
  const handleResetToConfig = () => {
    setAppMode('CONFIG');
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] text-slate-800 font-sans flex flex-col antialiased selection:bg-indigo-200">
      <Header
        textSize={textSize}
        setTextSize={setTextSize}
        enableSound={enableSound}
        setEnableSound={setEnableSound}
        onOpenStudyBank={() => setIsStudyBankOpen(true)}
        onResetToConfig={handleResetToConfig}
        currentMode={appMode}
      />

      <main className="flex-1 pb-12">
        {appMode === 'CONFIG' && (
          <ConfigScreen
            config={config}
            setConfig={setConfig}
            onStartQuiz={handleStartQuiz}
            textSizeClass={textSizeClass}
          />
        )}

        {appMode === 'QUIZ' && currentQuestions.length > 0 && (
          <QuizScreen
            questions={currentQuestions}
            config={config}
            enableSound={enableSound}
            textSizeClass={textSizeClass}
            onFinishQuiz={handleFinishQuiz}
            onCancelQuiz={handleResetToConfig}
          />
        )}

        {appMode === 'RESULT' && quizResult && (
          <ResultScreen
            result={quizResult}
            onRestartSameQuiz={handleRestartSameQuiz}
            onResetToConfig={handleResetToConfig}
            onOpenStudyBank={() => setIsStudyBankOpen(true)}
            textSizeClass={textSizeClass}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-indigo-100 py-4 text-center text-xs text-slate-500 font-medium shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>115 年桃園市長者樂活用藥與健康知識競賽題庫測驗器</span>
          <span>資料來源：桃園市政府衛生局 公開題庫 (175題)</span>
        </div>
      </footer>

      {/* Study Bank Modal */}
      <StudyBankModal
        isOpen={isStudyBankOpen}
        onClose={() => setIsStudyBankOpen(false)}
        textSizeClass={textSizeClass}
      />
    </div>
  );
}
