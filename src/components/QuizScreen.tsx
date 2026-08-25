import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, QuizConfig, UserAnswer, QuizResult } from '../types';
import { SoundEffects, SpeechService } from '../utils/audio';
import { formatStopwatch, formatTime } from '../utils/quizHelper';
import { 
  Volume2, Pause, Play, ChevronRight, 
  CheckCircle2, XCircle, Clock
} from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  config: QuizConfig;
  enableSound: boolean;
  textSizeClass: string;
  onFinishQuiz: (result: QuizResult) => void;
  onCancelQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  config,
  enableSound,
  textSizeClass,
  onFinishQuiz,
  onCancelQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Complete stopwatch timer (正向計時)
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const [currentQuestionSeconds, setCurrentQuestionSeconds] = useState(0);

  // Store user answers
  const userAnswersRef = useRef<UserAnswer[]>([]);
  const currentQuestionStartTimeRef = useRef<number>(Date.now());
  const stopwatchIntervalRef = useRef<number | null>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Real-time stopwatch ticking every second
  useEffect(() => {
    if (isPaused) {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
      return;
    }

    stopwatchIntervalRef.current = window.setInterval(() => {
      setTotalElapsedSeconds((prev) => prev + 1);
      setCurrentQuestionSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [isPaused]);

  // Handle advancing to the next question or completing the quiz
  const handleNextQuestion = useCallback(
    (chosenOption: number | null) => {
      if (!currentQuestion) return;

      const timeSpent = Math.max(
        1,
        Math.round((Date.now() - currentQuestionStartTimeRef.current) / 1000)
      );

      const isCorrect = chosenOption === currentQuestion.answer;

      if (enableSound) {
        if (isCorrect) {
          SoundEffects.playCorrect();
        } else {
          SoundEffects.playWrong();
        }
      }

      const answerRecord: UserAnswer = {
        question: currentQuestion,
        selectedOption: chosenOption,
        isCorrect,
        timeSpentSeconds: timeSpent,
      };

      userAnswersRef.current.push(answerRecord);

      // Stop any active TTS
      SpeechService.stop();
      setIsSpeaking(false);

      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setCurrentQuestionSeconds(0);
        currentQuestionStartTimeRef.current = Date.now();
      } else {
        // Quiz completed
        const answers = userAnswersRef.current;
        const correctCount = answers.filter((a) => a.isCorrect).length;
        const wrongCount = answers.filter((a) => !a.isCorrect).length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const totalTimeSpentSeconds = answers.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);

        const result: QuizResult = {
          totalQuestions,
          correctCount,
          wrongCount,
          score,
          totalTimeSpentSeconds,
          userAnswers: answers,
          completedAt: new Date(),
        };

        onFinishQuiz(result);
      }
    },
    [
      currentQuestion,
      currentIndex,
      totalQuestions,
      enableSound,
      onFinishQuiz,
    ]
  );

  // Handle option click
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswerSubmitted) return; // Prevent re-selecting

    setSelectedOption(optionIndex);

    if (config.showInstantAnswer) {
      // Show answer explanation first before proceeding
      setIsAnswerSubmitted(true);
    } else {
      // Direct submit in exam mode
      handleNextQuestion(optionIndex);
    }
  };

  // TTS Read aloud question and options
  const handleReadAloud = () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `第 ${currentIndex + 1} 題：${currentQuestion.question}。選項一：${
      currentQuestion.options[0]
    }。選項二：${currentQuestion.options[1]}。選項三：${
      currentQuestion.options[2]
    }。選項四：${currentQuestion.options[3]}。`;

    setIsSpeaking(true);
    SpeechService.speak(textToRead, () => setIsSpeaking(false));
  };

  return (
    <div className={`max-w-3xl mx-auto px-4 py-6 ${textSizeClass}`}>
      {/* Top Header Bar: Progress, Elapsed Stopwatch & Controls */}
      <div className="bg-white rounded-3xl shadow-md border-2 border-indigo-100 p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Category Badges */}
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-black px-3 py-1 rounded-full">
              {currentQuestion.mainCategory}
            </span>
            <span className="bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              {currentQuestion.subCategory}
            </span>
          </div>

          {/* Real-Time Answering Stopwatch Badge */}
          <div className="flex items-center space-x-2 bg-indigo-50 border-2 border-indigo-200 px-3.5 py-1 rounded-2xl text-indigo-950 shadow-xs">
            <Clock className="w-4 h-4 text-indigo-600 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-black">
              作答計時：<strong className="text-indigo-700 text-sm sm:text-base font-black">{formatStopwatch(totalElapsedSeconds)}</strong>
            </span>
            <span className="text-slate-400 text-xs font-bold hidden sm:inline">
              (本題 {currentQuestionSeconds}秒)
            </span>
          </div>

          {/* Pause & Reading Controls */}
          <div className="flex items-center space-x-2 ml-auto sm:ml-0">
            <button
              onClick={handleReadAloud}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 border-2 transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-500 animate-pulse shadow-md'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="朗讀題目與選項"
              id="btn-tts-read"
            >
              <Volume2 className="w-4 h-4 mr-1" />
              <span>{isSpeaking ? '朗讀中...' : '朗讀題干'}</span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border-2 border-slate-200 cursor-pointer"
              title={isPaused ? '繼續' : '暫停'}
              id="btn-pause-quiz"
            >
              {isPaused ? <Play className="w-4 h-4 text-indigo-600" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-black text-slate-600">
            <span>測驗進度</span>
            <span>
              第 <strong className="text-indigo-600 text-sm font-black">{currentIndex + 1}</strong> / {totalQuestions} 題
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Paused Modal Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border-4 border-indigo-100">
            <Pause className="w-12 h-12 text-indigo-600 mx-auto" />
            <h3 className="text-xl font-black text-slate-800">測驗已暫停</h3>
            <p className="text-sm text-slate-600 font-medium">答題計時已凍結，準備好時點選下方按鈕繼續作答。</p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors cursor-pointer"
                id="btn-resume-quiz"
              >
                繼續測驗
              </button>
              <button
                onClick={onCancelQuiz}
                className="w-full py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-xs border border-slate-200 cursor-pointer"
                id="btn-quit-quiz"
              >
                放棄測驗並返回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-white p-6 sm:p-8 mb-6 relative">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold mb-2">
            <span>題號：{currentQuestion.sectionId}</span>
            <span>•</span>
            <span>單選題</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {currentIndex + 1}. {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const optionNum = idx + 1; // 1, 2, 3, 4
            let btnStyle = 'bg-slate-50 hover:bg-indigo-50/70 border-2 border-slate-200 text-slate-800';
            let circleStyle = 'bg-white border-2 border-slate-300 text-slate-600 font-black';

            if (isAnswerSubmitted) {
              if (optionNum === currentQuestion.answer) {
                // Correct answer highlight
                btnStyle = 'bg-emerald-100/90 border-4 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-black';
                circleStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (optionNum === selectedOption) {
                // User wrong option highlight
                btnStyle = 'bg-rose-100 border-4 border-rose-400 text-rose-950 font-black';
                circleStyle = 'bg-rose-500 text-white border-rose-500';
              } else {
                btnStyle = 'bg-slate-50/50 border-2 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (selectedOption === optionNum) {
              btnStyle = 'bg-indigo-100/90 border-4 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-black';
              circleStyle = 'bg-indigo-600 text-white border-indigo-600';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionSelect(optionNum)}
                disabled={isAnswerSubmitted}
                className={`w-full p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all duration-150 cursor-pointer ${btnStyle}`}
                id={`btn-option-${optionNum}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 text-sm transition-colors mt-0.5 ${circleStyle}`}
                >
                  {isAnswerSubmitted && optionNum === currentQuestion.answer ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : isAnswerSubmitted && optionNum === selectedOption ? (
                    <XCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span>{optionNum}</span>
                  )}
                </div>
                <div className="flex-1 font-bold text-base sm:text-lg leading-snug pt-0.5">
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Instant Answer Feedback Banner (if enabled) */}
        {isAnswerSubmitted && (
          <div className="mt-6 pt-5 border-t-2 border-slate-100 space-y-3">
            <div
              className={`p-4 rounded-2xl border-2 flex items-start space-x-3 ${
                selectedOption === currentQuestion.answer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              {selectedOption === currentQuestion.answer ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-black text-base mb-1">
                  {selectedOption === currentQuestion.answer ? '回答正確！' : '回答不正確'}
                </h4>
                <p className="text-sm leading-relaxed font-medium">
                  【正確答案為：選項 ({currentQuestion.answer})】{currentQuestion.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleNextQuestion(selectedOption)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md shadow-indigo-200 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              id="btn-next-question"
            >
              <span>{currentIndex + 1 < totalQuestions ? '下一題' : '查看完整統計成績'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
