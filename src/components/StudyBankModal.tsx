import React, { useState, useMemo } from 'react';
import { QUESTIONS_DATA, CATEGORY_LABELS } from '../data/questions';
import { MainCategory, SubCategory } from '../types';
import { SpeechService } from '../utils/audio';
import { Search, BookOpen, Volume2, X, ChevronDown, ChevronUp, CheckCircle2, Filter } from 'lucide-react';

interface StudyBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  textSizeClass: string;
}

export const StudyBankModal: React.FC<StudyBankModalProps> = ({
  isOpen,
  onClose,
  textSizeClass,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCat, setSelectedMainCat] = useState<'ALL' | MainCategory>('ALL');
  const [selectedSubCat, setSelectedSubCat] = useState<'ALL' | SubCategory>('ALL');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      if (selectedMainCat !== 'ALL' && q.mainCategory !== selectedMainCat) {
        return false;
      }
      if (selectedSubCat !== 'ALL' && q.subCategory !== selectedSubCat) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchQ = q.question.toLowerCase().includes(term);
        const matchOpts = q.options.some((opt) => opt.toLowerCase().includes(term));
        const matchExp = q.explanation?.toLowerCase().includes(term);
        return matchQ || matchOpts || matchExp;
      }
      return true;
    });
  }, [selectedMainCat, selectedSubCat, searchTerm]);

  if (!isOpen) return null;

  const toggleExpand = (id: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const next: Record<number, boolean> = {};
    filteredQuestions.forEach((q) => {
      next[q.id] = true;
    });
    setExpandedQuestions(next);
  };

  const collapseAll = () => {
    setExpandedQuestions({});
  };

  const handleReadQuestion = (q: typeof QUESTIONS_DATA[0]) => {
    if (speakingId === q.id) {
      SpeechService.stop();
      setSpeakingId(null);
      return;
    }

    const textToSpeak = `第 ${q.id} 題：${q.question}。選項一：${q.options[0]}。選項二：${q.options[1]}。選項三：${q.options[2]}。選項四：${q.options[3]}。正確答案為選項 ${q.answer}。`;

    setSpeakingId(q.id);
    SpeechService.speak(textToSpeak, () => setSpeakingId(null));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
      <div className={`bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border-4 border-indigo-100 overflow-hidden ${textSizeClass}`}>
        {/* Modal Header */}
        <div className="bg-indigo-600 text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
              <BookOpen className="w-6 h-6 text-pink-200" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">115 年公開題庫全覽與關鍵字搜尋</h2>
              <p className="text-xs text-indigo-100 font-bold">收錄共 {QUESTIONS_DATA.length} 題官方競賽標題與詳解說明</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-indigo-700/80 text-white hover:bg-indigo-800 transition-colors cursor-pointer"
            id="btn-close-study-bank"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-indigo-50/60 border-b-2 border-indigo-100 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="搜尋關鍵字 (例如：安眠藥、降血壓、健保卡、1966、食安)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-300 rounded-xl text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="input-search-bank"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-full px-2 py-0.5 cursor-pointer"
                >
                  清除
                </button>
              )}
            </div>

            {/* Main Category Dropdown */}
            <select
              value={selectedMainCat}
              onChange={(e) => {
                setSelectedMainCat(e.target.value as 'ALL' | MainCategory);
                setSelectedSubCat('ALL');
              }}
              className="px-3 py-2 border-2 border-slate-300 rounded-xl text-sm bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="select-main-cat"
            >
              <option value="ALL">全部大類 ({QUESTIONS_DATA.length}題)</option>
              <option value="藥品主題">一、藥品主題 (101題)</option>
              <option value="衛生局政令宣導">二、政令宣導主題 (71題)</option>
            </select>

            {/* Sub Category Dropdown if 政令宣導 */}
            {selectedMainCat === '衛生局政令宣導' && (
              <select
                value={selectedSubCat}
                onChange={(e) => setSelectedSubCat(e.target.value as 'ALL' | SubCategory)}
                className="px-3 py-2 border-2 border-slate-300 rounded-xl text-sm bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="select-sub-cat"
              >
                <option value="ALL">全部子主題 (71題)</option>
                <option value="心理健康">心理健康</option>
                <option value="長照">長照服務</option>
                <option value="食安">食品安全</option>
                <option value="疾病防治">疾病防治</option>
                <option value="健康促進">健康促進</option>
                <option value="其他">其他宣導</option>
              </select>
            )}
          </div>

          {/* Quick Actions & Counter */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>
              搜尋結果：共 <strong className="text-indigo-600 font-extrabold">{filteredQuestions.length}</strong> 題
            </span>
            <div className="space-x-3">
              <button
                onClick={expandAll}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                展開全部答案解析
              </button>
              <span>•</span>
              <button
                onClick={collapseAll}
                className="text-slate-600 hover:underline cursor-pointer"
              >
                收合答案解析
              </button>
            </div>
          </div>
        </div>

        {/* Questions Scrollable List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-base text-slate-600">找不到符合搜尋條件的題目</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">請嘗試縮短或更換關鍵字重新搜尋。</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isExpanded = !!expandedQuestions[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs hover:border-indigo-300 transition-colors"
                  id={`bank-item-${q.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                        #{q.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {q.mainCategory} • {q.subCategory}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReadQuestion(q)}
                      className={`p-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border-2 transition-all cursor-pointer ${
                        speakingId === q.id
                          ? 'bg-amber-500 text-white border-amber-500 animate-pulse'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                      }`}
                      title="朗讀本題"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-3 leading-snug">
                    {q.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, idx) => {
                      const optNum = idx + 1;
                      const isCorrect = q.answer === optNum;

                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border-2 text-xs sm:text-sm flex items-start space-x-2 ${
                            isCorrect && isExpanded
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                              : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
                          }`}
                        >
                          <span className="font-bold shrink-0">{optNum}.</span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {isCorrect && isExpanded && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Explanation Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{isExpanded ? '隱藏標準答案與衛教說明' : '顯示標準答案與衛教說明'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <span className="text-xs font-black text-slate-600">
                      標準答案：【選項 ({q.answer})】
                    </span>
                  </div>

                  {/* Collapsible Explanation Box */}
                  {isExpanded && (
                    <div className="mt-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3.5 text-xs sm:text-sm text-indigo-950 leading-relaxed">
                      <strong className="font-black block mb-1">💡 樂活用藥與健康解析：</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t-2 border-slate-200 p-4 flex justify-between items-center text-xs text-slate-600 font-bold shrink-0">
          <span>提示：考前多複習全題庫可以快速提升分數喔！</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
