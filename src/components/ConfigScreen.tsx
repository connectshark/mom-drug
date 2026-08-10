import React from 'react';
import { QuizConfig, MainCategory, SubCategory } from '../types';
import { CATEGORY_LABELS, QUESTIONS_DATA } from '../data/questions';
import { filterQuestions } from '../utils/quizHelper';
import { Play, Timer, Sparkles, Clock, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

interface ConfigScreenProps {
  config: QuizConfig;
  setConfig: React.Dispatch<React.SetStateAction<QuizConfig>>;
  onStartQuiz: () => void;
  textSizeClass: string;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({
  config,
  setConfig,
  onStartQuiz,
  textSizeClass,
}) => {
  const filteredCount = filterQuestions(config.mainCategoryFilter, config.subCategoryFilter).length;

  const handleMainCategoryChange = (val: 'ALL' | MainCategory) => {
    setConfig((prev) => ({
      ...prev,
      mainCategoryFilter: val,
      subCategoryFilter: 'ALL', // Reset subcategory when main category changes
    }));
  };

  const handleSubCategoryChange = (val: 'ALL' | SubCategory) => {
    setConfig((prev) => ({
      ...prev,
      subCategoryFilter: val,
    }));
  };

  const handleQuestionCountClick = (count: number) => {
    setConfig((prev) => ({
      ...prev,
      questionCount: Math.min(count, filteredCount),
    }));
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 sm:py-8 ${textSizeClass}`}>
      {/* Banner / Welcome Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-white mb-8 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-pink-500/20 border border-pink-300/40 text-pink-100 text-xs sm:text-sm px-3 py-1 rounded-full mb-3 font-bold">
            <Award className="w-4 h-4 text-amber-300" />
            <span>桃園市政府衛生局 115 年長者樂活用藥健康競賽指定題庫</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            隨機抽題測驗與練習產生器
          </h2>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
            收錄全庫共 <strong className="text-amber-300 font-extrabold">{QUESTIONS_DATA.length} 題</strong> 官方標準宣導單選題。您可以自訂抽取題數與 10 秒限時挑戰，隨時自我測驗、即時統計成績並進行深度答題檢討！
          </p>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-white p-6 sm:p-8 space-y-8">
        
        {/* Section 1: Question Source / Category Selection */}
        <div>
          <div className="flex items-center space-x-2 text-slate-800 font-black text-lg mb-4 border-b-2 border-slate-100 pb-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
              1
            </span>
            <h3>選擇測驗主題類別</h3>
            <span className="text-xs text-slate-500 font-bold ml-auto">
              (符合條件題目共 {filteredCount} 題)
            </span>
          </div>

          {/* Main Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleMainCategoryChange('ALL')}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                config.mainCategoryFilter === 'ALL'
                  ? 'bg-indigo-50 border-4 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-black shadow-md'
                  : 'bg-slate-50 border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
              id="cat-btn-all"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-base font-bold">全部主題題庫</span>
                {config.mainCategoryFilter === 'ALL' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 font-medium">包含藥品安全與衛生局政令宣導全 175 題</p>
            </button>

            <button
              type="button"
              onClick={() => handleMainCategoryChange('藥品主題')}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                config.mainCategoryFilter === '藥品主題'
                  ? 'bg-indigo-50 border-4 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-black shadow-md'
                  : 'bg-slate-50 border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
              id="cat-btn-medicine"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-base font-bold">一、藥品主題</span>
                {config.mainCategoryFilter === '藥品主題' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 font-medium">中西藥併用、慢性病藥駕、保存等 103 題</p>
            </button>

            <button
              type="button"
              onClick={() => handleMainCategoryChange('衛生局政令宣導')}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                config.mainCategoryFilter === '衛生局政令宣導'
                  ? 'bg-indigo-50 border-4 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-black shadow-md'
                  : 'bg-slate-50 border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
              id="cat-btn-health"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-base font-bold">二、政令宣導主題</span>
                {config.mainCategoryFilter === '衛生局政令宣導' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 font-medium">心理健康、食安、長照、疾病防治 72 題</p>
            </button>
          </div>

          {/* Subcategories */}
          {config.mainCategoryFilter === '衛生局政令宣導' && (
            <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
              <span className="text-xs font-black text-slate-700 block mb-2">精準子分類篩選：</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSubCategoryChange('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    config.subCategoryFilter === 'ALL'
                      ? 'bg-indigo-600 text-white border-2 border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  政令全題 (72題)
                </button>
                {(['心理健康', '長照', '食安', '疾病防治', '健康促進', '其他'] as SubCategory[]).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubCategoryChange(sub)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      config.subCategoryFilter === sub
                        ? 'bg-indigo-600 text-white border-2 border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {CATEGORY_LABELS[sub] || sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Question Count */}
        <div>
          <div className="flex items-center space-x-2 text-slate-800 font-black text-lg mb-4 border-b-2 border-slate-100 pb-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
              2
            </span>
            <h3>隨機抽取題目數量 (預設 5 題)</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            {[5, 10, 20, 30, 50].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleQuestionCountClick(num)}
                disabled={num > filteredCount}
                className={`px-4 py-2.5 rounded-xl font-black border-2 transition-all cursor-pointer ${
                  config.questionCount === num
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                    : num > filteredCount
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                }`}
                id={`count-chip-${num}`}
              >
                {num} 題
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleQuestionCountClick(filteredCount)}
              className={`px-4 py-2.5 rounded-xl font-black border-2 transition-all cursor-pointer ${
                config.questionCount === filteredCount
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
              }`}
              id="count-chip-all"
            >
              抽取全部 ({filteredCount} 題)
            </button>
          </div>

          {/* Custom Question Count Input */}
          <div className="flex items-center space-x-3 mt-3">
            <span className="text-xs sm:text-sm text-slate-700 font-bold">或自訂題目數量：</span>
            <input
              type="number"
              min={1}
              max={filteredCount}
              value={config.questionCount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 1;
                setConfig((prev) => ({
                  ...prev,
                  questionCount: Math.min(Math.max(1, val), filteredCount),
                }));
              }}
              className="w-24 px-3 py-1.5 border-2 border-slate-300 rounded-xl text-center font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              id="input-custom-count"
            />
            <span className="text-xs text-slate-500 font-medium">題 (最多 {filteredCount} 題)</span>
          </div>
        </div>

        {/* Section 3: Countdown Timer & Exam Mode Settings */}
        <div>
          <div className="flex items-center space-x-2 text-slate-800 font-black text-lg mb-4 border-b-2 border-slate-100 pb-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
              3
            </span>
            <h3>計時與作答模式設定</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timer Toggle Card */}
            <div className="bg-orange-50/90 border-2 border-orange-200 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2 text-orange-900 font-black">
                  <Timer className="w-5 h-5 text-orange-500" />
                  <span>每題限時倒數作答</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableTimer}
                    onChange={(e) => setConfig((prev) => ({ ...prev, enableTimer: e.target.checked }))}
                    className="sr-only peer"
                    id="toggle-timer-enabled"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>

              {config.enableTimer ? (
                <div>
                  <p className="text-xs text-orange-900 font-medium mb-2">預設每題倒數 10 秒（逾時自動跳下一題）：</p>
                  <div className="flex space-x-2">
                    {[5, 10, 15, 30].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, timerDurationSeconds: sec }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                          config.timerDurationSeconds === sec
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-white text-slate-700 border-orange-200 hover:bg-orange-100'
                        }`}
                        id={`btn-timer-sec-${sec}`}
                      >
                        {sec} 秒
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-medium">已關閉倒數計時，您可以不限時間安心思考作答。</p>
              )}
            </div>

            {/* Answer Reveal Mode */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-slate-800 font-black mb-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span>解答顯示模式</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mb-3">選擇要在選定後立即看解答衛教說明，或是在測驗結束後統一檢討：</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, showInstantAnswer: false }))}
                  className={`py-2 px-3 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    !config.showInstantAnswer
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="mode-exam-btn"
                >
                  📝 模擬正式測驗 (最後統一檢討)
                </button>
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, showInstantAnswer: true }))}
                  className={`py-2 px-3 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    config.showInstantAnswer
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="mode-instant-btn"
                >
                  💡 即時顯示答案與解析 (邊做邊學)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button & Summary Box */}
        <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-indigo-950 font-bold">
            <span className="bg-white px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs">
              主題：<strong>{CATEGORY_LABELS[config.subCategoryFilter !== 'ALL' ? config.subCategoryFilter : config.mainCategoryFilter] || '全庫題庫'}</strong>
            </span>
            <span className="bg-white px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs">
              題數：<strong className="text-indigo-600 font-extrabold">{config.questionCount} 題</strong>
            </span>
            <span className="bg-white px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs">
              計時：<strong>{config.enableTimer ? `每題 ${config.timerDurationSeconds} 秒` : '無時間限制'}</strong>
            </span>
          </div>

          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg sm:text-xl font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all transform active:scale-98 flex items-center justify-center space-x-3 mx-auto cursor-pointer"
            id="btn-start-quiz"
          >
            <Play className="w-6 h-6 fill-current text-white" />
            <span>開始隨機測驗 ({config.questionCount} 題)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
