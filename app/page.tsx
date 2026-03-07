"use client";

import { useState, useEffect } from "react";

type Tab = "home" | "history" | "map" | "community";
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

const FEED = [
  {
    id: 1,
    user: "민준",
    initials: "민",
    time: "방금 전",
    type: "record",
    km: 4.8,
    minutes: 58,
    cal: 298,
    location: "한강공원 · 여의도",
    body: "퇴근길에 한강 한 바퀴. 바람이 딱 좋았어요.",
    likes: 12,
    comments: 3,
    liked: false,
  },
  {
    id: 2,
    user: "서연",
    initials: "서",
    time: "23분 전",
    type: "badge",
    badge: "7일 연속",
    body: "드디어 일주일 연속 달성! 꾸준히 하는 게 제일 어렵더라고요.",
    likes: 31,
    comments: 7,
    liked: true,
  },
  {
    id: 3,
    user: "태윤",
    initials: "태",
    time: "1시간 전",
    type: "record",
    km: 2.3,
    minutes: 29,
    cal: 142,
    location: "올림픽공원 · 송파",
    body: null,
    likes: 5,
    comments: 0,
    liked: false,
  },
  {
    id: 4,
    user: "하은",
    initials: "하",
    time: "3시간 전",
    type: "course",
    courseKm: 3.5,
    courseName: "서울숲 순환 코스",
    courseDesc: "서울숲 입구 → 수변공원 → 생태숲 → 다시 입구. 그늘 많고 평탄해서 초보자도 무리 없어요.",
    likes: 48,
    comments: 11,
    liked: false,
  },
  {
    id: 5,
    user: "준서",
    initials: "준",
    time: "5시간 전",
    type: "record",
    km: 7.1,
    minutes: 88,
    cal: 441,
    location: "북한산 둘레길 · 은평",
    body: "주말 아침 북한산. 숨이 찼지만 공기가 너무 좋아서 계속 걷게 됨.",
    likes: 64,
    comments: 9,
    liked: false,
  },
];


