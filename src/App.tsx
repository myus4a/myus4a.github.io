import { useState, useRef, useEffect } from 'react'
import './App.css'

interface Shot {
  id: number;
  x: number;
  y: number;
  timestamp: Date;
}

interface Session {
  id: number;
  name: string;
  date: Date;
  shots: Shot[];
}

function App() {
  const [currentSession, setCurrentSession] = useState<Session>({
    id: 1,
    name: 'セッション 1',
    date: new Date(),
    shots: []
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const targetRef = useRef<HTMLDivElement>(null);

  // セッションの保存
  const saveSession = () => {
    if (currentSession.shots.length === 0) return;

    setSessions([...sessions, currentSession]);
    setCurrentSession({
      id: currentSession.id + 1,
      name: `セッション ${currentSession.id + 1}`,
      date: new Date(),
      shots: []
    });
  };

  // 的をクリックした時の処理
  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!targetRef.current) return;

    // クリック位置を計算（的の左上を原点として）
    const rect = targetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 新しいショットを追加
    const newShot: Shot = {
      id: currentSession.shots.length + 1,
      x,
      y,
      timestamp: new Date()
    };

    setCurrentSession({
      ...currentSession,
      shots: [...currentSession.shots, newShot]
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ビームライフル 的記録アプリ</h1>
      </header>

      <main className="app-main">
        <div className="target-section">
          <h2>現在のセッション: {currentSession.name}</h2>
          <div
            ref={targetRef}
            className="target"
            onClick={handleTargetClick}
          >
            {/* 同心円の的 */}
            <div className="target-ring ring-10"></div>
            <div className="target-ring ring-9"></div>
            <div className="target-ring ring-8"></div>
            <div className="target-ring ring-7"></div>
            <div className="target-ring ring-6"></div>
            <div className="target-ring ring-5"></div>
            <div className="target-ring ring-4"></div>
            <div className="target-ring ring-3"></div>
            <div className="target-ring ring-2"></div>
            <div className="target-ring ring-1"></div>

            {/* ショット（命中点）の表示 */}
            {currentSession.shots.map((shot) => (
              <div
                key={shot.id}
                className="shot-mark"
                style={{
                  left: `${shot.x}px`,
                  top: `${shot.y}px`
                }}
              >
                <span className="shot-number">{shot.id}</span>
              </div>
            ))}
          </div>

          <div className="session-controls">
            <button className="save-session" onClick={saveSession}>
              セッションを保存
            </button>
          </div>
        </div>

        <div className="data-section">
          <h2>記録一覧</h2>
          <div className="current-shots">
            <h3>現在のセッション</h3>
            {currentSession.shots.length === 0 ? (
              <p>まだショットがありません</p>
            ) : (
              <ul>
                {currentSession.shots.map((shot, index) => (
                  <li key={shot.id}>
                    ショット {shot.id}: X={shot.x.toFixed(1)}, Y={shot.y.toFixed(1)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="past-sessions">
            <h3>過去のセッション</h3>
            {sessions.length === 0 ? (
              <p>まだ保存されたセッションがありません</p>
            ) : (
              <div className="session-list">
                {sessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <h4>{session.name} ({session.date.toLocaleDateString()})</h4>
                    <div>合計ショット数: {session.shots.length}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
