import { useState, useRef, useEffect } from 'react'
import './App.css'

interface Shot {
  id: number;
  x: number;
  y: number;
  score: number;
  timestamp: Date;
}

interface Session {
  id: number;
  name: string;
  date: Date;
  shots: Shot[];
  totalScore: number;
}

function App() {
  const [currentShot, setCurrentShot] = useState<{
    id: number;
    x: number;
    y: number;
    integerScore: number;
    decimalSelected: boolean;
    decimalScore: number | null;
  } | null>(null);

  const [currentSession, setCurrentSession] = useState<Session>({
    id: 1,
    name: 'セッション 1',
    date: new Date(),
    shots: [],
    totalScore: 0
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // 整数スコアの計算関数
  const calculateIntegerScore = (x: number, y: number): number => {
    // 的の中心
    const centerX = 150;
    const centerY = 150;

    // 中心からの距離を計算
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 的の判定範囲（的を囲む四角形の少し外まで）
    // 的のサイズは300x300px、判定範囲は20px大きくする
    const targetSize = 300;
    const judgementArea = targetSize / 2 + 20; // 半径+20px

    // 判定範囲外のクリックは0点
    if (Math.abs(dx) > judgementArea || Math.abs(dy) > judgementArea) {
      return 0;
    }

    // 的のサイズを超えたら0点
    const radius = targetSize / 2;
    if (distance > radius) return 0;

    // 距離に基づいてスコアを計算（10 - 何番目のリングか）
    const ringWidth = radius / 10;
    const ring = Math.ceil(distance / ringWidth);
    const score = 11 - ring;

    return Math.max(0, Math.min(10, score)); // 0~10の範囲に制限
  };

  // 小数点以下のスコアを選択
  const selectDecimalScore = (decimal: number) => {
    if (!currentShot) return;

    // 完全なスコアを計算（整数部分 + 小数点以下）
    const fullScore = currentShot.integerScore + decimal / 10;

    // 新しいショットをセッションに追加
    const newShot: Shot = {
      id: currentShot.id,
      x: currentShot.x,
      y: currentShot.y,
      score: fullScore,
      timestamp: new Date()
    };

    const newShots = [...currentSession.shots, newShot];
    const newTotalScore = currentSession.totalScore + fullScore;

    // セッションを更新
    setCurrentSession({
      ...currentSession,
      shots: newShots,
      totalScore: newTotalScore
    });

    // 選択中のセッションをリセット
    setSelectedSession(null);

    // 現在のショットをリセット
    setCurrentShot(null);
  };

  // セッションを選択
  const selectSession = (session: Session) => {
    // 既に選択されている場合は選択解除
    if (selectedSession && selectedSession.id === session.id) {
      setSelectedSession(null);
    } else {
      setSelectedSession(session);
    }
  };

  // JSON形式のデータを表示
  const [showJsonData, setShowJsonData] = useState(false);
  const [jsonData, setJsonData] = useState('');

  const displaySessionsAsJson = () => {
    // エクスポートするデータを準備
    const dataToExport = {
      currentSession,
      pastSessions: sessions
    };

    // JSONに変換して整形
    const jsonString = JSON.stringify(dataToExport, null, 2);

    // JSONデータをステートに設定
    setJsonData(jsonString);
    setShowJsonData(true);
  };

  // JSONデータ表示を閉じる
  const closeJsonDisplay = () => {
    setShowJsonData(false);
  };

  // セッションの保存
  const saveSession = () => {
    if (currentSession.shots.length === 0) return;

    setSessions([...sessions, currentSession]);
    setCurrentSession({
      id: currentSession.id + 1,
      name: `セッション ${currentSession.id + 1}`,
      date: new Date(),
      shots: [],
      totalScore: 0
    });

    // 現在のショットをリセット
    setCurrentShot(null);
  };

  // 的をクリックした時の処理
  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 選択したセッションがある場合は射撃できない
    if (selectedSession) return;

    // 既に射撃中の場合は追加の射撃を禁止
    if (!targetRef.current || currentShot) return;

    // クリック位置を計算（的の左上を原点として）
    const rect = targetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 整数スコアを計算
    const integerScore = calculateIntegerScore(x, y);

    // 現在のショットを設定
    setCurrentShot({
      id: currentSession.shots.length + 1,
      x,
      y,
      integerScore,
      decimalSelected: false,
      decimalScore: null
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

            {/* 選択されたセッションのショットを表示 */}
            {selectedSession && selectedSession.shots.map((shot) => (
              <div
                key={shot.id}
                className="shot-mark selected-session"
                style={{
                  left: `${shot.x}px`,
                  top: `${shot.y}px`
                }}
              >
                <span className="shot-number">{shot.score.toFixed(1)}</span>
              </div>
            ))}

            {/* 現在のセッションのショットを表示（選択されたセッションがない場合のみ） */}
            {!selectedSession && currentSession.shots.map((shot) => (
              <div
                key={shot.id}
                className="shot-mark"
                style={{
                  left: `${shot.x}px`,
                  top: `${shot.y}px`
                }}
              >
                <span className="shot-number">{shot.score.toFixed(1)}</span>
              </div>
            ))}

            {/* 現在の一時的なショットマーク */}
            {currentShot && (
              <div
                className="shot-mark current"
                style={{
                  left: `${currentShot.x}px`,
                  top: `${currentShot.y}px`
                }}
              >
                <span className="shot-number">{currentShot.integerScore}.?</span>
              </div>
            )}
          </div>

          {/* 小数点スコア選択UI */}
          {currentShot && (
            <div className="decimal-score-selector">
              <div className="score-message">
                整数スコア: <strong>{currentShot.integerScore}</strong> - 小数点以下の値を選択:
              </div>
              <div className="decimal-buttons">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(decimal => (
                  <button
                    key={decimal}
                    className="decimal-button"
                    onClick={() => selectDecimalScore(decimal)}
                  >
                    {decimal}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="session-controls">
            <button
              className="save-session"
              onClick={saveSession}
              disabled={currentShot !== null}
            >
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
                    ショット {shot.id}: スコア={shot.score.toFixed(1)}, X={shot.x.toFixed(1)}, Y={shot.y.toFixed(1)}
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
                  <div
                    key={session.id}
                    className={`session-item ${selectedSession && selectedSession.id === session.id ? 'selected' : ''}`}
                    onClick={() => selectSession(session)}
                  >
                    <h4>{session.name} ({session.date.toLocaleDateString()})</h4>
                    <div>合計ショット数: {session.shots.length}</div>
                    <div>合計スコア: {session.totalScore.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* JSON表示／エクスポートボタン */}
      <footer className="app-footer">
        <button
          className="export-button"
          onClick={displaySessionsAsJson}
          disabled={currentSession.shots.length === 0 && sessions.length === 0}
        >
          セッションデータをJSONで表示
        </button>

        {/* JSONデータの表示エリア */}
        {showJsonData && (
          <div className="json-display-container">
            <div className="json-display-header">
              <h3>セッションデータ (JSON形式)</h3>
              <button className="close-button" onClick={closeJsonDisplay}>閉じる</button>
            </div>
            <pre className="json-display">{jsonData}</pre>
            <div className="json-display-footer">
              <p>上記のJSONデータをコピーして保存してください</p>
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}

export default App
