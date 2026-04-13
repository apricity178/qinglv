import { useState, useEffect, useCallback } from 'react';
import type { Task, GameMode } from './data/tasks';
import {
  MODE_CONFIG,
  ROMANCE_TASKS, INTIMATE_TASKS, ADVANCED_TASKS, COUPLE_TASKS, ALL_TASKS
} from './data/tasks';

// ─── 粒子背景 ───────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }));
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── 爱心漂浮 ───────────────────────────────────────────────
function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-pink-400/20 text-4xl select-none"
          style={{
            left: `${10 + i * 12}%`,
            bottom: '-10%',
            animationName: 'floatUp',
            animationDuration: `${6 + i * 1.5}s`,
            animationDelay: `${i * 1.2}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        >
          ♥
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-110vh) scale(0.5) rotate(30deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── 模式详情页（玩法说明 + 任务列表） ────────────────────
function ModeDetail({
  mode,
  tasks,
  onStart,
  onBack,
}: {
  mode: GameMode;
  tasks: Task[];
  onStart: () => void;
  onBack: () => void;
}) {
  const cfg = MODE_CONFIG[mode];

  return (
    <div className="flex flex-col h-full animate-bounce-in">
      {/* 顶栏 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="btn-ripple cursor-pointer p-2 rounded-xl glass hover:bg-white/10 transition-colors text-white"
        >
          ← 返回
        </button>
        <h2 className="text-xl font-bold font-fredoka gradient-text">{cfg.emoji} {cfg.label}</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pb-4">
        {/* 玩法说明 */}
        <div className="glass rounded-2xl p-5 border border-white/10">
          <h3 className="text-white font-bold font-fredoka text-base mb-3 flex items-center gap-2">
            <span className="text-lg">📖</span> 玩法说明
          </h3>
          <div className="space-y-2">
            {cfg.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${cfg.color} flex items-center justify-center text-white text-[10px] font-bold mt-0.5`}>
                  {i + 1}
                </span>
                <p className="text-white/70 text-sm leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 任务列表 */}
        <div className="glass rounded-2xl p-5 border border-white/10">
          <h3 className="text-white font-bold font-fredoka text-base mb-3 flex items-center gap-2">
            <span className="text-lg">📋</span> 任务列表
            <span className="text-white/40 text-xs font-normal ml-auto">共 {tasks.length} 个</span>
          </h3>
          <div className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <div className="text-white/40 text-center py-6 text-sm">
                {mode === 'custom' ? '还没有自定义任务，请先去添加' : '暂无任务'}
              </div>
            ) : (
              tasks.map((task, i) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white/50 text-[10px] font-bold group-hover:bg-white/15 transition-colors mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                    {task.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 开始游戏按钮 */}
      <button
        onClick={onStart}
        disabled={tasks.length === 0}
        className="btn-ripple cursor-pointer w-full py-4 rounded-2xl font-bold text-white text-lg
          bg-gradient-to-r ${cfg.color}
          hover:opacity-90
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-300 hover:scale-[1.02]
          shadow-lg mt-4"
      >
        {tasks.length > 0 ? `🎮 开始游戏 (${tasks.length} 个任务)` : '请先添加任务'}
      </button>
    </div>
  );
}

