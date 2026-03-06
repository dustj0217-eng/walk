"use client";

import { useState } from "react";

type Tab = "home" | "walk" | "history" | "badges" | "profile";
type WalkState = "idle" | "running" | "paused";

const USER = {
  name: "지수",
  level: 12,
  xp: 340,
  xpMax: 500,
  streak: 7,
  totalKm: 84.3,
  totalWalks: 61,
};

const WEEK = [
  { day: "월", km: 3.2 },
  { day: "화", km: 2.1 },
  { day: "수", km: 0 },
  { day: "목", km: 5.0 },
  { day: "금", km: 1.8 },
  { day: "토", km: 0 },
  { day: "일", km: 0 },
];

const HISTORY = [
  { id: 1, date: "6월 4일", dow: "화", km: 3.2, minutes: 42, cal: 198, steps: 4280, pace: "13'08\"" },
  { id: 2, date: "6월 3일", dow: "월", km: 2.1, minutes: 28, cal: 130, steps: 2810, pace: "13'20\"" },
  { id: 3, date: "6월 1일", dow: "토", km: 5.0, minutes: 64, cal: 312, steps: 6700, pace: "12'48\"" },
  { id: 4, date: "5월 31일", dow: "금", km: 1.8, minutes: 22, cal: 111, steps: 2400, pace: "12'13\"" },
  { id: 5, date: "5월 29일", dow: "수", km: 4.4, minutes: 55, cal: 273, steps: 5880, pace: "12'30\"" },
  { id: 6, date: "5월 28일", dow: "화", km: 2.7, minutes: 35, cal: 167, steps: 3610, pace: "12'57\"" },
];

const BADGES = [
  { id: 1, name: "첫 걸음", desc: "첫 산책 완료", earned: true },
  { id: 2, name: "3일 연속", desc: "3일 연속 산책", earned: true },
  { id: 3, name: "야간 산책", desc: "밤 9시 이후 산책", earned: true },
  { id: 4, name: "스피드", desc: "페이스 5:30 달성", earned: true },
  { id: 5, name: "10km 돌파", desc: "누적 10km 달성", earned: true },
  { id: 6, name: "7일 연속", desc: "7일 연속 산책", earned: true },
  { id: 7, name: "공원 마스터", desc: "공원 5회 방문", earned: false },
  { id: 8, name: "100km", desc: "누적 100km 달성", earned: false },
  { id: 9, name: "새벽 산책", desc: "오전 6시 이전 산책", earned: false },
  { id: 10, name: "레벨 20", desc: "레벨 20 달성", earned: false },
  { id: 11, name: "주간 목표", desc: "주간 목표 달성", earned: false },
  { id: 12, name: "산책왕", desc: "누적 500km 달성", earned: false },
];