// ── Home ───────────────────────────────────────────────
function HomeScreen({ setTab, onStartWalk }: { setTab: (t: Tab) => void; onStartWalk: () => void }) {
  const weekGoalKm = 20;
  const weekDoneKm = WEEK.reduce((a, d) => a + d.km, 0);
  const maxKm = Math.max(...WEEK.map(d => d.km), 1);
  const xpPct = (USER.xp / USER.xpMax) * 100;
  const _now = new Date();
  const dow = _now.getDay();
  const todayIndex = dow === 0 ? 6 : dow - 1;
  const greetingHour = _now.getHours();
  const greeting = greetingHour < 12 ? "좋은 아침이에요" : greetingHour < 18 ? "오늘도 걸어볼까요" : "오늘 하루 수고했어요";

  return (
    <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ paddingTop: 4 }}>
        <p style={{ fontSize: 12, color: "#aaa", margin: 0, letterSpacing: 0.5 }}>{greeting}</p>
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
      <button onClick={onStartWalk} style={{
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
function WalkScreen({ onClose }: { onClose: () => void }) {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 10, color: "#aaa", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>
            {state === "idle" ? "Ready" : state === "running" ? "In Progress" : "Paused"}
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>산책</h2>
        </div>
        {state === "idle" && (
          <button onClick={onClose} style={{
            background: "#f0f0f0", border: "none", cursor: "pointer",
            width: 32, height: 32, borderRadius: 99,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        )}
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


// ── Map ────────────────────────────────────────────────
function MapScreen() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px", flexShrink: 0 }}>
        <p style={{ fontSize: 10, color: "#aaa", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>My Routes</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>지도</h2>
      </div>

      {/* Map skeleton — infinite shimmer */}
      <div style={{ flex: 1, margin: "0 20px", borderRadius: 20, overflow: "hidden", position: "relative", background: "#e8e8e8" }}>
        {/* Grid lines skeleton */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Horizontal roads */}
          {[15, 32, 50, 65, 80].map(pct => (
            <div key={pct} style={{
              position: "absolute", left: 0, right: 0,
              top: `${pct}%`, height: pct === 50 ? 6 : 3,
              background: "#ddd",
            }} />
          ))}
          {/* Vertical roads */}
          {[20, 40, 60, 78].map(pct => (
            <div key={pct} style={{
              position: "absolute", top: 0, bottom: 0,
              left: `${pct}%`, width: pct === 40 ? 5 : 2,
              background: "#ddd",
            }} />
          ))}
          {/* Block fills */}
          {[
            { top: 2, left: 2, w: 17, h: 12 },
            { top: 2, left: 21, w: 18, h: 12 },
            { top: 2, left: 41, w: 18, h: 12 },
            { top: 2, left: 61, w: 16, h: 12 },
            { top: 16, left: 2, w: 17, h: 15 },
            { top: 16, left: 21, w: 18, h: 15 },
            { top: 16, left: 41, w: 18, h: 15 },
            { top: 16, left: 61, w: 16, h: 15 },
            { top: 33, left: 2, w: 17, h: 16 },
            { top: 33, left: 21, w: 18, h: 16 },
            { top: 33, left: 41, w: 18, h: 16 },
            { top: 33, left: 61, w: 16, h: 16 },
            { top: 51, left: 2, w: 17, h: 13 },
            { top: 51, left: 21, w: 18, h: 13 },
            { top: 51, left: 41, w: 18, h: 13 },
            { top: 51, left: 61, w: 16, h: 13 },
            { top: 66, left: 2, w: 17, h: 13 },
            { top: 66, left: 21, w: 18, h: 13 },
            { top: 66, left: 41, w: 18, h: 13 },
            { top: 66, left: 61, w: 16, h: 13 },
            { top: 81, left: 2, w: 17, h: 17 },
            { top: 81, left: 21, w: 18, h: 17 },
            { top: 81, left: 41, w: 18, h: 17 },
            { top: 81, left: 61, w: 16, h: 17 },
          ].map((b, i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${b.top}%`, left: `${b.left}%`,
              width: `${b.w}%`, height: `${b.h}%`,
              background: "#e0e0e0",
            }} />
          ))}
          {/* Shimmer overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s infinite",
          }} />
        </div>

        {/* GPS 위치 없음 안내 */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 10,
        }}>
          <div style={{
            background: "rgba(255,255,255,0.92)", borderRadius: 16,
            padding: "18px 24px", textAlign: "center",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 99,
              background: "#f0f0f0", margin: "0 auto 10px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 12, height: 12, borderRadius: 99, background: "#ccc" }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>위치 불러오는 중</p>
            <p style={{ fontSize: 11, color: "#bbb", margin: "4px 0 0" }}>GPS 연결을 확인하고 있어요</p>
          </div>
        </div>
      </div>

      {/* Route list skeletons */}
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#111", margin: 0 }}>최근 경로</p>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "#f0f0f0", position: "relative", overflow: "hidden", flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                animation: "shimmer 1.6s infinite",
              }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{
                height: 11, borderRadius: 6,
                background: "#f0f0f0", width: `${55 + i * 12}%`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  animation: `shimmer 1.6s ${i * 0.2}s infinite`,
                }} />
              </div>
              <div style={{
                height: 9, borderRadius: 6,
                background: "#f5f5f5", width: `${35 + i * 8}%`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  animation: `shimmer 1.6s ${i * 0.3}s infinite`,
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

// ── History ────────────────────────────────────────────
function HistoryScreen() {
  const [shareTarget, setShareTarget] = useState<number | null>(null);

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
              <button
                onClick={() => setShareTarget(h.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "6px 8px", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="18" cy="5" r="3" stroke="#ccc" strokeWidth="1.8"/>
                  <circle cx="6" cy="12" r="3" stroke="#ccc" strokeWidth="1.8"/>
                  <circle cx="18" cy="19" r="3" stroke="#ccc" strokeWidth="1.8"/>
                  <path d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4" stroke="#ccc" strokeWidth="1.8"/>
                </svg>
              </button>
            </div>
            {i < HISTORY.length - 1 && <div style={{ height: 1, background: "#f5f5f5" }} />}
          </div>
        ))}
      </div>

      {/* SNS Share Sheet */}
      {shareTarget !== null && (() => {
        const h = HISTORY.find(x => x.id === shareTarget)!;
        const sns = [
          { name: "Instagram", color: "#E1306C", icon: "IG" },
          { name: "카카오", color: "#FEE500", textColor: "#391B1B", icon: "K" },
          { name: "X", color: "#111", icon: "X" },
          { name: "링크 복사", color: "#f5f5f5", textColor: "#111", icon: "≡" },
        ];
        return (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShareTarget(null)}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
                zIndex: 100,
              }}
            />
            {/* Sheet */}
            <div style={{
              position: "fixed", left: "50%", bottom: 0,
              transform: "translateX(-50%)",
              width: "100%", maxWidth: 390,
              background: "#fff", borderRadius: "24px 24px 0 0",
              padding: "20px 20px 40px", zIndex: 101,
            }}>
              {/* Handle */}
              <div style={{ width: 36, height: 4, borderRadius: 99, background: "#e0e0e0", margin: "0 auto 20px" }} />

              {/* Preview Card */}
              <div style={{
                background: "#111", borderRadius: 18, padding: "20px 22px", marginBottom: 22, color: "#fff",
              }}>
                <p style={{ fontSize: 10, color: "#555", margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase" }}>Strolly · {h.date}</p>
                <p style={{ fontSize: 40, fontWeight: 900, margin: 0, letterSpacing: -2, lineHeight: 1 }}>
                  {h.km}<span style={{ fontSize: 16, fontWeight: 500, color: "#666", marginLeft: 4 }}>km</span>
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  {[
                    { label: "시간", value: `${h.minutes}분` },
                    { label: "칼로리", value: `${h.cal}kcal` },
                    { label: "페이스", value: h.pace },
                  ].map(s => (
                    <div key={s.label}>
                      <p style={{ fontSize: 10, color: "#555", margin: 0 }}>{s.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "2px 0 0" }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SNS Buttons */}
              <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 14px", letterSpacing: 0.5 }}>공유하기</p>
              <div style={{ display: "flex", gap: 10 }}>
                {sns.map(s => (
                  <div key={s.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: s.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "default",
                    }}>
                      <span style={{
                        fontSize: 16, fontWeight: 900,
                        color: (s as any).textColor ?? "#fff",
                        letterSpacing: -0.5,
                      }}>{s.icon}</span>
                    </div>
                    <span style={{ fontSize: 10, color: "#aaa" }}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}


// ── Community ──────────────────────────────────────────
function CommunityScreen() {
  const [feed, setFeed] = useState(FEED);

  const toggleLike = (id: number) => {
    setFeed(prev => prev.map(p =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  return (
    <div style={{ padding: "24px 20px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 10, color: "#aaa", margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>Feed</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>커뮤니티</h2>
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {feed.map((post, i) => (
          <div key={post.id}>
            <div style={{ paddingBottom: 18 }}>
              {/* User row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 99, background: "#111",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{post.initials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>{post.user}</p>
                  <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>{post.time}</p>
                </div>
              </div>

              {/* Content by type */}
              {post.type === "record" && (
                <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: (post as any).location ? 6 : 0 }}>
                    <div>
                      <p style={{ fontSize: 10, color: "#aaa", margin: "0 0 2px" }}>거리</p>
                      <p style={{ fontSize: 28, fontWeight: 900, margin: 0, color: "#111", letterSpacing: -1 }}>
                        {(post as any).km}<span style={{ fontSize: 13, fontWeight: 500, color: "#bbb", marginLeft: 2 }}>km</span>
                      </p>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", gap: 12 }}>
                      {[
                        { label: "시간", value: `${(post as any).minutes}분` },
                        { label: "칼로리", value: `${(post as any).cal}kcal` },
                      ].map(s => (
                        <div key={s.label}>
                          <p style={{ fontSize: 10, color: "#aaa", margin: "0 0 2px" }}>{s.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {(post as any).location && (
                    <p style={{ fontSize: 11, color: "#bbb", margin: "8px 0 0" }}>{(post as any).location}</p>
                  )}
                </div>
              )}

              {post.type === "badge" && (
                <div style={{
                  background: "#111", borderRadius: 16, padding: "14px 16px", marginBottom: 10,
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "#222", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <div style={{ width: 16, height: 16, borderRadius: 99, background: "#fff" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#555", margin: "0 0 2px", letterSpacing: 0.5 }}>뱃지 획득</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>{(post as any).badge}</p>
                  </div>
                </div>
              )}

              {post.type === "course" && (
                <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }}>{(post as any).courseName}</p>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "#111",
                      background: "#e8e8e8", borderRadius: 99, padding: "3px 10px", whiteSpace: "nowrap", marginLeft: 8,
                    }}>{(post as any).courseKm}km</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.6 }}>{(post as any).courseDesc}</p>
                </div>
              )}

              {/* Body text */}
              {post.body && (
                <p style={{ fontSize: 13, color: "#444", margin: "0 0 10px", lineHeight: 1.6 }}>{post.body}</p>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  onClick={() => toggleLike(post.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.79 3.89 12 5C12.21 3.89 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14.5 12 21 12 21Z"
                      stroke={post.liked ? "#e55" : "#ccc"}
                      fill={post.liked ? "#e55" : "none"}
                      strokeWidth="1.8"
                    />
                  </svg>
                  <span style={{ fontSize: 12, color: post.liked ? "#e55" : "#bbb", fontWeight: post.liked ? 700 : 400 }}>
                    {post.likes}
                  </span>
                </button>
                <button style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                      stroke="#ccc" strokeWidth="1.8" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 12, color: "#bbb" }}>{post.comments}</span>
                </button>
              </div>
            </div>
            {i < feed.length - 1 && <div style={{ height: 1, background: "#f0f0f0", marginBottom: 18 }} />}
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

// ── Profile (with badges) ──────────────────────────────
function ProfileScreen({ onClose }: { onClose: () => void }) {
  const xpPct = (USER.xp / USER.xpMax) * 100;
  const earned = BADGES.filter(b => b.earned).length;
  return (
    <div style={{ padding: "0 20px 40px" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 0 22px",
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#111", letterSpacing: -0.5 }}>프로필</h2>
        <button onClick={onClose} style={{
          border: "none", cursor: "pointer",
          width: 32, height: 32, borderRadius: 99, background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 99, background: "#111" }} />
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#111", letterSpacing: -0.5 }}>{USER.name}</p>
          <p style={{ fontSize: 12, color: "#bbb", margin: "3px 0 0" }}>Level {USER.level} · {USER.streak}일 연속</p>
        </div>
      </div>

      {/* XP */}
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

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { label: "총 거리", value: USER.totalKm, unit: "km" },
          { label: "총 산책", value: USER.totalWalks, unit: "회" },
          { label: "획득 뱃지", value: earned, unit: "개" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#f5f5f5", borderRadius: 14, padding: "13px 10px", textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#bbb", margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, margin: "4px 0 0", color: "#111", letterSpacing: -0.5 }}>
              {s.value}<span style={{ fontSize: 10, color: "#ccc", marginLeft: 1 }}>{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Badges section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }}>뱃지</p>
          <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>{earned} / {BADGES.length}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {BADGES.map(b => (
            <div key={b.id} style={{
              background: b.earned ? "#111" : "#f5f5f5",
              borderRadius: 14, padding: "12px 8px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 99,
                background: b.earned ? "#222" : "#e8e8e8",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: b.earned ? "#fff" : "#ccc" }} />
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, margin: 0, color: b.earned ? "#fff" : "#ccc", textAlign: "center", lineHeight: 1.3 }}>{b.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div style={{ background: "#f5f5f5", borderRadius: 16, overflow: "hidden" }}>
        {["알림 설정", "목표 거리 설정", "단위 설정", "로그아웃"].map((item, i, arr) => (
          <div key={item} style={{
            padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: i < arr.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer",
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
  { id: "history", label: "기록" },
  { id: "map", label: "지도" },
  { id: "community", label: "커뮤니티" },
];

export default function StrollyApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [walkOpen, setWalkOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Strolly</span>
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

      {/* Top Nav */}
      <div style={{
        height: 44, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px", flexShrink: 0,
        borderBottom: "1px solid #f5f5f5",
      }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: "#111", letterSpacing: -0.5 }}>Strolly</span>
        <button
          onClick={() => setMenuOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 4 }}
        >
          <span style={{ display: "block", width: 20, height: 2, background: "#111", borderRadius: 99 }} />
          <span style={{ display: "block", width: 14, height: 2, background: "#111", borderRadius: 99 }} />
          <span style={{ display: "block", width: 20, height: 2, background: "#111", borderRadius: 99 }} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 76 }}>
        {tab === "home" && <HomeScreen setTab={setTab} onStartWalk={() => setWalkOpen(true)} />}
        {tab === "history" && <HistoryScreen />}
        {tab === "map" && <MapScreen />}
        {tab === "community" && <CommunityScreen />}
      </div>

      {/* Tab Bar */}
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
              fontSize: 12, fontWeight: tab === t.id ? 800 : 400,
              color: tab === t.id ? "#111" : "#c8c8c8",
              letterSpacing: tab === t.id ? -0.2 : 0,
            }}>{t.label}</span>
            <div style={{ width: 4, height: 4, borderRadius: 99, background: tab === t.id ? "#111" : "transparent" }} />
          </button>
        ))}
      </div>

      {/* ── Slide-in Menu ── */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200,
          }} />
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "78%",
            background: "#fff", zIndex: 201, display: "flex", flexDirection: "column",
            padding: "0 24px",
          }}>
            {/* Close */}
            <div style={{ paddingTop: 56, paddingBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#111" }}>메뉴</span>
              <button onClick={() => setMenuOpen(false)} style={{
                background: "#f0f0f0", border: "none", cursor: "pointer",
                width: 32, height: 32, borderRadius: 99,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Avatar mini */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 99, background: "#111" }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "#111" }}>{USER.name}</p>
                <p style={{ fontSize: 11, color: "#bbb", margin: "2px 0 0" }}>Level {USER.level}</p>
              </div>
            </div>

            {/* Menu items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "프로필", action: () => { setMenuOpen(false); setProfileOpen(true); } },
                { label: "산책 시작", action: () => { setMenuOpen(false); setWalkOpen(true); } },
                { label: "뱃지", action: () => { setMenuOpen(false); setProfileOpen(true); } },
                { label: "알림 설정", action: () => setMenuOpen(false) },
                { label: "목표 거리 설정", action: () => setMenuOpen(false) },
                { label: "단위 설정", action: () => setMenuOpen(false) },
              ].map((item, i, arr) => (
                <div key={item.label}>
                  <button onClick={item.action} style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "14px 0", textAlign: "left", fontSize: 15,
                    fontWeight: 600, color: "#111",
                  }}>{item.label}</button>
                  {i < arr.length - 1 && <div style={{ height: 1, background: "#f5f5f5" }} />}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingBottom: 40 }}>
              <button style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: "#e55", padding: 0, fontWeight: 600,
              }}>로그아웃</button>
            </div>
          </div>
        </>
      )}

      {/* ── Walk Overlay ── */}
      {walkOpen && (
        <>
          <div onClick={() => setWalkOpen(false)} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200,
          }} />
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0,
            background: "#fff", borderRadius: "24px 24px 0 0",
            zIndex: 201, padding: "20px 20px 40px",
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "#e0e0e0", margin: "0 auto 24px" }} />
            <WalkScreen onClose={() => setWalkOpen(false)} />
          </div>
        </>
      )}

      {/* ── Profile Overlay ── */}
      {profileOpen && (
        <>
          <div onClick={() => setProfileOpen(false)} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200,
          }} />
          <div style={{
            position: "absolute", inset: 0, top: 60,
            background: "#fff", borderRadius: "24px 24px 0 0",
            zIndex: 201, overflowY: "auto",
          }}>
            <ProfileScreen onClose={() => setProfileOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}