// ─── 模式选择卡片 ─────────────────────────────────────────
function ModeCard({ mode, onSelect }: { mode: GameMode; onSelect: () => void }) {
  const cfg = MODE_CONFIG[mode];
  return (
    <button
      onClick={onSelect}
      className={`
        glass rounded-2xl p-5 text-left transition-all duration-300
        hover:scale-105 cursor-pointer btn-ripple
        border border-white/10 hover:border-white/30
        group relative overflow-hidden
      `}
      style={{ '--glow': cfg.glowColor } as React.CSSProperties}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${cfg.color} opacity-10`} />
      <div className="relative z-10">
        <div className="text-4xl mb-3">{cfg.emoji}</div>
        <div className={`text-lg font-bold font-fredoka bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent`}>
          {cfg.label}
        </div>
        <div className="text-white/50 text-sm mt-1">{cfg.description}</div>
      </div>
    </button>
  );
}

// ─── 单张可翻卡片（5选1阶段，自带翻转动画） ───────────────
function PickableCard({
  task,
  index,
  flipped,
  dimmed,
  onSelect,
}: {
  task: Task | null;
  index: number;
  flipped: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={flipped || dimmed ? undefined : onSelect}
      className={`
        flex-shrink-0 w-[60px] sm:w-[72px] aspect-[3/4]
        rounded-xl cursor-pointer transition-all duration-300
        perspective relative
        ${dimmed ? 'opacity-30 scale-90 pointer-events-none' : 'hover:scale-110'}
        ${!flipped && !dimmed ? 'hover:-translate-y-2' : ''}
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`card-flip relative w-full h-full ${flipped ? 'flipped' : ''} animate-bounce-in`}
        style={{ animationDelay: `${index * 0.1}s` }}>
        {/* 正面（背面花纹） */}
        <div className={`card-face absolute inset-0 rounded-xl glass
          flex flex-col items-center justify-center border border-white/20
          ${flipped ? 'pointer-events-none' : ''}
        `}>
          <div className="text-2xl sm:text-3xl mb-1">🃏</div>
          <div className="text-white/40 text-[10px] font-bold">{index + 1}</div>
          <div className="absolute inset-0 rounded-xl card-pattern opacity-20" />
        </div>
        {/* 背面（任务内容） */}
        <div className="card-face-back absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-900/95 to-purple-900/95 flex items-center justify-center p-2 border border-indigo-400/40">
          <p className="text-white text-[10px] sm:text-xs font-bold text-center leading-tight font-nunito">
            {task?.text}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── 5选1阶段 ─────────────────────────────────────────────
function CardSelection({
  currentPlayer,
  drawnTasks,
  onDraw,
  onConfirm,
}: {
  currentPlayer: 'boy' | 'girl';
  drawnTasks: Task[];
  onDraw: () => void;
  onConfirm: (index: number) => void;
}) {
  const [dealt, setDealt] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleDraw = () => {
    onDraw();
    setDealt(true);
    setFlippedIndex(null);
  };

  const handleRedraw = () => {
    onDraw();
    setFlippedIndex(null);
  };

  // 点击卡牌直接翻开
  const handleCardClick = (index: number) => {
    if (flippedIndex !== null) return; // 已翻开一张
    setFlippedIndex(index);
    // 延迟后自动确认
    setTimeout(() => onConfirm(index), 800);
  };

  if (!dealt || drawnTasks.length === 0) {
    // 初始状态：点击抽取
    return (
      <div className="flex flex-col items-center gap-6">
        <div className={`
          px-6 py-2 rounded-full text-white font-bold text-lg
          bg-gradient-to-r ${currentPlayer === 'boy' ? 'from-blue-500 to-indigo-500' : 'from-pink-500 to-rose-500'}
          shadow-lg
        `}>
          {currentPlayer === 'boy' ? '👦 男生' : '👧 女生'} 的回合
        </div>
        <div className="text-white/50 text-center text-lg">
          点击下方按钮抽取 5 张任务卡
        </div>
        <button
          onClick={handleDraw}
          className="btn-ripple cursor-pointer px-10 py-5 rounded-2xl text-xl font-bold font-fredoka text-white
            bg-gradient-to-r from-indigo-500 to-purple-500
            hover:from-indigo-400 hover:to-purple-400
            transition-all duration-300 hover:scale-105
            shadow-lg shadow-indigo-500/30 animate-glow-pulse"
        >
          🎲 抽取任务
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {/* 当前玩家 */}
      <div className={`
        px-6 py-2 rounded-full text-white font-bold text-lg
        bg-gradient-to-r ${currentPlayer === 'boy' ? 'from-blue-500 to-indigo-500' : 'from-pink-500 to-rose-500'}
        shadow-lg
      `}>
        {currentPlayer === 'boy' ? '👦 男生' : '👧 女生'} 的回合
      </div>

      <div className="text-white/60 text-sm text-center">
        {flippedIndex !== null ? '你的任务是...' : '点击一张卡牌翻开 🤔'}
      </div>

      {/* 5张卡牌横向排列 */}
      <div className="flex justify-center gap-2 sm:gap-3 w-full py-2">
        {drawnTasks.map((task, i) => (
          <PickableCard
            key={`${task.id}-${i}`}
            task={task}
            index={i}
            flipped={flippedIndex === i}
            dimmed={flippedIndex !== null && flippedIndex !== i}
            onSelect={() => handleCardClick(i)}
          />
        ))}
      </div>

      {/* 重新抽牌（仅未翻开或已展示后） */}
      {flippedIndex === null && (
        <button
          onClick={handleRedraw}
          className="btn-ripple cursor-pointer py-2.5 px-6 rounded-xl font-bold text-white text-sm
            bg-white/10 hover:bg-white/20 glass
            transition-all duration-300 hover:scale-105"
        >
          🔄 重新抽牌
        </button>
      )}
    </div>
  );
}

// ─── 任务展示卡（确认后展示最终结果） ─────────────────────────
function TaskRevealCard({
  task,
  currentPlayer,
  onNext,
  onRedraw,
}: {
  task: Task;
  currentPlayer: 'boy' | 'girl';
  onNext: () => void;
  onRedraw: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  const playerColor = currentPlayer === 'boy'
    ? 'from-blue-500 to-indigo-500'
    : 'from-pink-500 to-rose-500';

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      {/* 当前玩家 */}
      <div className={`
        px-6 py-2 rounded-full text-white font-bold text-lg
        bg-gradient-to-r ${playerColor}
        shadow-lg
      `}>
        {currentPlayer === 'boy' ? '👦 男生' : '👧 女生'} 的任务
      </div>

      {/* 任务展示卡片 */}
      <div className={`w-full rounded-3xl bg-gradient-to-br from-indigo-900/90 to-purple-900/90 
        flex items-center justify-center p-8 border border-indigo-400/30 
        shadow-lg shadow-indigo-500/20 ${revealed ? 'animate-bounce-in' : 'opacity-0'}`}>
        <p className="text-white text-xl font-bold text-center leading-relaxed font-nunito">
          {task.text}
        </p>
      </div>

      {/* 操作按钮 */}
      {revealed && (
        <div className="flex gap-3 w-full animate-bounce-in">
          <button
            onClick={onRedraw}
            className="btn-ripple flex-1 cursor-pointer py-3 rounded-xl font-bold text-white text-sm
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-500 hover:to-indigo-500
              transition-all duration-300 hover:scale-105
              shadow-lg shadow-purple-500/20"
          >
            🎲 重新抽5张
          </button>
          <button
            onClick={onNext}
            className="btn-ripple flex-1 cursor-pointer py-3 rounded-xl font-bold text-white text-sm
              bg-gradient-to-r from-emerald-600 to-teal-600
              hover:from-emerald-500 hover:to-teal-500
              transition-all duration-300 hover:scale-105
              shadow-lg shadow-emerald-500/20"
          >
            ✅ 完成轮换
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 自定义任务管理 ────────────────────────────────────────
function CustomTaskManager({
  tasks, onSave, onBack
}: {
  tasks: string[];
  onSave: (tasks: string[]) => void;
  onBack: () => void;
}) {
  const [list, setList] = useState([...tasks]);
  const [input, setInput] = useState('');

  const addTask = () => {
    const t = input.trim();
    if (t) {
      setList(prev => [...prev, t]);
      setInput('');
    }
  };

  const removeTask = (i: number) => {
    setList(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="btn-ripple cursor-pointer p-2 rounded-xl glass hover:bg-white/10 transition-colors text-white"
        >
          ← 返回
        </button>
        <h2 className="text-xl font-bold font-fredoka gradient-text">自定义任务</h2>
      </div>

      {/* 输入区 */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="输入自定义任务..."
          className="flex-1 px-4 py-3 rounded-xl glass text-white placeholder-white/40
            border border-white/20 focus:border-indigo-400 outline-none transition-colors
            text-sm"
        />
        <button
          onClick={addTask}
          className="btn-ripple cursor-pointer px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400
            text-white font-bold transition-colors"
        >
          +添加
        </button>
      </div>

      {/* 任务列表 */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {list.length === 0 && (
          <div className="text-white/40 text-center py-8 text-sm">
            还没有自定义任务，快来添加吧！
          </div>
        )}
        {list.map((t, i) => (
          <div
            key={i}
            className="glass flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10"
          >
            <span className="flex-1 text-white text-sm">{t}</span>
            <button
              onClick={() => removeTask(i)}
              className="cursor-pointer text-red-400 hover:text-red-300 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSave(list)}
        disabled={list.length === 0}
        className="btn-ripple cursor-pointer w-full py-4 rounded-xl font-bold text-white text-lg
          bg-gradient-to-r from-emerald-500 to-teal-500
          hover:from-emerald-400 hover:to-teal-400
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-300 hover:scale-[1.02]"
      >
        保存并开始游戏 ({list.length} 个任务)
      </button>
    </div>
  );
}

// ─── 游戏界面 ─────────────────────────────────────────────
type GamePhase = 'idle' | 'picking' | 'revealed';

function GameScreen({
  mode, tasks, onBack, onDetail
}: {
  mode: GameMode;
  tasks: Task[];
  onBack: () => void;
  onDetail: () => void;
}) {
  const [currentPlayer, setCurrentPlayer] = useState<'boy' | 'girl'>('boy');
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [drawnTasks, setDrawnTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [roundCount, setRoundCount] = useState(0);
  const [history, setHistory] = useState<{ player: string; task: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const cfg = MODE_CONFIG[mode];

  // 抽5张随机任务（不重复）
  const drawFiveTasks = useCallback(() => {
    if (tasks.length === 0) return [];
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(5, tasks.length));
  }, [tasks]);

  const handleDraw = () => {
    const five = drawFiveTasks();
    setDrawnTasks(five);
    setSelectedTask(null);
    setPhase('picking');
  };

  const handlePick = (index: number) => {
    const task = drawnTasks[index];
    setSelectedTask(task);
    setPhase('revealed');
  };

  const handleRedraw = () => {
    // 重新抽5张，进入选择阶段
    const five = drawFiveTasks();
    setDrawnTasks(five);
    setSelectedTask(null);
    setPhase('picking');
  };

  const nextTurn = () => {
    if (selectedTask) {
      setHistory(prev => [{
        player: currentPlayer === 'boy' ? '👦 男生' : '👧 女生',
        task: selectedTask.text,
      }, ...prev.slice(0, 19)]);
    }
    setCurrentPlayer(p => p === 'boy' ? 'girl' : 'boy');
    setRoundCount(r => r + 1);
    setPhase('idle');
    setDrawnTasks([]);
    setSelectedTask(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 顶栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBack}
            className="btn-ripple cursor-pointer p-2 rounded-xl glass hover:bg-white/10 transition-colors text-white text-sm"
          >
            ← 换模式
          </button>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${cfg.color}`}>
          {cfg.emoji} {cfg.label}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn-ripple cursor-pointer p-2 rounded-xl glass hover:bg-white/10 transition-colors text-white text-sm"
          >
            📜 记录
          </button>
          <button
            onClick={onDetail}
            className="btn-ripple cursor-pointer p-2 rounded-xl glass hover:bg-white/10 transition-colors text-white text-sm"
          >
            📖 说明
          </button>
        </div>
      </div>

      {/* 回合数 */}
      <div className="text-center text-white/40 text-sm mb-4">
        第 {roundCount + 1} 轮 · 共完成 {roundCount} 轮
      </div>

      {/* 历史弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4" onClick={() => setShowHistory(false)}>
          <div className="glass-dark rounded-3xl p-5 w-full max-w-sm max-h-[70vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold font-fredoka text-lg">任务记录</h3>
              <button onClick={() => setShowHistory(false)} className="cursor-pointer text-white/60 hover:text-white text-2">×</button>
            </div>
            {history.length === 0
              ? <div className="text-white/40 text-center py-4">还没有完成任何任务</div>
              : history.map((h, i) => (
                <div key={i} className="glass rounded-xl p-3 mb-2">
                  <div className="text-white/60 text-xs mb-1">{h.player}</div>
                  <div className="text-white text-sm">{h.task}</div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* 主游戏区 */}
      <div className="flex-1 flex items-center justify-center">
        {(phase === 'idle' || phase === 'picking') && (
          <CardSelection
            currentPlayer={currentPlayer}
            drawnTasks={drawnTasks}
            onDraw={handleDraw}
            onConfirm={handlePick}
          />
        )}
        {phase === 'revealed' && selectedTask && (
          <TaskRevealCard
            task={selectedTask}
            currentPlayer={currentPlayer}
            onNext={nextTurn}
            onRedraw={handleRedraw}
          />
        )}
      </div>
    </div>
  );
}

// ─── 主应用 ───────────────────────────────────────────────
type Screen = 'home' | 'game' | 'custom-edit' | 'mode-detail';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedMode, setSelectedMode] = useState<GameMode>('romance');
  const [customTasks, setCustomTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('couple-custom-tasks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const saveCustomTasks = (tasks: string[]) => {
    setCustomTasks(tasks);
    localStorage.setItem('couple-custom-tasks', JSON.stringify(tasks));
    setScreen('game');
  };

  const getTaskPool = (mode: GameMode): Task[] => {
    switch (mode) {
      case 'romance': return ROMANCE_TASKS;
      case 'intimate': return INTIMATE_TASKS;
      case 'advanced': return ADVANCED_TASKS;
      case 'couple': return COUPLE_TASKS;
      case 'mixed': return ALL_TASKS;
      case 'custom': return customTasks.map((t, i) => ({ id: 1000 + i, text: t, mode: 'romance' as const }));
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    if (mode === 'custom') {
      setScreen('custom-edit');
    } else {
      setScreen('game');
    }
  };

  const handleModeDetail = (mode: GameMode) => {
    setSelectedMode(mode);
    setScreen('mode-detail');
  };

  return (
    <div className="min-h-screen relative">
      <Stars />
      <FloatingHearts />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-8 pb-8">
        <div className="w-full max-w-sm">

          {/* ── 主页 ── */}
          {screen === 'home' && (
            <div className="flex flex-col gap-6 animate-bounce-in">
              {/* Logo区 */}
              <div className="text-center mb-2">
                <div className="text-5xl mb-3 heartbeat inline-block">💑</div>
                <h1 className="text-4xl font-bold font-fredoka gradient-text leading-tight">
                  情侣小游戏
                </h1>
                <p className="text-white/50 mt-2 text-sm">为你们定制的专属互动时光</p>
              </div>

              {/* 模式网格 */}
              <div className="grid grid-cols-2 gap-3">
                {(['romance', 'intimate', 'advanced', 'couple'] as GameMode[]).map(mode => (
                  <ModeCard key={mode} mode={mode} onSelect={() => handleModeSelect(mode)} />
                ))}
              </div>

              {/* 混合模式 + 自定义模式 */}
              <div className="grid grid-cols-2 gap-3">
                <ModeCard mode="mixed" onSelect={() => handleModeSelect('mixed')} />
                <ModeCard mode="custom" onSelect={() => handleModeSelect('custom')} />
              </div>

              {/* 底部提示 */}
              <p className="text-white/30 text-xs text-center">
                男女轮流抽取任务 · 抽到谁谁执行
              </p>
            </div>
          )}

          {/* ── 游戏界面 ── */}
          {screen === 'game' && (
            <div className="min-h-[85vh] flex flex-col animate-bounce-in">
              <GameScreen
                mode={selectedMode}
                tasks={getTaskPool(selectedMode)}
                onBack={() => setScreen('home')}
                onDetail={() => setScreen('mode-detail')}
              />
            </div>
          )}

          {/* ── 自定义编辑 ── */}
          {screen === 'custom-edit' && (
            <div className="min-h-[85vh] flex flex-col animate-bounce-in">
              <CustomTaskManager
                tasks={customTasks}
                onSave={saveCustomTasks}
                onBack={() => setScreen('home')}
              />
            </div>
          )}

          {/* ── 模式详情（玩法说明 + 任务列表） ── */}
          {screen === 'mode-detail' && (
            <div className="min-h-[85vh] flex flex-col animate-bounce-in">
              <ModeDetail
                mode={selectedMode}
                tasks={getTaskPool(selectedMode)}
                onStart={() => {
                  if (selectedMode === 'custom') {
                    setScreen('custom-edit');
                  } else {
                    setScreen('game');
                  }
                }}
                onBack={() => setScreen('game')}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