// ── Home ───────────────────────────────────────────────
function HomeScreen({ setTab }: { setTab: (t: Tab) => void }) {
  const weekGoalKm = 20;
  const weekDoneKm = WEEK.reduce((a, d) => a + d.km, 0);
  const maxKm = Math.max(...WEEK.map(d => d.km), 1);
  const xpPct = (USER.xp / USER.xpMax) * 100;
  const todayIndex = 4; // 금요일 기준 하드코딩

  return (
    <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ paddingTop: 4 }}>
        <p style={{ fontSize: 12, color: "#aaa", margin: 0, letterSpacing: 0.5 }}>안녕하세요</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.8 }}>
          {USER.name}님
        </h1>
      </div>

      {/* Level Card */}
      <div style={{ background: "#111", borderRadius: 22, padding: "22px 22px 20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <p style={{ fontSize: 10, color: "#555", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>Level</p>
            <p style={{ fontSize: 52, fontWeight: 900, margin: "0", letterSpacing: -3, lineHeight: 1 }}>{USER.level}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 10, color: "#555", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>Streak</p>
            <p style={{ fontSize: 36, fontWeight: 900, margin: "0", letterSpacing: -2, lineHeight: 1 }}>
              {USER.streak}<span style={{ fontSize: 13, fontWeight: 500, color: "#777", marginLeft: 2 }}>일</span>
            </p>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#555" }}>다음 레벨까지 {USER.xpMax - USER.xp} XP</span>
            <span style={{ fontSize: 11, color: "#555" }}>{USER.xp} / {USER.xpMax}</span>
          </div>
          <div style={{ background: "#2a2a2a", borderRadius: 99, height: 4 }}>
            <div style={{ background: "#fff", borderRadius: 99, height: 4, width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      {/* Start */}
      <button onClick={() => setTab("walk")} style={{
        width: "100%", padding: "17px 0", borderRadius: 16,
        background: "#111", color: "#fff", fontSize: 15, fontWeight: 700,
        border: "none", cursor: "pointer", letterSpacing: 0.2,
      }}>
        산책 시작
      </button>

      {/* Weekly Bar Chart */}
      <div style={{ background: "#f5f5f5", borderRadius: 20, padding: "18px 18px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#111" }}>이번 주</p>
          <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>
            <span style={{ color: "#111", fontWeight: 700 }}>{weekDoneKm.toFixed(1)}</span>&thinsp;/&thinsp;{weekGoalKm} km
          </p>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 68 }}>
          {WEEK.map((d, i) => {
            const h = d.km > 0 ? Math.max((d.km / maxKm) * 100, 14) : 0;
            const isToday = i === todayIndex;
            return (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                  <div style={{
                    width: "100%", borderRadius: 5,
                    height: d.km > 0 ? `${h}%` : "5px",
                    background: isToday ? "#111" : d.km > 0 ? "#c8c8c8" : "#e5e5e5",
                    minHeight: 5,
                  }} />
                </div>
                <span style={{ fontSize: 10, color: isToday ? "#111" : "#c0c0c0", fontWeight: isToday ? 700 : 400 }}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { label: "총 거리", value: USER.totalKm, unit: "km" },
          { label: "총 산책", value: USER.totalWalks, unit: "회" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#f5f5f5", borderRadius: 16, padding: "16px 16px" }}>
            <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, margin: "5px 0 0", color: "#111", letterSpacing: -1 }}>
              {s.value}<span style={{ fontSize: 12, fontWeight: 500, color: "#bbb", marginLeft: 2 }}>{s.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Walk ───────────────────────────────────────────────
function WalkScreen() {
  const [state, setState] = useState<WalkState>("idle");
  const [seconds, setSeconds] = useState(0);

  const km = +(seconds * 0.0014).toFixed(2);
  const cal = Math.round(km * 62);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paceNum = km > 0 ? mins / km : 0;
  const paceMin = Math.floor(paceNum);
  const paceSec = Math.round((paceNum - paceMin) * 60);
  const pace = km > 0 ? `${paceMin}'${String(paceSec).padStart(2, "0")}"` : `--'--"`;

  const start = () => {
    setState("running");
    (window as any)._t = setInterval(() => setSeconds(s => s + 1), 1000);
  };
  const pause = () => { setState("paused"); clearInterval((window as any)._t); };
  const resume = () => {
    setState("running");
    (window as any)._t = setInterval(() => setSeconds(s => s + 1), 1000);
  };
  const stop = () => { clearInterval((window as any)._t); setState("idle"); setSeconds(0); };

  return (
    <div style={{ padding: "24px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <p style={{ fontSize: 10, color: "#aaa", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>
          {state === "idle" ? "Ready" : state === "running" ? "In Progress" : "Paused"}
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>산책</h2>
      </div>

      <div style={{
        background: "#111", borderRadius: 24, padding: "48px 20px 44px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <p style={{ fontSize: 10, color: "#555", margin: "0 0 12px", letterSpacing: 1.2, textTransform: "uppercase" }}>경과 시간</p>
        <p style={{
          fontSize: 76, fontWeight: 900, color: "#fff", margin: 0,
          letterSpacing: -4, fontVariantNumeric: "tabular-nums", lineHeight: 1,
        }}>
          {String(mins).padStart(2, "0")}
          <span style={{ color: "#333", fontWeight: 300 }}>:</span>
          {String(secs).padStart(2, "0")}
        </p>
        <div style={{
          marginTop: 20, width: 6, height: 6, borderRadius: 99,
          background: state === "running" ? "#4ade80" : state === "paused" ? "#facc15" : "#2a2a2a",
        }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "거리", value: km.toFixed(2), unit: "km" },
          { label: "칼로리", value: String(cal), unit: "kcal" },
          { label: "페이스", value: pace, unit: "/km" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#f5f5f5", borderRadius: 16, padding: "14px 10px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <p style={{ fontSize: 10, color: "#bbb", margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#111", letterSpacing: -0.5 }}>{s.value}</p>
            <p style={{ fontSize: 10, color: "#ccc", margin: 0 }}>{s.unit}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {state === "idle" && <button onClick={start} style={btn("#111", "#fff")}>시작</button>}
        {state === "running" && <>
          <button onClick={pause} style={btn("#f0f0f0", "#111")}>일시정지</button>
          <button onClick={stop} style={btn("#fff", "#999", "1.5px solid #e8e8e8")}>종료</button>
        </>}
        {state === "paused" && <>
          <button onClick={resume} style={btn("#111", "#fff")}>재개</button>
          <button onClick={stop} style={btn("#fff", "#999", "1.5px solid #e8e8e8")}>종료</button>
        </>}
      </div>
    </div>
  );
}

const btn = (bg: string, color: string, border = "none"): React.CSSProperties => ({
  flex: 1, padding: "16px 0", borderRadius: 14,
  background: bg, color, fontSize: 15, fontWeight: 700,
  border, cursor: "pointer",
});

// ── History ────────────────────────────────────────────
function HistoryScreen() {
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 10, color: "#aaa", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>All Records</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>기록</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {HISTORY.map((h, i) => (
          <div key={h.id}>
            <div style={{ padding: "15px 2px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#f5f5f5", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <p style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "#111", letterSpacing: -0.5 }}>{h.km}</p>
                  <p style={{ fontSize: 9, color: "#bbb", margin: 0 }}>km</p>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{h.date} {h.dow}요일</p>
                  <p style={{ fontSize: 12, color: "#bbb", margin: "3px 0 0" }}>
                    {h.minutes}분 &middot; {h.cal}kcal &middot; {h.steps.toLocaleString()}걸음
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#ccc", margin: 0, fontVariantNumeric: "tabular-nums" }}>{h.pace}</p>
            </div>
            {i < HISTORY.length - 1 && <div style={{ height: 1, background: "#f5f5f5" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Badges ─────────────────────────────────────────────
function BadgesScreen() {
  const earned = BADGES.filter(b => b.earned).length;
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 10, color: "#aaa", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>{earned} / {BADGES.length} Earned</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>뱃지</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {BADGES.map(b => (
          <div key={b.id} style={{
            background: b.earned ? "#111" : "#f5f5f5",
            borderRadius: 18, padding: "18px 10px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 99,
              background: b.earned ? "#222" : "#e8e8e8",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: 99,
                background: b.earned ? "#fff" : "#ccc",
              }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 700, margin: 0, color: b.earned ? "#fff" : "#ccc", lineHeight: 1.3 }}>{b.name}</p>
              <p style={{ fontSize: 10, margin: "4px 0 0", color: b.earned ? "#555" : "#d8d8d8", lineHeight: 1.3 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile ────────────────────────────────────────────
function ProfileScreen() {
  const xpPct = (USER.xp / USER.xpMax) * 100;
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 10, color: "#aaa", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>My Account</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>프로필</h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 99, background: "#111" }} />
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#111", letterSpacing: -0.5 }}>{USER.name}</p>
          <p style={{ fontSize: 12, color: "#bbb", margin: "3px 0 0" }}>Level {USER.level} · {USER.streak}일 연속</p>
        </div>
      </div>

      <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "16px 18px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>경험치</span>
          <span style={{ fontSize: 12, color: "#bbb" }}>{USER.xp} / {USER.xpMax} XP</span>
        </div>
        <div style={{ background: "#e5e5e5", borderRadius: 99, height: 6 }}>
          <div style={{ background: "#111", borderRadius: 99, height: 6, width: `${xpPct}%` }} />
        </div>
        <p style={{ fontSize: 11, color: "#bbb", margin: "8px 0 0" }}>다음 레벨까지 {USER.xpMax - USER.xp} XP</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[
          { label: "총 거리", value: USER.totalKm, unit: "km" },
          { label: "총 산책", value: USER.totalWalks, unit: "회" },
          { label: "획득 뱃지", value: BADGES.filter(b => b.earned).length, unit: "개" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#f5f5f5", borderRadius: 14, padding: "13px 10px", textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#bbb", margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>
              {s.value}<span style={{ fontSize: 10, color: "#ccc", marginLeft: 1 }}>{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div style={{ background: "#f5f5f5", borderRadius: 16, overflow: "hidden" }}>
        {["알림 설정", "목표 거리 설정", "단위 설정", "로그아웃"].map((item, i, arr) => (
          <div key={item} style={{
            padding: "16px 18px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: i < arr.length - 1 ? "1px solid #ebebeb" : "none",
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, color: i === arr.length - 1 ? "#e55" : "#111" }}>{item}</span>
            {i < arr.length - 1 && <span style={{ fontSize: 16, color: "#d0d0d0" }}>›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "홈" },
  { id: "walk", label: "산책" },
  { id: "history", label: "기록" },
  { id: "badges", label: "뱃지" },
  { id: "profile", label: "프로필" },
];

export default function StrollyApp() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div style={{
      maxWidth: 390, margin: "0 auto", height: "100dvh",
      display: "flex", flexDirection: "column",
      background: "#fff",
      fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', 'SF Pro Display', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Status Bar */}
      <div style={{
        height: 48, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 22px", flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <rect x="0" y="5.5" width="2.5" height="5.5" rx="0.8" fill="#111"/>
            <rect x="4" y="3.5" width="2.5" height="7.5" rx="0.8" fill="#111"/>
            <rect x="8" y="1.5" width="2.5" height="9.5" rx="0.8" fill="#111"/>
            <rect x="12" y="0" width="3" height="11" rx="0.8" fill="#111"/>
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L13.8 3.2C12.1 1.5 9.9 0.5 7.5 0.5C5.1 0.5 2.9 1.5 1.2 3.2L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z" fill="#111"/>
            <path d="M7.5 5.5C8.7 5.5 9.8 6 10.6 6.8L11.8 5.4C10.6 4.3 9.1 3.5 7.5 3.5C5.9 3.5 4.4 4.3 3.2 5.4L4.4 6.8C5.2 6 6.3 5.5 7.5 5.5Z" fill="#111"/>
            <circle cx="7.5" cy="9.5" r="1.5" fill="#111"/>
          </svg>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 24, height: 12, border: "1.5px solid #111", borderRadius: 3.5, padding: "2px 2px", display: "flex", alignItems: "center" }}>
              <div style={{ width: "70%", height: "100%", background: "#111", borderRadius: 1.5 }} />
            </div>
            <div style={{ width: 2, height: 5, background: "#111", borderRadius: 1, marginLeft: 1 }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 76 }}>
        {tab === "home" && <HomeScreen setTab={setTab} />}
        {tab === "walk" && <WalkScreen />}
        {tab === "history" && <HistoryScreen />}
        {tab === "badges" && <BadgesScreen />}
        {tab === "profile" && <ProfileScreen />}
      </div>

      {/* Tab Bar — text only */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #f0f0f0",
        display: "flex", paddingBottom: 18, paddingTop: 12,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: 0,
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: tab === t.id ? 800 : 400,
              color: tab === t.id ? "#111" : "#c8c8c8",
              letterSpacing: tab === t.id ? -0.2 : 0,
            }}>
              {t.label}
            </span>
            <div style={{
              width: 4, height: 4, borderRadius: 99,
              background: tab === t.id ? "#111" : "transparent",
            }} />
          </button>
        ))}
      </div>
    </div>
  );
}