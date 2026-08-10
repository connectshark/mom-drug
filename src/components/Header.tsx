import React from 'react';
import { Pill, Volume2, VolumeX, Type, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  textSize: 'normal' | 'large' | 'xlarge';
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  enableSound: boolean;
  setEnableSound: (enable: boolean) => void;
  onOpenStudyBank: () => void;
  onResetToConfig: () => void;
  currentMode: string;
}

export const Header: React.FC<HeaderProps> = ({
  textSize,
  setTextSize,
  enableSound,
  setEnableSound,
  onOpenStudyBank,
  onResetToConfig,
  currentMode,
}) => {
  return (
    <header className="bg-white border-b-4 border-indigo-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Title & Badge */}
        <div 
          onClick={onResetToConfig}
          className="flex items-center space-x-3 cursor-pointer hover:opacity-95 transition-opacity"
          id="app-header-title"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-pink-100 text-pink-600 font-bold border border-pink-200 text-xs px-2.5 py-0.5 rounded-full">
                115年桃園市
              </span>
              <span className="text-xs text-indigo-700 font-bold hidden sm:inline">
                長者樂活用藥與健康競賽
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-indigo-950 leading-tight">
              用藥與健康知識題庫測驗器
            </h1>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
          {/* Font Size Adjuster for Elderly */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border-2 border-slate-200">
            <span className="text-xs text-slate-500 px-1.5 flex items-center font-bold hidden md:inline">
              <Type className="w-3.5 h-3.5 mr-1 text-indigo-600" /> 字體
            </span>
            <button
              onClick={() => setTextSize('normal')}
              className={`px-2.5 py-1 text-xs rounded-lg font-extrabold transition-all ${
                textSize === 'normal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60'
              }`}
              title="標準字體"
              id="btn-font-normal"
            >
              小
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-2.5 py-1 text-xs rounded-lg font-extrabold transition-all ${
                textSize === 'large'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60'
              }`}
              title="大字體 (適合長者)"
              id="btn-font-large"
            >
              中
            </button>
            <button
              onClick={() => setTextSize('xlarge')}
              className={`px-2.5 py-1 text-xs rounded-lg font-extrabold transition-all ${
                textSize === 'xlarge'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60'
              }`}
              title="特大字體"
              id="btn-font-xlarge"
            >
              大
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setEnableSound(!enableSound)}
            className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${
              enableSound
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={enableSound ? '已開啟提示音' : '已靜音'}
            id="btn-toggle-sound"
          >
            {enableSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Study Bank Shortcut */}
          <button
            onClick={onOpenStudyBank}
            className={`px-3.5 py-1.5 rounded-xl border-2 text-xs sm:text-sm font-black flex items-center space-x-1.5 transition-all shadow-md ${
              currentMode === 'STUDY_BANK'
                ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-amber-200'
                : 'bg-pink-500 hover:bg-pink-600 text-white border-pink-400 shadow-pink-200'
            }`}
            id="btn-open-study-bank"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden xs:inline">瀏覽全題庫</span>
          </button>

          {/* Home / Reset */}
          {currentMode !== 'CONFIG' && (
            <button
              onClick={onResetToConfig}
              className="p-2 rounded-xl bg-slate-100 border-2 border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-200 transition-all"
              title="返回設定頁"
              id="btn-reset-config"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
