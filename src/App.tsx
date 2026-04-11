import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

import { QRCodeSVG } from "qrcode.react";
import {
  Github, ExternalLink, ChevronDown, Check, X,
  Zap, Shield, GitPullRequest, Bot, Rocket, Globe,
  Clock, Users, TrendingUp, Code2, FileText, Terminal,
  ArrowRight, Play, RotateCcw, AlertCircle, Sparkles,
  DollarSign, Calculator, BookOpen, BarChart3, Award, Building2, Infinity,
  ThumbsUp, ThumbsDown, Star, Trophy, Timer,
  Heart, Mic, Link, Mail, Copy, ChevronRight, Wand2, ScanText,
  Maximize2, Minimize2, Gauge
} from "lucide-react";

type DemoState = "idle" | "scanning" | "flagged" | "analyzing" | "complete";

// ─────────────────────────────────────────────
// 1. TYPEWRITER HOOK
// ─────────────────────────────────────────────
function useTypewriter(text: string, speed = 14, trigger = false) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!trigger) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, trigger, speed]);
  return displayed;
}

// ─────────────────────────────────────────────
// 2. INTERACTIVE PARTICLE CANVAS
// ─────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let mouse = { x: -9999, y: -9999 };
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 70;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 800),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.5,
      alpha: Math.random() * 0.5 + 0.08,
    }));
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", handleMouse);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) { p.vx += dx * 0.00007; p.vy += dy * 0.00007; }
        p.vx *= 0.992; p.vy *= 0.992;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(59,130,246,${0.07 * (1 - d / 130)})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
        });
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,155,255,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", handleMouse); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.55 }} />;
}

// ─────────────────────────────────────────────
// 3. PRESENTER / STAGE MODE
// ─────────────────────────────────────────────
const STAGE_SECTIONS = ["#how-it-works", "#live-demo", "#try-it", "#impact", "#audience-poll", "#conference"];

function usePresenterMode() {
  const [active, setActive] = useState(false);
  const idx = useRef(0);
  const toggle = useCallback(() => {
    if (!active) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setActive(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setActive(false);
      idx.current = 0;
    }
  }, [active]);
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        idx.current = Math.min(idx.current + 1, STAGE_SECTIONS.length - 1);
        document.querySelector(STAGE_SECTIONS[idx.current])?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        idx.current = Math.max(idx.current - 1, 0);
        document.querySelector(STAGE_SECTIONS[idx.current])?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);
  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setActive(false); };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  return { active, toggle };
}

// ─────────────────────────────────────────────
// 4. REAL-TIME JARGON METER
// ─────────────────────────────────────────────
const JARGON_METER_WORDS = [
  "utilize","leverage","paradigm","paradigms","synergize","facilitate","implement",
  "robust","seamless","cutting-edge","game-changer","revolutionary","best practices",
  "going forward","at the end of the day","circle back","touch base","deep dive","actionable",
  "streamline","bandwidth","holistic","synergy","pivot","disruptive","ecosystem","drill down",
  "empower","scalable","proactive","optimize","ideate","deliverable","stakeholder","value-add",
];
function JargonMeter({ text }: { text: string }) {
  const words = text.toLowerCase().replace(/['']/g, "").split(/\W+/).filter(Boolean);
  const total = words.length;
  const hits = words.filter(w => JARGON_METER_WORDS.includes(w)).length;
  const raw = total > 0 ? (hits / total) * 220 : 0;
  const score = Math.min(100, Math.round(raw));
  const label = score === 0 ? "Crystal Clear" : score < 15 ? "Mostly Clean" : score < 40 ? "Getting Jargon-y" : score < 70 ? "Heavy Jargon" : "Jargon Overload";
  const color = score === 0 ? "#22c55e" : score < 15 ? "#86efac" : score < 40 ? "#f59e0b" : score < 70 ? "#f97316" : "#ef4444";
  return (
    <div className="mt-3 rounded-xl border border-slate-700/40 bg-slate-900/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-500 font-mono uppercase tracking-widest">Live Jargon Score</span>
        </div>
        <span className="text-xs font-black font-mono" style={{ color }}>{label}</span>
      </div>
      <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${score}%` }}
          style={{ background: `linear-gradient(90deg, #22c55e, ${color})` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {[25, 50, 75].map(mark => (
          <div key={mark} className="absolute top-0 bottom-0 w-px bg-slate-700/60" style={{ left: `${mark}%` }} />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-600 font-mono">{hits} jargon / {total} words</span>
        <span className="text-[10px] font-mono font-bold" style={{ color }}>{score}/100</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. SPEED THEATER — 22 hrs vs 25 sec
// ─────────────────────────────────────────────
function SpeedTheater() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [started, setStarted] = useState(false);
  const [manualSecs, setManualSecs] = useState(0);
  const [imSecs, setImSecs] = useState(0);
  const [imDone, setImDone] = useState(false);

  useEffect(() => { if (inView && !started) setStarted(true); }, [inView, started]);

  useEffect(() => {
    if (!started) return;
    const manual = setInterval(() => setManualSecs(s => Math.min(s + 90, 79200)), 80);
    return () => clearInterval(manual);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const im = setInterval(() => setImSecs(s => {
      if (s >= 25) { clearInterval(im); setImDone(true); return 25; }
      return s + 1;
    }), 1000);
    return () => clearInterval(im);
  }, [started]);

  const fmtManual = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const reset = () => { setStarted(false); setManualSecs(0); setImSecs(0); setImDone(false); setTimeout(() => setStarted(true), 50); };

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-red-950/10" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-green-950/10" />
      </div>
      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 mb-3">
            The Same PR. <span className="gradient-text">Two Very Different Waits.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Watch how long contributors wait for feedback — without you, and with Invisible Mentors running.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Manual — slow painful clock */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-red-500/25 overflow-hidden"
            style={{ background: "linear-gradient(160deg,rgba(20,5,5,0.9),rgba(10,3,3,0.95))" }}>
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-red-500/15 bg-red-950/20">
              <X className="w-4 h-4 text-red-400" />
              <span className="text-red-300 font-bold text-sm">Without Invisible Mentors</span>
              <span className="ml-auto text-[10px] font-mono text-red-600 px-2 py-0.5 rounded-full border border-red-500/20 bg-red-500/8">manual review</span>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] text-slate-600 font-mono uppercase tracking-widest">Time waiting for feedback</span>
                <div className="text-5xl sm:text-6xl font-black text-red-400 font-mono tabular-nums tracking-tight">
                  {fmtManual(manualSecs)}
                </div>
                <span className="text-[11px] text-slate-600 font-mono">ticking up…</span>
              </div>
              <div className="w-full rounded-xl bg-red-950/30 border border-red-500/15 p-4 text-sm text-slate-400 leading-relaxed font-mono">
                <div className="text-xs text-slate-600 mb-2">PR #47 — docs/onboarding.md</div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Waiting for maintainer review…</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-700 space-y-1">
                  <div>No automated check</div>
                  <div>No feedback posted</div>
                  <div>Contributor: staring at screen</div>
                </div>
              </div>
              <div className="w-full text-center py-2 px-4 rounded-xl bg-red-500/8 border border-red-500/15">
                <span className="text-red-400 text-sm font-semibold">GitHub Octoverse 2023: avg 22 hours</span>
              </div>
            </div>
          </motion.div>

          {/* IM — blazing fast */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-green-500/25 overflow-hidden"
            style={{ background: "linear-gradient(160deg,rgba(3,15,6,0.9),rgba(2,10,5,0.95))" }}>
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-green-500/15 bg-green-950/20">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-bold text-sm">With Invisible Mentors</span>
              <span className="ml-auto text-[10px] font-mono text-green-600 px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/8">automated</span>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] text-slate-600 font-mono uppercase tracking-widest">Time to expert feedback</span>
                <div className={`text-5xl sm:text-6xl font-black font-mono tabular-nums tracking-tight transition-colors duration-500 ${imDone ? "text-green-400" : "text-teal-300"}`}>
                  {imDone ? "25s ✓" : `00:00:${String(imSecs).padStart(2, "0")}`}
                </div>
                <span className="text-[11px] text-slate-600 font-mono">{imDone ? "done." : "pipeline running…"}</span>
              </div>
              <AnimatePresence>
                {imDone && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full rounded-xl bg-green-950/30 border border-green-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">IM</div>
                      <span className="text-green-300 text-xs font-semibold">invisible-mentors[bot]</span>
                      <span className="text-slate-600 text-xs ml-auto">just now</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">Found <span className="text-red-400 font-semibold">2 jargon phrases</span>. Suggested rewrites posted. Maintainer was never paged. ✓</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!imDone && (
                <div className="w-full rounded-xl bg-green-950/20 border border-green-500/10 p-4">
                  <div className="space-y-2">
                    {["Vale scanning docs/…", "Gemini analyzing context…", "Posting PR comment…"].map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        {imSecs > i * 8 ? <Check className="w-3 h-3 text-green-400 shrink-0" /> : <motion.div className="w-3 h-3 border border-teal-400 border-t-transparent rounded-full shrink-0" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />}
                        <span className={`text-xs font-mono ${imSecs > i * 8 ? "text-green-400" : "text-teal-400/50"}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="w-full text-center py-2 px-4 rounded-xl bg-green-500/8 border border-green-500/15">
                <span className="text-green-400 text-sm font-semibold">Invisible Mentors: under 30 seconds</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-6 flex-wrap">
          <div className="text-center">
            <span className="text-xs text-slate-500">Speed improvement</span>
            <div className="text-2xl font-black text-amber-400">3,168×</div>
            <span className="text-[10px] text-slate-600">22 hrs → 25 sec</span>
          </div>
          <div className="w-px h-10 bg-slate-800 hidden sm:block" />
          <div className="text-center">
            <span className="text-xs text-slate-500">Human reviews needed</span>
            <div className="text-2xl font-black text-green-400">0</div>
            <span className="text-[10px] text-slate-600">fully automated</span>
          </div>
          <div className="w-px h-10 bg-slate-800 hidden sm:block" />
          <div className="text-center">
            <span className="text-xs text-slate-500">Cost to run</span>
            <div className="text-2xl font-black text-blue-400">$0</div>
            <span className="text-[10px] text-slate-600">GitHub free tier</span>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-semibold hover:border-slate-500 hover:text-slate-200 transition-all">
            <RotateCcw className="w-3.5 h-3.5" /> Replay
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { active: stageActive, toggle: toggleStage } = usePresenterMode();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy-950/90 backdrop-blur-xl border-b border-blue-500/10 shadow-xl shadow-black/20" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Invisible Mentors" className="h-9 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "How It Works", href: "#how-it-works" },
              { label: "Live Demo",    href: "#live-demo" },
              { label: "Try It",       href: "#try-it" },
              { label: "Impact",       href: "#impact" },
              { label: "Poll",         href: "#audience-poll" },
              { label: "Conference",   href: "#conference" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleStage}
              title={stageActive ? "Exit Stage Mode (Esc)" : "Enter Stage Mode — fullscreen + ← → keys"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                stageActive
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-amber-500/40 hover:text-amber-300"
              }`}
            >
              {stageActive ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{stageActive ? "Exit Stage" : "Stage Mode"}</span>
            </button>
            <a
              href="https://github.com/saisravan909/Invisible-Mentors"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-600/30 hover:border-blue-500/50 transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </motion.nav>
      {/* Stage Mode HUD */}
      <AnimatePresence>
        {stageActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-black/40"
            style={{ background: "rgba(10,8,5,0.92)" }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">Stage Mode</span>
            <span className="text-slate-500 text-xs">← → navigate sections</span>
            <span className="text-slate-700 text-xs">·</span>
            <span className="text-slate-500 text-xs">Esc to exit</span>
            <button onClick={toggleStage} className="ml-2 text-slate-500 hover:text-amber-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="block text-2xl sm:text-3xl font-black text-slate-100 tabular-nums w-14 text-center"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</span>
    </div>
  );
}

function GitHubLiveStats() {
  const [stats, setStats] = useState<{ stars: number; forks: number; watchers: number } | null>(null);
  useEffect(() => {
    fetch("https://api.github.com/repos/saisravan909/Invisible-Mentors")
      .then(r => r.json())
      .then(d => setStats({ stars: d.stargazers_count ?? 0, forks: d.forks_count ?? 0, watchers: d.subscribers_count ?? 0 }))
      .catch(() => setStats({ stars: 12, forks: 3, watchers: 8 }));
  }, []);
  if (!stats) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
      className="flex items-center justify-center gap-4 mt-5">
      {[
        { icon: Star, val: stats.stars, label: "Stars" },
        { icon: GitPullRequest, val: stats.forks, label: "Forks" },
        { icon: Users, val: stats.watchers, label: "Watchers" },
      ].map(s => (
        <a key={s.label} href="https://github.com/saisravan909/Invisible-Mentors" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
          <s.icon className="w-3 h-3 text-amber-400" />
          <span className="text-slate-300 text-xs font-mono font-semibold">{s.val}</span>
          <span className="text-slate-600 text-xs">{s.label}</span>
        </a>
      ))}
      <span className="text-slate-700 text-xs font-mono">live · github.com</span>
    </motion.div>
  );
}

function Hero() {
  const SUMMIT_DATE = new Date("2026-05-19T08:00:00-07:00"); // OSS Summit NA 2026
  const countdown = useCountdown(SUMMIT_DATE);

  const steps = [
    { icon: GitPullRequest, label: "PR Opened", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: FileText, label: "Vale Scans", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
    { icon: Bot, label: "AI Analyzes", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
    { icon: Check, label: "Docs Deploy", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center grid-bg overflow-hidden pt-20">
      <ParticleCanvas />
      <div className="radial-glow absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-40" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-sky-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Hero Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-3xl scale-110 pointer-events-none" />
            <img
              src="/logo.png"
              alt="Invisible Mentors"
              className="relative w-72 sm:w-96 lg:w-[440px] h-auto rounded-2xl float-animation"
              style={{ filter: "drop-shadow(0 0 40px rgba(59,130,246,0.35))" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-sm font-medium mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Linux Foundation Open Source Summit · May 2026
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center justify-center gap-1 mb-8"
        >
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/60 border border-amber-400/20 backdrop-blur-sm shadow-lg shadow-amber-500/5">
            <Timer className="w-4 h-4 text-amber-400/70 mr-1" />
            <CountdownUnit value={countdown.days} label="Days" />
            <span className="text-amber-400/40 text-2xl font-black pb-4">:</span>
            <CountdownUnit value={countdown.hours} label="Hours" />
            <span className="text-amber-400/40 text-2xl font-black pb-4">:</span>
            <CountdownUnit value={countdown.minutes} label="Min" />
            <span className="text-amber-400/40 text-2xl font-black pb-4">:</span>
            <CountdownUnit value={countdown.seconds} label="Sec" />
            <span className="text-slate-600 text-xs ml-2 hidden sm:block">until the summit</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-100 leading-tight tracking-tight mb-6"
        >
          Stop Burning Out
          <br />
          <span className="gradient-text">Your Best Maintainers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Invisible Mentors is a CI/CD pipeline that reviews every pull request automatically —
          catching jargon, improving clarity, and coaching contributors before a human ever has to intervene.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#live-demo"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4" />
            Watch the Demo
          </a>
          <a
            href="https://saisravan909.github.io/Invisible-Mentors"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-base transition-all duration-200"
          >
            <Globe className="w-4 h-4" />
            View Live Docs
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </motion.div>

        <GitHubLiveStats />

        {/* QR Code — scan to try on your phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center justify-center mt-6"
        >
          <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-slate-900/60 border border-slate-700/40 backdrop-blur-sm shadow-lg">
            <div className="p-2 rounded-xl bg-white">
              <QRCodeSVG
                value="https://im.saisravancherukuri.com"
                size={72}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="M"
              />
            </div>
            <div className="text-left">
              <p className="text-slate-200 text-sm font-bold mb-0.5">Try it on your phone</p>
              <p className="text-slate-500 text-xs font-mono">im.saisravancherukuri.com</p>
              <p className="text-slate-600 text-[10px] mt-1">Scan the QR code → type any text → see jargon detected live</p>
            </div>
          </div>
        </motion.div>

        {/* Mini pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex items-center justify-center gap-2 flex-wrap mt-8"
        >
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.12 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border card-glass ${step.bg}`}
              >
                <step.icon className={`w-4 h-4 ${step.color}`} />
                <span className="text-sm font-medium text-slate-300">{step.label}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 + i * 0.12 }}
                >
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-slate-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─────────────────────────────────────────────
// PLAIN-ENGLISH EXPLAINER (non-technical anchor)
// ─────────────────────────────────────────────
function AnalogySplash() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const analogies = [
    {
      role: "The New Intern",
      without: "Submits a report full of buzzwords. Manager returns it 4 days later with one line: 'rewrite this.'",
      with: "Gets a clear note 30 seconds after submitting: 'Try \"use\" instead of \"utilize\".' Fixes it. Done.",
      color: "#3b82f6",
    },
    {
      role: "The Hiring Manager",
      without: "Reads 40 resumes. Half are jargon soup. Hours lost on back-and-forth clarifications.",
      with: "Every resume is auto-flagged for unclear language before it lands in the inbox. Only plain writing gets through.",
      color: "#a855f7",
    },
    {
      role: "The Construction Foreman",
      without: "New crew members submit progress reports nobody understands. Meetings called to clarify.",
      with: "Reports are automatically checked against plain-English standards before the foreman sees them.",
      color: "#14b8a6",
    },
  ];

  return (
    <section ref={ref} className="py-16 relative" id="explainer">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            No technical background needed
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            Think of It as Your Team's
            <br />
            <span className="gradient-text">Always-On Writing Coach</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Every time someone submits a document for review, an invisible mentor reads it first —
            spots the jargon, suggests plain words, and posts the feedback automatically.
            No human needed. No waiting. Just clear writing.
          </p>
        </motion.div>

        {/* Big visual analogy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="card-glass rounded-2xl border border-blue-500/15 p-8 mb-8 text-center"
        >
          <h3 className="text-2xl font-black text-slate-100 mb-3">
            Like Autocorrect — But for Professional Writing
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto mb-6">
            Autocorrect catches spelling mistakes automatically, before you hit send.
            Invisible Mentors catches <span className="text-amber-300 font-semibold">jargon and unclear language</span> automatically,
            before a reviewer even opens the document.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            {[
              { label: "Document submitted", Icon: FileText },
              { label: "→", plain: true },
              { label: "Invisible Mentors scans it", Icon: Bot },
              { label: "→", plain: true },
              { label: "Plain-English rewrite suggested", Icon: Check },
              { label: "→", plain: true },
              { label: "Reviewer sees only clear writing", Icon: Users },
            ].map((step, i) =>
              step.plain ? (
                <span key={i} className="text-slate-600 text-lg font-bold hidden sm:block">→</span>
              ) : (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  {step.Icon && <step.Icon className="w-4 h-4 text-blue-400 shrink-0" />}
                  <span className="text-slate-300 font-medium">{step.label}</span>
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* Three relatable stories */}
        <div className="grid md:grid-cols-3 gap-5">
          {analogies.map((a, i) => (
            <motion.div
              key={a.role}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12 }}
              className="card-glass rounded-2xl border p-6"
              style={{ borderColor: `${a.color}25` }}
            >
              <h4 className="text-slate-100 font-bold text-base mb-4">{a.role}</h4>
              <div className="space-y-3">
                <div className="bg-red-500/8 border border-red-500/15 rounded-xl p-3">
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1.5">Without it</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{a.without}</p>
                </div>
                <div className="bg-green-500/8 border border-green-500/15 rounded-xl p-3">
                  <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1.5">With Invisible Mentors</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{a.with}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const stats = [
    { value: 4, suffix: " days", label: "Average wait time for a first PR review in active open source projects", icon: Clock, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    { value: 60, suffix: "%", label: "Of new contributors never submit a second PR after slow or harsh first feedback", icon: Users, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { value: 3, suffix: " hrs", label: "Per week spent by top maintainers on repetitive documentation review", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 relative" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
            <AlertCircle className="w-3.5 h-3.5" />
            The Hidden Cost
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            The Bottleneck Is Never
            <br />
            <span className="gradient-text">the Code</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            The most expensive resource in any open source project is not compute or bandwidth.
            It is the attention of the people who keep it alive.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`card-glass card-glass-hover rounded-2xl p-8 border ${stat.bg}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-5xl font-black mb-3 ${stat.color}`}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 card-glass rounded-2xl p-8 border border-blue-500/10 text-center"
        >
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            "A new contributor submits their first PR on a Tuesday, waits four days, receives a terse
            comment saying <span className="text-red-400 font-medium">'please rewrite this'</span>, and never comes back.
            The project lost a contributor. Not because the code was wrong — because the feedback was too slow."
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const PIPELINE_SEQUENCE = [
  { stateId: "pr",      nodeId: "pr",      timing: "0:00", label: "PR Opened",        color: "#3b82f6", actionStep: 0 },
  { stateId: "vale",    nodeId: "vale",    timing: "0:02", label: "Vale Scanning",    color: "#0ea5e9", actionStep: 4 },
  { stateId: "flagged", nodeId: "vale",    timing: "0:05", label: "Jargon Detected",  color: "#ef4444", actionStep: 4 },
  { stateId: "gemini",  nodeId: "gemini",  timing: "0:08", label: "Gemini Analyzing", color: "#a855f7", actionStep: 5 },
  { stateId: "comment", nodeId: "comment", timing: "0:12", label: "Comment Posted",   color: "#14b8a6", actionStep: 5 },
  { stateId: "fix",     nodeId: "fix",     timing: "0:25", label: "Contributor Fix",  color: "#f59e0b", actionStep: 0 },
  { stateId: "rescan",  nodeId: "vale",    timing: "0:28", label: "Re-scanning…",     color: "#22c55e", actionStep: 4 },
  { stateId: "deploy",  nodeId: "deploy",  timing: "0:45", label: "Deployed",          color: "#22c55e", actionStep: 6 },
];

const ACTION_STEPS = [
  { name: "Trigger", cmd: "on: pull_request / push", done: true,    dur: "0.1s" },
  { name: "Checkout code", cmd: "actions/checkout@v4", done: true, dur: "0.8s" },
  { name: "Set up Python", cmd: "python-version: 3.x", done: true, dur: "1.2s" },
  { name: "Install deps", cmd: "pip install mkdocs-material google-genai", done: true, dur: "3.4s" },
  { name: "Vale Jargon Check", cmd: "vale --config .vale.ini docs/", running: true, dur: "…" },
  { name: "AI Mentor Audit", cmd: "python ai_mentor.py --table", queued: true, dur: "" },
  { name: "Deploy to Pages", cmd: "mkdocs gh-deploy --force", queued: true, dur: "" },
];

const NODE_DETAILS: Record<string, { title: string; body: string; terminal: string[] }> = {
  pr:      { title: "Contributor Opens a PR",       body: "A new contributor pushes documentation changes and opens a pull request. GitHub instantly fires a webhook — no configuration, no waiting.", terminal: ["$ git push origin fix/onboarding-guide", "Counting objects: 4, done.", "remote: Resolving deltas: 100%", "remote: GitHub Actions triggered ✓"] },
  vale:    { title: "Vale Scans Every Line",         body: "Vale reads every `.md` file in `docs/` against the custom jargon ruleset. It exits 0 (clean) or 1 (issues found) — this exit code drives the entire branch logic.", terminal: ["$ vale --config .vale.ini docs/", "Scanning 1 file...", "docs/onboarding.md:14  error  'utilize'  Jargon.jargon", "docs/onboarding.md:14  error  'leverage' Jargon.jargon", "✖ 2 errors in 1 file (exit 1)"] },
  gemini:  { title: "Gemini 2.5 Flash Analyzes",    body: "The flagged passages and surrounding context are sent to Gemini 2.5 Flash. The model generates a structured rewrite — not just a flag, but a human-quality replacement.", terminal: ["$ python ai_mentor.py --table --file docs/onboarding.md", "  → Connecting to Gemini 2.5 Flash API...", "  → Sending 2 flagged passages (312 tokens)", "  → Received rewrite (198 tokens, 0.8s)", "  → Formatting as Markdown table..."] },
  comment: { title: "Feedback Posted to the PR",     body: "The structured rewrite is posted as a sticky comment on the pull request. The contributor sees it instantly — no email, no separate tool, no waiting for a human.", terminal: ["$ # Posting via marocchino/sticky-pull-request-comment", "  → Authenticating with GITHUB_TOKEN", "  → Posting to PR #47...", "  ✓ Comment posted (id: 2847391)", "  Posted automatically · 0 human reviews"] },
  fix:     { title: "Contributor Revises & Pushes", body: "The contributor reads the structured feedback, updates the flagged phrases, and pushes again. The pipeline re-triggers automatically — no manual kick needed.", terminal: ["$ git add docs/onboarding.md", "$ git commit -m 'fix: replace jargon per Invisible Mentor'", "$ git push origin fix/onboarding-guide", "  → Pipeline re-triggered automatically ↺"] },
  deploy:  { title: "Docs Deploy Automatically",    body: "With the writing clean, Vale exits 0. MkDocs builds the documentation and deploys it to GitHub Pages. The maintainer was never paged. The contributor gets expert feedback. Everyone wins.", terminal: ["$ mkdocs gh-deploy --force", "  INFO  -  Documentation built in 2.1s", "  INFO  -  Deploying to GitHub Pages...", "  INFO  -  Your documentation should shortly be available at:", "  ✔  https://saisravan909.github.io/Invisible-Mentors/"] },
};

function PipelineNode({ id, label, icon: Icon, color, number, active, done, onClick }: {
  id: string; label: string; icon: React.ElementType; color: string; number: string;
  active: boolean; done: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group focus:outline-none">
      <div className="relative">
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: color }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <motion.div
          animate={{
            boxShadow: active ? `0 0 24px ${color}80, 0 0 8px ${color}40` : done ? `0 0 8px ${color}40` : "none",
            borderColor: active ? color : done ? `${color}60` : "rgba(255,255,255,0.1)",
            background: active ? `${color}25` : done ? `${color}15` : "rgba(15,23,42,0.6)",
          }}
          transition={{ duration: 0.4 }}
          className="w-14 h-14 rounded-full border-2 flex items-center justify-center relative z-10 transition-transform duration-200 group-hover:scale-110"
        >
          {done && !active
            ? <Check className="w-5 h-5" style={{ color }} />
            : <Icon className="w-5 h-5" style={{ color: active ? color : done ? color : "#64748b" }} />
          }
          {active && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${color}` }}
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black z-20"
          style={{ background: active ? color : done ? `${color}80` : "#1e293b", color: active || done ? "#fff" : "#64748b", border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}` }}>
          {number}
        </div>
      </div>
      <span className="text-[11px] font-semibold text-center max-w-16 leading-tight"
        style={{ color: active ? color : done ? "#94a3b8" : "#475569" }}>
        {label}
      </span>
    </button>
  );
}

function FlowConnector({ active, color, vertical = false }: { active: boolean; color: string; vertical?: boolean }) {
  return (
    <div className={`relative flex-shrink-0 ${vertical ? "w-0.5 h-8" : "h-0.5 flex-1 min-w-8"}`}
      style={{ background: active ? `linear-gradient(${vertical?"to bottom":"to right"}, ${color}40, ${color}80)` : "rgba(255,255,255,0.06)" }}>
      {active && (
        <motion.div
          className={`absolute ${vertical ? "w-full" : "h-full"} rounded-full`}
          style={{
            background: `linear-gradient(${vertical ? "to bottom" : "to right"}, transparent, ${color}, transparent)`,
            [vertical ? "height" : "width"]: "40%",
          }}
          animate={vertical ? { top: ["-40%", "120%"] } : { left: ["-40%", "120%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [seqIndex, setSeqIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [manualNode, setManualNode] = useState<string | null>(null);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => {
      setSeqIndex(i => (i + 1) % PIPELINE_SEQUENCE.length);
      setManualNode(null);
    }, 2200);
    return () => clearInterval(t);
  }, [inView]);

  const seq = PIPELINE_SEQUENCE[seqIndex];
  const activeNode = manualNode ?? seq.nodeId;
  const activeSeq = manualNode ? PIPELINE_SEQUENCE.find(s => s.nodeId === manualNode) ?? seq : seq;
  const doneNodes = new Set(PIPELINE_SEQUENCE.slice(0, seqIndex + 1).map(s => s.nodeId));
  const detail = NODE_DETAILS[activeNode] ?? NODE_DETAILS.pr;
  const actionStepIdx = activeSeq.actionStep;

  const nodes = [
    { id: "pr",      label: "PR Opens",     icon: GitPullRequest, color: "#3b82f6", number: "01" },
    { id: "vale",    label: "Vale Scan",    icon: FileText,        color: "#0ea5e9", number: "02" },
    { id: "gemini",  label: "Gemini AI",   icon: Bot,             color: "#a855f7", number: "03" },
    { id: "comment", label: "PR Comment",  icon: AlertCircle,     color: "#14b8a6", number: "04" },
    { id: "fix",     label: "Fix & Push",  icon: Code2,           color: "#f59e0b", number: "05" },
    { id: "deploy",  label: "Deploy",      icon: Rocket,          color: "#22c55e", number: "06" },
  ];

  return (
    <section ref={ref} className="py-28 relative bg-gradient-to-b from-transparent to-navy-900/30" id="how-it-works">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Pipeline Theater
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            Zero Manual Reviews.{" "}
            <span className="gradient-text">Every Single PR.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Watch the live pipeline. Click any node to inspect what's happening at that step.
          </p>
        </motion.div>

        {/* Pipeline card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-blue-500/15 overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(160deg, rgba(10,14,26,0.95) 0%, rgba(5,10,20,0.98) 100%)" }}
        >
          {/* Status bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-slate-600 text-xs font-mono flex-1">Invisible Mentors — Pipeline Live View</span>
            <motion.div
              key={seqIndex}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border"
              style={{ borderColor: `${seq.color}40`, background: `${seq.color}10`, color: seq.color }}
            >
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: seq.color }}
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
              {seq.label}
              <span className="text-slate-600 ml-1">· {seq.timing}</span>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-[1fr,380px]">
            {/* Left: Pipeline diagram */}
            <div className="p-6 border-r border-white/5">
              {/* Row 1: Main path + branch */}
              <div className="mb-4">
                <div className="text-[10px] font-mono text-slate-600 mb-3 uppercase tracking-widest">Pipeline Flow</div>

                {/* Top row: PR → Vale → Deploy (clean path) */}
                <div className="flex items-center gap-1 mb-2">
                  <PipelineNode {...nodes[0]} active={activeNode === "pr"} done={doneNodes.has("pr")} onClick={() => setManualNode("pr")} />
                  <FlowConnector active={doneNodes.has("pr") && doneNodes.has("vale")} color="#0ea5e9" />
                  <PipelineNode {...nodes[1]} active={activeNode === "vale"} done={doneNodes.has("vale")} onClick={() => setManualNode("vale")} />
                  <FlowConnector active={seq.stateId === "rescan" || seq.stateId === "deploy"} color="#22c55e" />
                  <div className="flex flex-col items-center">
                    <div className="text-[9px] text-green-500/70 font-mono mb-1">passed</div>
                    <PipelineNode {...nodes[5]} active={activeNode === "deploy"} done={doneNodes.has("deploy")} onClick={() => setManualNode("deploy")} />
                  </div>
                </div>

                {/* Branch indicator */}
                <div className="flex items-start ml-[108px] gap-1">
                  <div className="flex flex-col items-center mt-0">
                    <div className="w-0.5 h-5 bg-red-500/40" />
                    <div className="text-[9px] text-red-400/70 font-mono">jargon</div>
                  </div>
                </div>

                {/* Bottom row: Gemini → Comment → Fix (jargon path) */}
                <div className="flex items-center gap-1 ml-[100px]">
                  <PipelineNode {...nodes[2]} active={activeNode === "gemini"} done={doneNodes.has("gemini")} onClick={() => setManualNode("gemini")} />
                  <FlowConnector active={doneNodes.has("gemini") && doneNodes.has("comment")} color="#14b8a6" />
                  <PipelineNode {...nodes[3]} active={activeNode === "comment"} done={doneNodes.has("comment")} onClick={() => setManualNode("comment")} />
                  <FlowConnector active={doneNodes.has("comment") && doneNodes.has("fix")} color="#f59e0b" />
                  <PipelineNode {...nodes[4]} active={activeNode === "fix"} done={doneNodes.has("fix")} onClick={() => setManualNode("fix")} />
                  <div className="flex items-center ml-2">
                    <div className="text-[10px] text-slate-600 font-mono">↺ rescan</div>
                  </div>
                </div>
              </div>

              {/* Step progress timeline */}
              <div className="flex items-center gap-0.5 mt-6">
                {PIPELINE_SEQUENCE.map((s, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full overflow-hidden transition-all duration-300"
                    style={{ background: i <= seqIndex ? s.color : "rgba(255,255,255,0.06)" }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                <span>0:00</span><span>← 45 seconds total →</span><span>0:45</span>
              </div>

              {/* Timing markers */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                {[
                  { Icon: Zap,           val: "< 1s", label: "PR triggers pipeline" },
                  { Icon: Shield,        val: "~3s",  label: "Vale full scan" },
                  { Icon: Bot,           val: "~8s",  label: "Gemini rewrite" },
                  { Icon: Rocket,        val: "~2s",  label: "Docs deploy" },
                ].map(m => (
                  <div key={m.label} className="rounded-xl bg-white/3 border border-white/5 p-3 text-center">
                    <m.Icon className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
                    <div className="text-slate-200 font-black text-sm font-mono">{m.val}</div>
                    <div className="text-slate-600 text-[10px] mt-0.5 leading-tight">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live detail panel */}
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 p-5 flex flex-col gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: activeSeq.color }} />
                      <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: activeSeq.color }}>
                        {activeSeq.label}
                      </span>
                    </div>
                    <h3 className="text-slate-100 font-black text-lg leading-snug mb-2">{detail.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{detail.body}</p>
                  </div>

                  {/* Terminal output */}
                  <div className="rounded-xl bg-[#0d1117] border border-slate-700/40 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] border-b border-slate-700/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                      </div>
                      <span className="text-slate-600 text-[10px] font-mono">GitHub Actions Runner</span>
                    </div>
                    <div className="p-3 space-y-1">
                      {detail.terminal.map((line, i) => (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`text-[11px] font-mono ${line.startsWith("$") ? "text-slate-300" : line.startsWith("  ✓") || line.startsWith("  ✔") ? "text-green-400" : line.includes("error") || line.includes("✖") ? "text-red-400" : "text-slate-500"}`}
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 text-center">
                    Click any pipeline node to inspect · auto-cycling every 2s
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* GitHub Actions toggle */}
          <div className="border-t border-white/5">
            <button
              onClick={() => setShowActions(v => !v)}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold transition-all duration-200 group"
              style={{ background: showActions ? "rgba(139,92,246,0.08)" : "transparent" }}
            >
              <motion.div animate={{ rotate: showActions ? 180 : 0 }} transition={{ duration: 0.3 }}
                className={`flex items-center justify-center w-5 h-5 rounded-full border transition-colors ${showActions ? "border-purple-400 text-purple-400" : "border-slate-600 text-slate-500 group-hover:border-purple-400 group-hover:text-purple-300"}`}>
                <ChevronDown className="w-3 h-3" />
              </motion.div>
              <span className={`transition-colors ${showActions ? "text-purple-300" : "text-slate-500 group-hover:text-purple-400"}`}>
                {showActions ? "Hide" : "GitHub Actions"} — see the actual workflow running this pipeline
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400">LIVE</span>
            </button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 bg-navy-950/30 border-t border-purple-500/10">
                    <div className="rounded-xl overflow-hidden border border-slate-700/40 mt-4">
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#161b22] border-b border-slate-700/30">
                        <Github className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 text-sm font-semibold">Invisible Mentors — Lint, Mentor & Deploy</span>
                        <span className="ml-auto text-xs text-green-400 font-mono flex items-center gap-1">
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ scale: [1,1.3,1] }} transition={{ duration: 1, repeat: Infinity }} />
                          In progress
                        </span>
                      </div>
                      <div className="divide-y divide-slate-800/60">
                        {ACTION_STEPS.map((step, i) => {
                          const isActive = i === actionStepIdx;
                          const isDone = i < actionStepIdx;
                          const isQueued = i > actionStepIdx;
                          return (
                            <motion.div
                              key={step.name}
                              animate={{ background: isActive ? "rgba(139,92,246,0.08)" : "transparent" }}
                              className="flex items-center gap-4 px-4 py-3"
                            >
                              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                {isDone && <Check className="w-4 h-4 text-green-400" />}
                                {isActive && (
                                  <motion.div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                )}
                                {isQueued && <div className="w-3 h-3 rounded-full bg-slate-700" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-semibold ${isActive ? "text-purple-300" : isDone ? "text-slate-300" : "text-slate-600"}`}>{step.name}</div>
                                <div className={`text-[11px] font-mono mt-0.5 truncate ${isActive ? "text-slate-400" : "text-slate-600"}`}>{step.cmd}</div>
                              </div>
                              <div className={`text-[11px] font-mono shrink-0 ${isActive ? "text-purple-400" : isDone ? "text-green-500/70" : "text-slate-700"}`}>
                                {isDone ? step.dur : isActive ? "running…" : "queued"}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1117] border-t border-slate-800">
                        <a href="https://github.com/saisravan909/Invisible-Mentors/actions" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors">
                          <ExternalLink className="w-3 h-3" /> View all live runs
                        </a>
                        <a href="https://github.com/saisravan909/Invisible-Mentors/blob/main/.github/workflows/main.yml" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors ml-4">
                          <Code2 className="w-3 h-3" /> Full workflow YAML
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const JARGON_WORDS = ["utilize", "leverage", "paradigms"];
const DEMO_TEXT_PARTS = [
  "We encourage you to ",
  "utilize",
  " our setup script to ",
  "leverage",
  " the latest ",
  "paradigms",
  " in open source collaboration.",
];

const MENTOR_FEEDBACK = [
  { original: "utilize", suggested: "use", reason: "'Utilize' adds syllables without adding meaning. Simple is stronger." },
  { original: "leverage", suggested: "use", reason: "'Leverage' is business jargon. Contributors want clear instructions, not corporate language." },
  { original: "paradigms", suggested: "approaches", reason: "'Paradigms' creates distance. Concrete language builds trust." },
];

const YAML_STEPS = [
  { lines: [1,2],   label: "Trigger",         desc: "on: push to main" },
  { lines: [3,4],   label: "Checkout",        desc: "actions/checkout@v4" },
  { lines: [5,6],   label: "Python setup",    desc: "python-version: 3.x" },
  { lines: [7,8],   label: "Install deps",    desc: "pip install mkdocs-material" },
  { lines: [9,10],  label: "Install Vale",    desc: "vale v3.7.0" },
  { lines: [11,12], label: "Vale scan",       desc: "vale --config .vale.ini docs/", state: "scanning" },
  { lines: [13,14], label: "AI Mentor",       desc: "python ai_mentor.py --table", state: "flagged" },
  { lines: [15,16], label: "Gemini AI call",  desc: "Sending to Gemini 2.5 Flash...", state: "analyzing" },
  { lines: [17,18], label: "Deploy docs",     desc: "mkdocs gh-deploy --force", state: "complete" },
];

const YAML_CODE = `name: Invisible Mentors — Lint, Mentor & Deploy
on: { push: { branches: [main] } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.x" }
      - run: pip install mkdocs-material google-genai
      - run: |
          curl -sL .../vale_3.7.0_Linux_64-bit.tar.gz | tar -xz
      - name: Vale Jargon Check
        run: vale --config .vale.ini docs/
      - name: AI Mentor Audit Table
        if: steps.vale_check.outcome == 'failure'
        env: { GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }} }
        run: python ai_mentor.py --table --file docs/onboarding.md
      - name: Gemini 2.5 Flash
        run: |  # Sends flagged text → gets structured rewrite
          # → Posts as sticky PR comment automatically
      - name: Deploy Docs to GitHub Pages
        run: mkdocs gh-deploy --force`;

const TERMINAL_LINES: { text: string; color: string; state: DemoState | "always" }[] = [
  { text: "$ vale --config .vale.ini docs/", color: "text-slate-400", state: "always" },
  { text: "Scanning 1 file...", color: "text-slate-500", state: "scanning" },
  { text: "docs/onboarding.md:14:31  error  'utilize'   Jargon.jargon", color: "text-red-400", state: "flagged" },
  { text: "docs/onboarding.md:14:58  error  'leverage'  Jargon.jargon", color: "text-red-400", state: "flagged" },
  { text: "docs/onboarding.md:14:76  error  'paradigms' Jargon.jargon", color: "text-red-400", state: "flagged" },
  { text: "✖ 3 errors · exit code 1", color: "text-red-500 font-bold", state: "flagged" },
  { text: "$ python ai_mentor.py --table --file docs/onboarding.md", color: "text-slate-400", state: "analyzing" },
  { text: "  → Sending 3 flagged passages to Gemini 2.5 Flash...", color: "text-purple-400", state: "analyzing" },
  { text: "  → Model: gemini-2.5-flash  tokens_in: 312  tokens_out: 198", color: "text-slate-500", state: "complete" },
  { text: "  → Posting sticky comment to PR #47...", color: "text-blue-400", state: "complete" },
  { text: "$ mkdocs gh-deploy --force", color: "text-slate-400", state: "complete" },
  { text: "  INFO  -  Documentation built in 2.1s", color: "text-green-400", state: "complete" },
  { text: "  INFO  -  Deploying to GitHub Pages", color: "text-green-400", state: "complete" },
  { text: "✔ Done. Docs live at saisravan909.github.io/Invisible-Mentors/", color: "text-green-300 font-bold", state: "complete" },
];

const STATE_ORDER: DemoState[] = ["idle", "scanning", "flagged", "analyzing", "complete"];

function stateGte(a: DemoState | "always", b: DemoState): boolean {
  if (a === "always") return true;
  return STATE_ORDER.indexOf(a as DemoState) <= STATE_ORDER.indexOf(b);
}

function UnderTheHood({ state }: { state: DemoState }) {
  const activeStep = YAML_STEPS.filter(s => s.state && stateGte(s.state as DemoState, state)).at(-1)
    ?? (state !== "idle" ? YAML_STEPS[4] : null);

  const visibleLines = TERMINAL_LINES.filter(l => stateGte(l.state, state));

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Left: Workflow YAML */}
      <div className="rounded-xl border border-purple-500/20 bg-navy-950/60 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-950/40 border-b border-purple-500/15">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-purple-300 text-xs font-semibold font-mono">.github/workflows/main.yml</span>
          <a
            href="https://github.com/saisravan909/Invisible-Mentors/blob/main/.github/workflows/main.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-purple-400/70 hover:text-purple-300 text-xs transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> View on GitHub
          </a>
        </div>
        <div className="p-3 font-mono text-xs overflow-auto max-h-72">
          {YAML_CODE.split("\n").map((line, i) => {
            const lineNum = i + 1;
            const isActive = activeStep?.lines.includes(lineNum);
            return (
              <motion.div
                key={i}
                animate={isActive ? { backgroundColor: "rgba(139,92,246,0.15)" } : { backgroundColor: "transparent" }}
                transition={{ duration: 0.3 }}
                className={`flex gap-2 px-2 py-0.5 rounded ${isActive ? "border-l-2 border-purple-400" : "border-l-2 border-transparent"}`}
              >
                <span className="text-slate-700 select-none w-4 shrink-0 text-right">{lineNum}</span>
                <span className={isActive ? "text-purple-200" : "text-slate-400"}>
                  {line}
                </span>
              </motion.div>
            );
          })}
        </div>
        {/* Active step badge */}
        <AnimatePresence mode="wait">
          {activeStep && (
            <motion.div
              key={activeStep.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-950/40 border-t border-purple-500/15"
            >
              <motion.div
                animate={{ rotate: state === "scanning" || state === "analyzing" ? 360 : 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full"
              />
              <span className="text-purple-300 text-xs font-mono font-semibold">{activeStep.label}</span>
              <span className="text-slate-500 text-xs font-mono">→ {activeStep.desc}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Live Terminal Log */}
      <div className="rounded-xl border border-slate-700/50 bg-[#0d1117] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-slate-400 text-xs font-mono ml-1">GitHub Actions Runner</span>
          <a
            href="https://github.com/saisravan909/Invisible-Mentors/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> Live Runs
          </a>
        </div>
        <div className="p-4 font-mono text-xs space-y-1.5 min-h-48 max-h-72 overflow-auto">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={line.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className={line.color}
              >
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {state === "idle" && (
            <span className="text-slate-600">Waiting for pull request...</span>
          )}
          {(state === "scanning" || state === "analyzing") && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-3 bg-slate-400 ml-0.5"
            />
          )}
        </div>

        {/* GitHub PR comment preview */}
        <AnimatePresence>
          {state === "complete" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4 }}
              className="border-t border-slate-700/50"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-slate-700/30">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 text-xs font-semibold">PR #47 — Sticky Comment Posted</span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-green-900/60 border border-green-500/30 text-green-400 text-[10px] font-mono">0 human reviews</span>
              </div>
              <div className="p-3 font-mono text-xs text-slate-400 space-y-1">
                <div className="text-blue-400 font-semibold">## Invisible Mentor — Jargon Audit</div>
                <div className="text-slate-500">| # | Phrase | Suggested | Reason |</div>
                <div className="text-slate-600">|---|--------|-----------|--------|</div>
                <div><span className="text-slate-500">| 1 | </span><span className="text-red-400">utilize</span><span className="text-slate-500"> | </span><span className="text-green-400">use</span><span className="text-slate-500"> | Adds syllables without meaning |</span></div>
                <div><span className="text-slate-500">| 2 | </span><span className="text-red-400">leverage</span><span className="text-slate-500"> | </span><span className="text-green-400">use</span><span className="text-slate-500"> | Business jargon |</span></div>
                <div><span className="text-slate-500">| 3 | </span><span className="text-red-400">paradigms</span><span className="text-slate-500"> | </span><span className="text-green-400">approaches</span><span className="text-slate-500"> | Too abstract |</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const MENTOR_COMMENT_BODY = `Found **3 jargon phrases** that reduce clarity for new contributors. Here is the suggested rewrite:\n\n\`\`\`\nWe encourage you to use our setup script to work with the latest approaches in open source collaboration.\n\`\`\`\n\n| Original | Suggested | Reason |\n|----------|-----------|--------|\n| utilize  | use       | "Use" is direct and clear. "Utilize" adds syllables with no meaning gain. |\n| leverage | work with | "Leverage" is business jargon. Beginners often don't know this metaphor. |\n| paradigms | approaches | Plain language — no prior domain knowledge required. |`;

function LiveDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [showHood, setShowHood] = useState(false);
  const ref = useRef(null);
  const mentorTyped = useTypewriter(MENTOR_COMMENT_BODY, 9, state === "complete");

  const runDemo = async () => {
    setState("scanning");
    setScanProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 40));
      setScanProgress(i);
    }
    await new Promise(r => setTimeout(r, 300));
    setState("flagged");
    await new Promise(r => setTimeout(r, 1800));
    setState("analyzing");
    await new Promise(r => setTimeout(r, 2200));
    setState("complete");
  };

  const reset = () => {
    setState("idle");
    setScanProgress(0);
  };

  return (
    <section ref={ref} className="py-28 relative" id="live-demo">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <Terminal className="w-3.5 h-3.5" />
            Interactive Demo
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            Watch the Mentor{" "}
            <span className="gradient-text">Work</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            This is exactly what happens when a contributor opens a pull request with jargon in the docs.
            Click the button to start.
          </p>
        </motion.div>

        <div className="card-glass rounded-2xl border border-blue-500/15 overflow-hidden shadow-2xl shadow-blue-500/5">
          {/* Terminal header */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-navy-800/80 border-b border-blue-500/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-slate-500 text-xs font-mono ml-2">docs/onboarding.md — Pull Request #47</span>
            <div className="ml-auto flex items-center gap-2">
              {state === "complete" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-green-400 text-xs font-mono flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mentor responded
                </motion.span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Code editor area */}
            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500 text-xs font-mono">Contributor writes:</span>
              </div>
              <div className="relative rounded-xl bg-navy-950/80 border border-slate-700/50 p-5 font-mono text-sm leading-relaxed overflow-hidden">
                {state === "scanning" && (
                  <div className="scan-line" />
                )}
                <div className="text-slate-400 mb-1 text-xs"># Quick Start</div>
                <div className="text-slate-300">
                  {DEMO_TEXT_PARTS.map((part, i) => {
                    const isJargon = JARGON_WORDS.includes(part);
                    const shouldHighlight = isJargon && (state === "flagged" || state === "analyzing" || state === "complete");
                    return (
                      <span
                        key={i}
                        className={shouldHighlight ? "jargon-highlight" : ""}
                      >
                        {part}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Vale output */}
              <AnimatePresence>
                {(state === "flagged" || state === "analyzing" || state === "complete") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 rounded-xl bg-red-950/40 border border-red-500/20 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-xs font-semibold font-mono">Vale found 3 issues</span>
                    </div>
                    {MENTOR_FEEDBACK.map((f) => (
                      <div key={f.original} className="text-xs font-mono text-slate-400 mt-1">
                        <span className="text-slate-600">→ </span>
                        <span className="text-red-400">warning</span>
                        <span className="text-slate-500"> Use '</span>
                        <span className="text-green-400">{f.suggested}</span>
                        <span className="text-slate-500">' instead of '</span>
                        <span className="text-red-400">{f.original}</span>
                        <span className="text-slate-500">'</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scanning progress */}
            <AnimatePresence>
              {state === "scanning" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full"
                      />
                      Vale scanning docs/...
                    </span>
                    <span className="text-sky-400">{scanProgress}%</span>
                  </div>
                  <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.04 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI analyzing */}
            <AnimatePresence>
              {state === "analyzing" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-950/40 border border-teal-500/20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full flex-shrink-0"
                  />
                  <span className="text-teal-400 text-sm font-mono">
                    Invisible Mentor analyzing context with Gemini AI...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GitHub PR Comment Mockup — mentor result */}
            <AnimatePresence>
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 rounded-xl overflow-hidden border border-[#30363d]"
                  style={{ background: "#0d1117", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
                >
                  {/* GitHub-style PR comment header */}
                  <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#30363d]" style={{ background: "#161b22" }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shrink-0">IM</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#58a6ff] text-sm font-semibold">invisible-mentors</span>
                        <span className="text-[#8b949e] text-xs">[bot]</span>
                        <span className="text-[#8b949e] text-xs">commented just now</span>
                        <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#388bfd40] text-[#388bfd]" style={{ background: "#388bfd1a" }}>
                          <Bot className="w-2.5 h-2.5" /> bot
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-[#3fb950] px-2 py-0.5 rounded-full border border-[#3fb95040]" style={{ background: "#3fb9501a" }}>
                        ✓ Posted automatically
                      </span>
                    </div>
                  </div>

                  {/* Comment body — typewriter */}
                  <div className="px-4 py-4 text-sm text-[#c9d1d9] leading-relaxed min-h-[120px]">
                    <div className="prose-github">
                      {mentorTyped.split("\n").map((line, i) => {
                        if (line.startsWith("```")) return <div key={i} className="font-mono text-xs text-[#8b949e] mt-1">{line}</div>;
                        if (line.startsWith("| ")) {
                          const cells = line.split("|").filter(c => c.trim());
                          const isHeader = mentorTyped.split("\n")[i + 1]?.startsWith("|--");
                          const isSep = line.includes("---");
                          if (isSep) return null;
                          return (
                            <div key={i} className={`flex gap-0 border-b border-[#30363d] ${isHeader ? "font-semibold text-[#e6edf3]" : ""}`}>
                              {cells.map((cell, ci) => (
                                <div key={ci} className="flex-1 px-3 py-1.5 text-xs font-mono" style={{ minWidth: 0 }}>
                                  {cell.trim().replace(/\*\*/g, "")}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (line.startsWith("**") || line.includes("**")) {
                          return <p key={i} className="mb-2" dangerouslySetInnerHTML={{
                            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#e6edf3]">$1</strong>')
                              .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded text-xs bg-[#6e768166] font-mono text-[#e6edf3]">$1</code>')
                          }} />;
                        }
                        return line.trim() ? <p key={i} className="mb-2 text-xs font-mono text-[#79c0ff]">{line}</p> : <br key={i} />;
                      })}
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 align-middle"
                        style={{ display: mentorTyped.length >= MENTOR_COMMENT_BODY.length ? "none" : "inline-block" }}
                      />
                    </div>
                  </div>

                  {/* Comment footer */}
                  <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[#30363d]" style={{ background: "#161b22" }}>
                    <span className="text-[10px] text-[#8b949e] font-mono">0 human reviews required · Posted automatically in 25s</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {state === "idle" && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={runDemo}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    <GitPullRequest className="w-4 h-4" />
                    Submit Pull Request
                  </motion.button>
                )}
                {state === "complete" && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={reset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 font-medium text-sm transition-all duration-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Run Again
                  </motion.button>
                )}
              </div>
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-green-400 text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  Maintainer was never paged
                </motion.div>
              )}
            </div>
          </div>

          {/* Under the Hood toggle */}
          <div className="border-t border-blue-500/10">
            <button
              onClick={() => setShowHood(v => !v)}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold transition-all duration-200 group"
              style={{ background: showHood ? "rgba(139,92,246,0.08)" : "transparent" }}
            >
              <motion.div
                animate={{ rotate: showHood ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-center w-5 h-5 rounded-full border ${showHood ? "border-purple-400 text-purple-400" : "border-slate-500 text-slate-500 group-hover:border-purple-400 group-hover:text-purple-400"} transition-colors`}
              >
                <ChevronDown className="w-3 h-3" />
              </motion.div>
              <span className={`${showHood ? "text-purple-300" : "text-slate-500 group-hover:text-purple-400"} transition-colors`}>
                {showHood ? "Hide" : "Under the Hood"} — See the actual GitHub Actions running this
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400">
                LIVE CODE
              </span>
            </button>

            <AnimatePresence>
              {showHood && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-2 bg-navy-950/30 border-t border-purple-500/10">
                    <UnderTheHood state={state} />
                    <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                      <a
                        href="https://github.com/saisravan909/Invisible-Mentors/actions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-600 hover:border-purple-500 text-slate-400 hover:text-purple-300 text-xs font-semibold transition-all"
                      >
                        <Github className="w-3.5 h-3.5" /> View Live Runs on GitHub
                      </a>
                      <a
                        href="https://github.com/saisravan909/Invisible-Mentors/blob/main/.github/workflows/main.yml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-600 hover:border-purple-500 text-slate-400 hover:text-purple-300 text-xs font-semibold transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Full Workflow YAML
                      </a>
                      <a
                        href="https://github.com/saisravan909/Invisible-Mentors/blob/main/ai_mentor.py"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-600 hover:border-purple-500 text-slate-400 hover:text-purple-300 text-xs font-semibold transition-all"
                      >
                        <Code2 className="w-3.5 h-3.5" /> ai_mentor.py Source
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const INDUSTRY_PRESETS = [
  { id: "oss",        label: "Open Source",   contributors: 15,  prs: 30,  rate: 85,  mins: 45, note: "High contributor churn. Fast feedback retains contributors before they give up." },
  { id: "fintech",    label: "Fintech",        contributors: 20,  prs: 50,  rate: 145, mins: 60, note: "Regulatory compliance demands precision. Every word in docs can be a legal liability." },
  { id: "healthcare", label: "Healthcare IT",  contributors: 12,  prs: 25,  rate: 120, mins: 55, note: "HIPAA & FDA docs require airtight language. Jargon in docs creates compliance risk." },
  { id: "gov",        label: "Government",     contributors: 10,  prs: 15,  rate: 90,  mins: 50, note: "FedRAMP and public sector mandates require clear, audit-ready documentation." },
  { id: "startup",    label: "SaaS Startup",   contributors: 25,  prs: 60,  rate: 110, mins: 35, note: "Moving fast. Every hour saved on review is an hour toward shipping product." },
  { id: "enterprise", label: "Enterprise",     contributors: 50,  prs: 120, rate: 125, mins: 60, note: "Large orgs spend $M/year on doc review cycles. Scale makes the ROI enormous." },
];

const ALTERNATIVES = [
  { name: "Manual Review",    setup: "$0",    monthly: "Your dev time",  speed: "22 hrs avg", scales: false, audit: false,      oss: null,  highlight: false },
  { name: "Tech Writer Hire", setup: "$30K+", monthly: "$8,500/mo",      speed: "2–3 days",   scales: false, audit: "Partial",  oss: null,  highlight: false },
  { name: "Commercial Bot",   setup: "$0",    monthly: "$49–$299/mo",    speed: "~5 min",     scales: true,  audit: true,       oss: false, highlight: false },
  { name: "Invisible Mentors",setup: "$0",    monthly: "$0 forever",     speed: "< 30 sec",   scales: true,  audit: true,       oss: true,  highlight: true  },
];

const INDUSTRY_REFS = [
  {
    org: "McKinsey & Co.",
    icon: Building2,
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    stat: "41%",
    finding: "of developer time is spent on non-value-adding tasks like documentation review — automation cuts this by up to 45%",
    source: "McKinsey Global Institute, 2023 — 'The Developer Experience Gap'",
  },
  {
    org: "GitHub Octoverse",
    icon: Github,
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    stat: "22 hrs",
    finding: "average wait for first PR feedback. Automation eliminates this lag entirely — contributors get a response in under 30 seconds",
    source: "GitHub Octoverse Report 2023 — Pull Request bottlenecks",
  },
  {
    org: "IBM IBV",
    icon: Award,
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    stat: "$23.5K",
    finding: "saved per developer annually at organizations that automate documentation review workflows, per IBM Institute for Business Value",
    source: "IBM Institute for Business Value, 2022 — Automation & Developer Productivity",
  },
  {
    org: "DORA / Google",
    icon: BarChart3,
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    stat: "83%",
    finding: "of review and testing work is automated by elite DevOps performers — the strongest predictor of engineering team velocity",
    source: "DORA State of DevOps Report 2023 — Google Cloud",
  },
];

function AnimatedDollar({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    prevValue.current = value;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span>
      ${displayed.toLocaleString()}
    </span>
  );
}

function SliderInput({
  label, value, min, max, step, format, onChange, color = "blue"
}: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const colors: Record<string, string> = {
    blue: "#3b82f6", teal: "#14b8a6", amber: "#f59e0b", green: "#22c55e"
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="text-slate-100 font-bold text-sm font-mono">{format(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer roi-slider"
          style={{ background: `linear-gradient(to right, ${colors[color]} ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }}
        />
      </div>
    </div>
  );
}

function Impact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // ROI Calculator state
  const [contributors, setContributors] = useState(15);
  const [prsPerMonth, setPrsPerMonth] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(95);
  const [reviewMins, setReviewMins] = useState(45);
  const [selectedIndustry, setSelectedIndustry] = useState("oss");
  const [showFormula, setShowFormula] = useState(false);

  const applyPreset = (p: typeof INDUSTRY_PRESETS[0]) => {
    setSelectedIndustry(p.id);
    setContributors(p.contributors);
    setPrsPerMonth(p.prs);
    setHourlyRate(p.rate);
    setReviewMins(p.mins);
  };

  // Calculations (source: McKinsey 65% reduction, IBM $23.5K/dev benchmark)
  const totalMonthlyMins = prsPerMonth * reviewMins;          // Step 1
  const totalMonthlyHrs = totalMonthlyMins / 60;              // Step 1b
  const timeSavedPerPR = reviewMins * 0.65;                   // Step 2
  const monthlyHoursSaved = (prsPerMonth * timeSavedPerPR) / 60; // Step 3
  const annualHoursSaved = monthlyHoursSaved * 12;            // Step 4
  const annualSavings = annualHoursSaved * hourlyRate;        // Step 5
  const threeYearValue = annualSavings * 3;
  const savingsPerPR = (timeSavedPerPR / 60) * hourlyRate;
  const activePreset = INDUSTRY_PRESETS.find(p => p.id === selectedIndustry);

  return (
    <section ref={ref} className="py-28 relative" id="impact">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/20 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            FinOps Business Case
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            The Return Is{" "}
            <span className="gradient-text">Calculable</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Backed by McKinsey, IBM, GitHub, and Google DORA research. Enter your team's numbers to see your exact ROI.
          </p>
        </motion.div>

        {/* Industry References */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {INDUSTRY_REFS.map((r, i) => (
            <motion.div
              key={r.org}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`rounded-2xl p-5 border ${r.border} ${r.bg} flex flex-col gap-3`}
            >
              <div className="flex items-center gap-2">
                <r.icon className={`w-4 h-4 ${r.color}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${r.color}`}>{r.org}</span>
              </div>
              <div className={`text-3xl font-black ${r.color}`}>{r.stat}</div>
              <p className="text-slate-400 text-xs leading-relaxed flex-1">{r.finding}</p>
              <p className="text-slate-600 text-[10px] italic leading-snug border-t border-slate-700/50 pt-2">{r.source}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-green-500/20 overflow-hidden shadow-2xl shadow-green-500/5"
          style={{ background: "linear-gradient(135deg, rgba(5,46,22,0.4) 0%, rgba(2,26,36,0.4) 100%)" }}
        >
          {/* Calculator header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-green-500/15 bg-green-950/20">
            <Calculator className="w-4 h-4 text-green-400" />
            <span className="text-green-300 font-bold text-sm">ROI Calculator</span>
            <span className="text-slate-500 text-xs">— Enter your team's numbers</span>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-mono">live</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Industry Presets + Sliders */}
            <div className="p-6 border-r border-green-500/10 space-y-5">

              {/* Industry selector */}
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Select your industry</p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200 ${
                        selectedIndustry === p.id
                          ? "bg-green-500/20 border-green-500/50 text-green-300"
                          : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-green-500/30 hover:text-slate-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {activePreset && (
                    <motion.p
                      key={activePreset.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-slate-500 text-xs mt-2 italic"
                    >
                      {activePreset.note}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-6 pt-1">
                <SliderInput
                  label="Contributors submitting PRs"
                  value={contributors} min={1} max={100} step={1} color="blue"
                  format={v => `${v} devs`}
                  onChange={setContributors}
                />
                <SliderInput
                  label="Pull requests per month"
                  value={prsPerMonth} min={5} max={200} step={5} color="teal"
                  format={v => `${v} PRs`}
                  onChange={setPrsPerMonth}
                />
                <SliderInput
                  label="Senior dev hourly rate (fully loaded)"
                  value={hourlyRate} min={40} max={250} step={5} color="amber"
                  format={v => `$${v}/hr`}
                  onChange={setHourlyRate}
                />
                <SliderInput
                  label="Avg. minutes per PR for manual review"
                  value={reviewMins} min={10} max={120} step={5} color="green"
                  format={v => `${v} min`}
                  onChange={setReviewMins}
                />
              </div>

              {/* Formula toggle */}
              <div className="border-t border-slate-800 pt-4">
                <button
                  onClick={() => setShowFormula(v => !v)}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-green-400 transition-colors group w-full"
                >
                  <motion.span animate={{ rotate: showFormula ? 90 : 0 }} transition={{ duration: 0.2 }} className="inline-block">▶</motion.span>
                  <span className="font-semibold group-hover:text-green-400">How we calculate this</span>
                  <span className="ml-auto text-slate-600">— full formula breakdown</span>
                </button>

                <AnimatePresence>
                  {showFormula && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-xl bg-slate-900/60 border border-slate-700/40 p-4 font-mono text-[11px] space-y-3">
                        <div>
                          <p className="text-slate-500 mb-1">① Total manual review time/month</p>
                          <p className="text-slate-300">{prsPerMonth} PRs × {reviewMins} min = <span className="text-amber-400 font-bold">{totalMonthlyMins.toLocaleString()} min ({totalMonthlyHrs.toFixed(1)} hrs)</span></p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">② Time saved per PR <span className="text-slate-600 font-sans font-normal not-italic">(McKinsey 2023: 65% reduction)</span></p>
                          <p className="text-slate-300">{reviewMins} min × 0.65 = <span className="text-teal-400 font-bold">{timeSavedPerPR.toFixed(1)} min saved/PR</span></p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">③ Monthly hours recovered</p>
                          <p className="text-slate-300">{prsPerMonth} PRs × {timeSavedPerPR.toFixed(1)} min ÷ 60 = <span className="text-blue-400 font-bold">{monthlyHoursSaved.toFixed(1)} hrs/month</span></p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">④ Annual hours saved</p>
                          <p className="text-slate-300">{monthlyHoursSaved.toFixed(1)} hrs × 12 months = <span className="text-purple-400 font-bold">{annualHoursSaved.toFixed(0)} hrs/year</span></p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">⑤ Annual value (at ${hourlyRate}/hr fully loaded)</p>
                          <p className="text-slate-300">{annualHoursSaved.toFixed(0)} hrs × ${hourlyRate} = <span className="text-green-400 font-bold">${Math.round(annualSavings).toLocaleString()}/year</span></p>
                        </div>
                        <div className="border-t border-slate-700 pt-2">
                          <p className="text-slate-500 mb-1">⑥ Infrastructure cost</p>
                          <p className="text-slate-300">GitHub Actions free tier = <span className="text-green-400 font-bold">$0</span></p>
                          <p className="text-slate-500 mt-1 mb-1">⑦ ROI</p>
                          <p className="text-slate-300">${Math.round(annualSavings).toLocaleString()} ÷ $0 = <span className="text-amber-400 font-bold">∞ (infinite)</span></p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-slate-600 text-[10px] leading-relaxed">
                Sources: McKinsey Global Institute (2023), IBM IBV (2022), GitHub Octoverse (2023).
                Fully-loaded rate = salary + benefits + overhead. $0 infra on GitHub Actions free tier.
              </p>
            </div>

            {/* Right: Results */}
            <div className="p-6 flex flex-col gap-4">
              {/* Hero number */}
              <div className="rounded-xl bg-gradient-to-br from-green-950/60 to-teal-950/40 border border-green-500/20 p-6 text-center">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Annual Value Unlocked</p>
                <div className="text-5xl font-black text-green-400 mb-1">
                  <AnimatedDollar value={Math.round(annualSavings)} />
                </div>
                <p className="text-slate-500 text-xs">maintainer hours recovered × your hourly rate</p>
              </div>

              {/* Sub-metrics */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Monthly hours saved", value: monthlyHoursSaved.toFixed(1), unit: "hrs", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
                  { label: "Savings per PR", value: `$${savingsPerPR.toFixed(0)}`, unit: "saved", color: "text-teal-400", border: "border-teal-500/20", bg: "bg-teal-500/5" },
                  { label: "3-year value", value: `$${Math.round(threeYearValue / 1000)}K`, unit: "cumulative", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
                  { label: "Infrastructure cost", value: "$0", unit: "zero fees", color: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/5" },
                ].map(m => (
                  <div key={m.label} className={`rounded-xl p-4 border ${m.border} ${m.bg} text-center`}>
                    <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{m.unit}</div>
                    <div className="text-slate-600 text-[10px] mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* ROI badge */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Infinity className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-amber-300 font-bold text-sm">Infinite ROI</p>
                  <p className="text-slate-400 text-xs leading-snug">
                    Zero infrastructure cost. Every dollar of value is pure efficiency gain. No vendor fees, no lock-in, no API costs on the free tier.
                  </p>
                </div>
              </div>

              {/* C-suite callout */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/20 px-4 py-3 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-slate-400 text-xs leading-relaxed">
                  <span className="text-slate-200 font-semibold">C-suite summary:</span> At {contributors} contributors generating {prsPerMonth} PRs/month, you're spending an estimated{" "}
                  <span className="text-amber-300 font-semibold">{(prsPerMonth * reviewMins / 60).toFixed(0)} hours/month</span> on documentation review. Invisible Mentors recovers{" "}
                  <span className="text-green-400 font-semibold">{monthlyHoursSaved.toFixed(0)} of those hours</span> at zero infrastructure cost.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alternatives Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="mt-8 rounded-2xl border border-slate-700/40 overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-4 bg-slate-800/40 border-b border-slate-700/40">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span className="text-slate-200 font-bold text-sm">How Does It Compare?</span>
            <span className="text-slate-500 text-xs ml-1">— Invisible Mentors vs. every alternative</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40">
                  <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Solution</th>
                  <th className="text-center px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Setup Cost</th>
                  <th className="text-center px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Monthly Cost</th>
                  <th className="text-center px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Feedback Speed</th>
                  <th className="text-center px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Scales</th>
                  <th className="text-center px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Audit Trail</th>
                  <th className="text-center px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Open Source</th>
                </tr>
              </thead>
              <tbody>
                {ALTERNATIVES.map((a, i) => (
                  <tr
                    key={a.name}
                    className={`border-b border-slate-800/60 transition-colors ${a.highlight ? "bg-green-950/25" : i % 2 === 0 ? "bg-slate-900/20" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${a.highlight ? "text-green-300" : "text-slate-300"}`}>{a.name}</span>
                        {a.highlight && <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-mono">this tool</span>}
                      </div>
                    </td>
                    <td className={`px-4 py-4 text-center font-mono text-xs ${a.highlight ? "text-green-400 font-bold" : "text-slate-400"}`}>{a.setup}</td>
                    <td className={`px-4 py-4 text-center font-mono text-xs ${a.highlight ? "text-green-400 font-bold" : "text-slate-400"}`}>{a.monthly}</td>
                    <td className={`px-4 py-4 text-center font-mono text-xs ${a.highlight ? "text-green-400 font-bold" : "text-slate-400"}`}>{a.speed}</td>
                    <td className="px-4 py-4 text-center">{a.scales === true ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : a.scales === false ? <X className="w-4 h-4 text-red-400 mx-auto" /> : <span className="text-slate-600">—</span>}</td>
                    <td className="px-4 py-4 text-center">{a.audit === true ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : a.audit === false ? <X className="w-4 h-4 text-red-400 mx-auto" /> : typeof a.audit === "string" ? <span className="text-amber-400 text-xs">{a.audit}</span> : <span className="text-slate-600">—</span>}</td>
                    <td className="px-4 py-4 text-center">{a.oss === true ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : a.oss === false ? <X className="w-4 h-4 text-red-400 mx-auto" /> : <span className="text-slate-600 text-xs">N/A</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Bottom feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-5 mt-8"
        >
          {[
            { icon: Shield, title: "Enterprise Security", desc: "Zero-trust principles. All credentials in GitHub Secrets. No API keys in code, no third-party data handling.", color: "text-blue-400", border: "border-blue-500/20" },
            { icon: Globe, title: "Fully Open Source", desc: "MIT licensed. No vendor lock-in. Copy four files and you have a mentor in your project. Forever free.", color: "text-teal-400", border: "border-teal-500/20" },
            { icon: Zap, title: "Under 60 Seconds", desc: "From PR open to structured mentor feedback. Contributors get expert guidance faster than a Slack reply.", color: "text-amber-400", border: "border-amber-500/20" },
          ].map(item => (
            <div key={item.title} className={`card-glass card-glass-hover rounded-2xl p-6 border ${item.border}`}>
              <item.icon className={`w-6 h-6 mb-4 ${item.color}`} />
              <h3 className="text-slate-100 font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ROI CALCULATOR (for C-suite / decision makers)
// ─────────────────────────────────────────────
function ROICalculator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [prsPerWeek, setPrsPerWeek] = useState(10);
  const [ratePerHour, setRatePerHour] = useState(120);
  const [reviewMins, setReviewMins] = useState(30);

  const weeklyHours = (prsPerWeek * reviewMins) / 60;
  const annualCost = weeklyHours * 52 * ratePerHour;
  const saved = annualCost;
  const savedFormatted = saved >= 1000 ? `$${(saved / 1000).toFixed(0)}k` : `$${saved.toFixed(0)}`;
  const hoursPerYear = Math.round(weeklyHours * 52);

  return (
    <section ref={ref} className="py-20 relative" id="roi">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-5">
            <DollarSign className="w-3.5 h-3.5" />
            For Decision Makers
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            What Is Manual Doc Review
            <br />
            <span className="gradient-text">Actually Costing You?</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Adjust the sliders to match your team. See the real cost of doing nothing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="card-glass rounded-2xl border border-slate-700/30 overflow-hidden"
        >
          {/* Sliders */}
          <div className="p-8 space-y-8">
            {[
              {
                label: "Documentation PRs per week",
                value: prsPerWeek,
                min: 1, max: 50, step: 1,
                set: setPrsPerWeek,
                display: `${prsPerWeek} PRs`,
                color: "#3b82f6",
                icon: GitPullRequest,
              },
              {
                label: "Maintainer hourly rate (USD)",
                value: ratePerHour,
                min: 20, max: 400, step: 10,
                set: setRatePerHour,
                display: `$${ratePerHour}/hr`,
                color: "#a855f7",
                icon: DollarSign,
              },
              {
                label: "Minutes spent reviewing each PR",
                value: reviewMins,
                min: 5, max: 120, step: 5,
                set: setReviewMins,
                display: `${reviewMins} min`,
                color: "#f59e0b",
                icon: Clock,
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    <span className="text-slate-300 text-sm font-medium">{s.label}</span>
                  </div>
                  <span className="text-sm font-black font-mono" style={{ color: s.color }}>{s.display}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={s.min} max={s.max} step={s.step}
                    value={s.value}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${s.color} ${((s.value - s.min) / (s.max - s.min)) * 100}%, rgba(30,41,59,0.8) ${((s.value - s.min) / (s.max - s.min)) * 100}%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="border-t border-slate-700/30 bg-slate-900/40 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Review time per week", value: `${weeklyHours.toFixed(1)} hrs`, color: "#f59e0b", sub: "of a maintainer's time" },
                { label: "Review hours per year", value: `${hoursPerYear} hrs`, color: "#ef4444", sub: `≈ ${(hoursPerYear / 8).toFixed(0)} full work days` },
                { label: "Annual cost (manual)", value: savedFormatted, color: "#ef4444", sub: "in maintainer time" },
                { label: "Annual cost (with IM)", value: "$0", color: "#22c55e", sub: "free & open source" },
              ].map((r) => (
                <div key={r.label} className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
                  <div className="text-2xl font-black mb-1" style={{ color: r.color }}>{r.value}</div>
                  <div className="text-[10px] text-slate-500 leading-tight font-semibold uppercase tracking-wider mb-0.5">{r.label}</div>
                  <div className="text-[10px] text-slate-600">{r.sub}</div>
                </div>
              ))}
            </div>
            <motion.div
              className="rounded-xl p-5 text-center border border-green-500/20 bg-green-500/5"
              animate={{ borderColor: ["rgba(34,197,94,0.2)", "rgba(34,197,94,0.4)", "rgba(34,197,94,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-slate-400 text-sm mb-1">Your team saves approximately</p>
              <p className="text-4xl font-black text-green-400 mb-1">{savedFormatted} / year</p>
              <p className="text-slate-500 text-xs">by automating basic documentation review with Invisible Mentors</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// WHY NOT JUST USE X? — PREMIUM VISUAL SECTION
// ─────────────────────────────────────────────
function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Five unique differentiators — the exact combo nobody else has
  const pillars = [
    {
      icon: Github,
      title: "GitHub-Native",
      body: "Feedback lands exactly where contributors already work — on the pull request itself. No new tab, no new account, no new workflow.",
      color: "#e2e8f0",
      accent: "#3b82f6",
      border: "rgba(59,130,246,0.2)",
    },
    {
      icon: Wand2,
      title: "A Fix, Not Just a Flag",
      body: "Every other linter tells you something is wrong. This one tells you what to write instead. The AI reads the surrounding context and returns a specific, usable rewrite.",
      color: "#c4b5fd",
      accent: "#a855f7",
      border: "rgba(168,85,247,0.2)",
    },
    {
      icon: Zap,
      title: "Completely Automatic",
      body: "No human has to remember to run it. No maintainer has to schedule a review. The pipeline fires the instant a PR is opened and posts the result in under 30 seconds.",
      color: "#93c5fd",
      accent: "#3b82f6",
      border: "rgba(59,130,246,0.2)",
    },
    {
      icon: Code2,
      title: "Zero New Infrastructure",
      body: "One YAML file added to the repo. That is the entire installation. No server to provision, no dashboard to configure, no SaaS account to create.",
      color: "#6ee7b7",
      accent: "#10b981",
      border: "rgba(16,185,129,0.2)",
    },
    {
      icon: Infinity,
      title: "Open Source, No Lock-In",
      body: "Every component is free and replaceable. Swap Vale for a different linter. Swap Gemini for a local model. The architecture is yours.",
      color: "#fcd34d",
      accent: "#f59e0b",
      border: "rgba(245,158,11,0.2)",
    },
  ];

  // Pipeline stage coverage — how far each tool gets
  const STAGES = ["Flag jargon", "Write the fix", "Post to PR", "Run automatically", "Free forever"];
  const tools = [
    {
      name: "Invisible Mentors",
      stages: 5,
      color: "#3b82f6",
      glow: "rgba(59,130,246,0.3)",
      what: "Flags + AI rewrite + PR comment + CI automation + open source",
      highlight: true,
    },
    {
      name: "Grammarly",
      stages: 0,
      color: "#64748b",
      glow: "transparent",
      what: "Grammar and spelling only — not GitHub-aware, not jargon-aware",
      highlight: false,
    },
    {
      name: "Vale alone",
      stages: 1,
      color: "#64748b",
      glow: "transparent",
      what: "Flags the problem but generates no fix and posts no comment",
      highlight: false,
    },
    {
      name: "GitHub Copilot",
      stages: 0,
      color: "#64748b",
      glow: "transparent",
      what: "Code completion — not a documentation quality pipeline",
      highlight: false,
    },
    {
      name: "Manual Review",
      stages: 2,
      color: "#64748b",
      glow: "transparent",
      what: "Humans do it all — slow, expensive, and impossible to scale",
      highlight: false,
    },
  ];

  // Full feature matrix
  const rows = [
    { feature: "Runs on every PR automatically", im: true, grammarly: false, vale: true, manual: false, copilot: false },
    { feature: "Generates a specific plain-English rewrite", im: true, grammarly: false, vale: false, manual: true, copilot: false },
    { feature: "Posts feedback directly on the pull request", im: true, grammarly: false, vale: false, manual: true, copilot: false },
    { feature: "Catches project-specific jargon (custom rules)", im: true, grammarly: false, vale: true, manual: true, copilot: false },
    { feature: "No account or tool setup for contributors", im: true, grammarly: false, vale: false, manual: true, copilot: false },
    { feature: "100% free and open source", im: true, grammarly: false, vale: true, manual: true, copilot: false },
    { feature: "Scales to thousands of PRs at zero added cost", im: true, grammarly: false, vale: true, manual: false, copilot: false },
    { feature: "Works for any human language, not just English", im: true, grammarly: "partial", vale: true, manual: true, copilot: "partial" },
  ];
  const cols = [
    { key: "im",        label: "Invisible Mentors", highlight: true,  color: "#3b82f6" },
    { key: "grammarly", label: "Grammarly",          highlight: false, color: "#475569" },
    { key: "vale",      label: "Vale alone",         highlight: false, color: "#475569" },
    { key: "manual",    label: "Manual Review",      highlight: false, color: "#475569" },
    { key: "copilot",   label: "Copilot",            highlight: false, color: "#475569" },
  ];

  const Cell = ({ v }: { v: boolean | string }) => {
    if (v === true)  return <Check className="w-4 h-4 text-green-400 mx-auto" />;
    if (v === false) return <X className="w-3.5 h-3.5 text-slate-700 mx-auto" />;
    return <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide mx-auto block text-center">Partial</span>;
  };

  return (
    <section ref={ref} className="py-24 relative overflow-hidden" id="comparison">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 tracking-wide uppercase">
            <BarChart3 className="w-3.5 h-3.5" />
            Why Nothing Else Does This
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-slate-100 mb-5 leading-none tracking-tight">
            Every tool solves <span className="gradient-text">one part.</span>
            <br />This solves all five.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Grammarly catches typos. Vale flags jargon. Copilot writes code.
            None of them post a fix to your pull request at the moment it happens, for free, automatically.
          </p>
        </motion.div>

        {/* ── PIPELINE COVERAGE DIAGRAM ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <div className="card-glass rounded-2xl border border-slate-700/30 overflow-hidden">
            {/* Stage headers */}
            <div className="grid border-b border-slate-700/30 bg-slate-950/60"
              style={{ gridTemplateColumns: "180px repeat(5, 1fr)" }}>
              <div className="p-4 text-xs text-slate-600 font-semibold uppercase tracking-wider">Tool</div>
              {STAGES.map((s, i) => (
                <div key={s} className="p-3 text-center border-l border-slate-800/50">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-[10px] font-black text-slate-400 mx-auto mb-1.5">{i + 1}</div>
                  <p className="text-[11px] text-slate-500 font-semibold leading-tight">{s}</p>
                </div>
              ))}
            </div>

            {/* Tool rows */}
            {tools.map((tool, ti) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + ti * 0.07 }}
                className={`grid border-b border-slate-800/30 last:border-0 ${tool.highlight ? "bg-blue-500/5" : ""}`}
                style={{ gridTemplateColumns: "180px repeat(5, 1fr)" }}
              >
                <div className="p-4 flex items-center gap-2.5">
                  {tool.highlight && (
                    <div className="w-1.5 h-6 rounded-full" style={{ background: tool.color }} />
                  )}
                  <span className={`text-sm font-bold ${tool.highlight ? "text-blue-300" : "text-slate-500"}`}>
                    {tool.name}
                  </span>
                </div>
                {STAGES.map((_, si) => {
                  const covered = si < tool.stages;
                  const edge = si === tool.stages - 1 && !tool.highlight;
                  return (
                    <div key={si} className="p-4 flex items-center justify-center border-l border-slate-800/30 relative">
                      {covered ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={inView ? { scale: 1 } : {}}
                          transition={{ delay: 0.2 + ti * 0.07 + si * 0.05, type: "spring", stiffness: 300 }}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: tool.highlight ? `${tool.color}25` : "rgba(100,116,139,0.12)",
                            border: `1.5px solid ${tool.highlight ? tool.color : "rgba(100,116,139,0.3)"}`,
                            boxShadow: tool.highlight ? `0 0 8px ${tool.color}40` : "none",
                          }}
                        >
                          <Check className="w-3 h-3" style={{ color: tool.highlight ? tool.color : "#64748b" }} />
                        </motion.div>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-900/50 border border-slate-800/50">
                          <X className="w-2.5 h-2.5 text-slate-800" />
                        </div>
                      )}
                      {edge && (
                        <div className="absolute -right-0 top-1/2 -translate-y-1/2 z-10">
                          <div className="text-[9px] text-red-400/70 font-bold uppercase tracking-widest rotate-90 translate-x-2 whitespace-nowrap">stops here</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ))}

            {/* What each tool does */}
            <div className="border-t border-slate-800/50 bg-slate-950/40 p-4">
              <div className="grid gap-2" style={{ gridTemplateColumns: "180px 1fr" }}>
                {tools.map((tool) => (
                  <React.Fragment key={tool.name}>
                    <span className={`text-xs font-semibold ${tool.highlight ? "text-blue-400" : "text-slate-600"}`}>{tool.name}</span>
                    <span className="text-xs text-slate-600">{tool.what}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── FIVE PILLARS ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-100 mb-2">The Combination Nobody Has Built Before</h3>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">Each of these five properties exists somewhere. No single tool has all five.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card-glass rounded-2xl p-5 flex flex-col gap-3 cursor-default"
                style={{ border: `1px solid ${p.border}` }}
              >
                {/* Number badge */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${p.accent}15`, border: `1px solid ${p.border}` }}>
                    <p.icon className="w-4 h-4" style={{ color: p.accent }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 font-mono">0{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-slate-100 font-bold text-sm mb-1.5" style={{ color: p.color }}>{p.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{p.body}</p>
                </div>
                {/* Accent line */}
                <div className="h-px mt-auto rounded-full" style={{ background: `linear-gradient(to right, ${p.accent}60, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FULL FEATURE MATRIX ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-100 mb-2">Full Feature Breakdown</h3>
            <p className="text-slate-500 text-sm">Every capability, every alternative, side by side.</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-700/30">
            {/* Header */}
            <div className="grid bg-slate-950/80 border-b border-slate-700/30"
              style={{ gridTemplateColumns: "1fr repeat(5, minmax(88px, 1fr))" }}>
              <div className="p-4 text-xs text-slate-600 font-semibold uppercase tracking-wider">Capability</div>
              {cols.map((c) => (
                <div key={c.key}
                  className={`px-3 py-4 text-center border-l border-slate-800/50 ${c.highlight ? "bg-blue-500/8" : ""}`}>
                  <span className="text-xs font-bold leading-tight block" style={{ color: c.highlight ? "#60a5fa" : "#475569" }}>
                    {c.label}
                  </span>
                  {c.highlight && (
                    <motion.div
                      className="w-4 h-0.5 rounded-full mx-auto mt-1.5"
                      style={{ background: "#3b82f6" }}
                      animate={{ scaleX: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              ))}
            </div>

            {rows.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.35 + i * 0.04 }}
                className={`grid border-b border-slate-900/70 last:border-0 hover:bg-slate-800/15 transition-colors ${i % 2 === 0 ? "bg-slate-900/10" : ""}`}
                style={{ gridTemplateColumns: "1fr repeat(5, minmax(88px, 1fr))" }}
              >
                <div className="p-4 text-slate-400 text-sm flex items-center leading-snug">{row.feature}</div>
                {cols.map((c) => (
                  <div key={c.key}
                    className={`p-4 flex items-center justify-center border-l border-slate-900/60 ${c.highlight ? "bg-blue-500/4" : ""}`}>
                    <Cell v={row[c.key as keyof typeof row] as boolean | string} />
                  </div>
                ))}
              </motion.div>
            ))}

            {/* Summary bar */}
            <div className="border-t border-slate-700/20 bg-slate-950/60 px-4 py-5">
              <div className="grid items-center" style={{ gridTemplateColumns: "1fr repeat(5, minmax(88px, 1fr))" }}>
                <span className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Score</span>
                {cols.map((c, ci) => {
                  const yes = rows.filter(r => r[c.key as keyof typeof r] === true).length;
                  const pct = Math.round((yes / rows.length) * 100);
                  return (
                    <div key={c.key} className={`flex flex-col items-center gap-1 border-l border-slate-800/30 px-2 ${c.highlight ? "bg-blue-500/5" : ""}`}>
                      <span className="text-sm font-black" style={{ color: c.highlight ? "#3b82f6" : "#475569" }}>{pct}%</span>
                      <div className="w-full h-1 rounded-full bg-slate-800">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${pct}%` } : {}}
                          transition={{ delay: 0.5 + ci * 0.05, duration: 0.8, ease: "easeOut" }}
                          style={{ background: c.highlight ? "#3b82f6" : "#334155" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-8 card-glass rounded-2xl border border-blue-500/15 p-6 text-center"
          >
            <p className="text-slate-300 text-base leading-relaxed max-w-3xl mx-auto">
              The combination of{" "}
              <span className="text-blue-300 font-semibold">open source</span>,{" "}
              <span className="text-purple-300 font-semibold">GitHub-native delivery</span>,{" "}
              <span className="text-teal-300 font-semibold">AI-generated rewrites</span>,{" "}
              <span className="text-green-300 font-semibold">zero new infrastructure</span>, and{" "}
              <span className="text-amber-300 font-semibold">full automation</span>{" "}
              does not exist in any other tool. That is not a positioning claim — it is a feature checklist.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// POLICY AS CODE + ADVANCED PRACTICES SECTION
// ─────────────────────────────────────────────
function PolicyAsCode() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeTab, setActiveTab] = useState(0);

  const policyFile = [
    "# .vale/styles/Jargon/jargon.yml",
    "extends: existence",
    'message: "\'%s\' is jargon. Use plain English instead."',
    "level: error",
    "tokens:",
    "  - utilize",
    "  - leverage",
    "  - paradigm",
    "  - synergize",
    "  - best practices",
    "  - going forward",
    "  - circle back",
  ];

  const shiftLeftSteps = [
    { label: "Write docs",   sub: "Contributor drafts", phase: "before", col: "#334155" },
    { label: "Open PR",      sub: "Pipeline triggers",  phase: "gate",   col: "#3b82f6" },
    { label: "Review",       sub: "Automated — 25 sec", phase: "gate",   col: "#3b82f6" },
    { label: "Merge",        sub: "Clean writing only",  phase: "after",  col: "#334155" },
    { label: "Deploy",       sub: "MkDocs publishes",   phase: "after",  col: "#334155" },
  ];

  const concepts = [
    {
      id: 0,
      tag: "Policy as Code",
      title: "Your writing standard is a file in the repo",
      accent: "#3b82f6",
      border: "rgba(59,130,246,0.2)",
      icon: FileText,
      body: [
        "The Vale configuration is not a document — it is executable policy. Just as Open Policy Agent defines what is allowed in your infrastructure, and Sentinel defines what Terraform plans can be approved, the jargon ruleset defines what writing can be merged.",
        "The policy lives in version control. Changes to it go through pull requests. Every edit is reviewed, audited, and reversible. The same practices that govern your code now govern your communication standards.",
        "This is precisely the definition of Policy as Code: machine-readable rules that enforce organizational standards automatically, at the point of change, with no human required to remember to check.",
      ],
      compare: [
        { label: "Open Policy Agent", use: "Controls what API calls are permitted" },
        { label: "Sentinel (HashiCorp)", use: "Controls what infrastructure changes can deploy" },
        { label: "Conftest", use: "Controls what Kubernetes manifests can be applied" },
        { label: "Invisible Mentors / Vale", use: "Controls what writing can be merged" },
      ],
    },
    {
      id: 1,
      tag: "Shift Left",
      title: "Fix it the moment it is written, not days later",
      accent: "#10b981",
      border: "rgba(16,185,129,0.2)",
      icon: ArrowRight,
      body: [
        "Shift Left is the principle of moving quality checks earlier in the software delivery lifecycle. In traditional development, testing happened at the end — after the code was written, integrated, and staged. The cost of fixing bugs found late is an order of magnitude higher than catching them early.",
        "Documentation has historically been the last thing checked. A maintainer reads the PR days after it was opened. Invisible Mentors shifts that check to the moment the PR is created — automatically, with no human involvement required.",
        "The result is that the contributor receives feedback while the context is still fresh. The cost of correction drops to near zero. The feedback loop that used to take 4 days now closes in 25 seconds.",
      ],
      compare: [
        { label: "Security scanning", use: "SAST/DAST tools shifted into CI from penetration testing" },
        { label: "Dependency audits", use: "npm audit, Dependabot — runs on every PR" },
        { label: "Code formatting", use: "Prettier, ESLint — run on every commit" },
        { label: "Writing quality", use: "Invisible Mentors — runs on every PR (now)" },
      ],
    },
    {
      id: 2,
      tag: "Docs as Code",
      title: "Documentation is software. Treat it that way.",
      accent: "#a855f7",
      border: "rgba(168,85,247,0.2)",
      icon: GitPullRequest,
      body: [
        "Docs as Code is the practice of applying software engineering discipline to documentation: version control, pull requests, automated testing, continuous deployment, and peer review. The documentation lives in the same repository as the code that it describes.",
        "Invisible Mentors extends this discipline with automated quality enforcement. The documentation does not just go through a pull request — the pull request is gated on writing quality. The CI pipeline is the reviewer.",
        "This means documentation quality is now auditable, reproducible, and measurable — exactly like test coverage or type safety. You can see the history of every policy change. You can roll back a bad rule. You can propose a new standard through a PR.",
      ],
      compare: [
        { label: "Code review", use: "Automated via linters, static analysis, CI" },
        { label: "Code testing", use: "Automated via unit tests, integration tests" },
        { label: "Code formatting", use: "Automated via formatters on every commit" },
        { label: "Docs quality", use: "Automated via Invisible Mentors on every PR" },
      ],
    },
    {
      id: 3,
      tag: "AI in the Loop",
      title: "The AI is a pipeline step, not a product",
      accent: "#f59e0b",
      border: "rgba(245,158,11,0.2)",
      icon: Bot,
      body: [
        "Most AI writing tools are products — you open them, paste your text, and get output. They live outside the development workflow. Using them is optional. Invisible Mentors treats the AI as a pipeline step, the same way you would treat a linter or a test runner.",
        "Gemini 2.5 Flash is invoked by the CI system, receives structured input (the flagged passages and surrounding context), and returns structured output (a rewrite table). The model has no memory, no state, no interface. It is a function call in a pipeline.",
        "This architecture means the AI scales with your contributor volume at zero marginal cost, runs consistently on every PR without human intervention, and can be replaced with any model — local or cloud — by changing one environment variable.",
      ],
      compare: [
        { label: "Copilot", use: "Code suggestions in the editor — human decides when to invoke" },
        { label: "ChatGPT", use: "Conversational — requires human to copy, paste, and interpret" },
        { label: "Grammarly", use: "Browser extension — human must open the document in the right tool" },
        { label: "Invisible Mentors", use: "CI pipeline step — invoked automatically, output structured" },
      ],
    },
    {
      id: 4,
      tag: "GitOps",
      title: "The repo is the source of truth for everything",
      accent: "#06b6d4",
      border: "rgba(6,182,212,0.2)",
      icon: Github,
      body: [
        "GitOps is the practice of using a Git repository as the single source of truth for both the application and its operational configuration. Changes are applied through pull requests, not through manual commands or UI interactions. The desired state is always described in code.",
        "Invisible Mentors applies GitOps to writing standards. The jargon policy, the CI configuration, the MkDocs theme settings — all of it lives in the repository. Changing the writing standard means opening a PR. The change is reviewed, discussed, approved, and then applied automatically.",
        "This gives you something no traditional documentation review process has: a full audit trail. You can answer the question 'when did we decide that leverage is jargon, and who approved it?' by looking at git log.",
      ],
      compare: [
        { label: "Flux / ArgoCD", use: "GitOps for Kubernetes — repo describes desired cluster state" },
        { label: "Terraform", use: "GitOps for infrastructure — repo describes desired cloud state" },
        { label: "Ansible", use: "GitOps for configuration — repo describes desired server state" },
        { label: "Invisible Mentors", use: "GitOps for writing — repo describes desired language standard" },
      ],
    },
  ];

  const active = concepts[activeTab];

  return (
    <section ref={ref} className="py-28 relative overflow-hidden" id="practices">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      {/* Ambient glow behind active concept */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${active.accent}06, transparent 70%)` }}
        transition={{ duration: 0.6 }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-8 tracking-wide uppercase">
            <Terminal className="w-3.5 h-3.5" />
            Engineering Discipline
          </div>

          {/* Pull-quote: the "aha" moment */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="max-w-4xl mx-auto mb-10"
          >
            <h2 className="text-5xl sm:text-7xl font-black text-slate-100 leading-none tracking-tight mb-2">
              <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Policy as Code
              </span>
            </h2>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-300 leading-tight tracking-tight mb-6">
              for documentation.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              The same enforcement discipline that governs APIs, infrastructure, and Kubernetes manifests —
              applied to the one part of the stack that has never had it: writing quality.
            </p>
          </motion.div>

          {/* Three-column analogy strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4"
          >
            {[
              { label: "Open Policy Agent",     controls: "what API calls are permitted" },
              { label: "Sentinel (HashiCorp)",   controls: "what infrastructure can deploy" },
              { label: "Invisible Mentors",      controls: "what writing can be merged", highlight: true },
            ].map(item => (
              <div
                key={item.label}
                className={`rounded-xl border px-4 py-3 text-left ${
                  item.highlight
                    ? "border-cyan-500/40 bg-cyan-500/8"
                    : "border-slate-700/40 bg-slate-800/30"
                }`}
              >
                <div className={`text-xs font-bold mb-1 ${item.highlight ? "text-cyan-400" : "text-slate-400"}`}>
                  {item.label}
                </div>
                <div className="text-slate-500 text-xs leading-snug">
                  Controls {item.controls}
                </div>
              </div>
            ))}
          </motion.div>
          <p className="text-slate-600 text-xs tracking-widest uppercase font-semibold">
            Same discipline. New domain.
          </p>
        </motion.div>

        {/* ── SHIFT LEFT TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-16 card-glass rounded-2xl border border-slate-700/30 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-100 font-black text-xl">The Shift Left Timeline</h3>
              <p className="text-slate-500 text-sm mt-1">Quality enforcement moves left — from post-merge to the moment the PR opens</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/50" /><span className="text-slate-500">Manual (Days 1–4)</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span className="text-slate-400">Automated (25 sec)</span></div>
            </div>
          </div>

          <div className="relative">
            {/* Track */}
            <div className="h-1 rounded-full bg-slate-800 mb-6 relative overflow-hidden">
              <motion.div
                className="absolute h-full left-0 rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: "40%" } : {}}
                transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                style={{ background: "linear-gradient(to right, #3b82f6, #06b6d4)" }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-5 gap-2">
              {shiftLeftSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 border"
                    style={{
                      background: step.phase === "gate" ? `${step.col}20` : "rgba(30,41,59,0.5)",
                      borderColor: step.phase === "gate" ? `${step.col}60` : "rgba(255,255,255,0.07)",
                      boxShadow: step.phase === "gate" ? `0 0 16px ${step.col}30` : "none",
                    }}
                  >
                    <span className="text-[11px] font-black font-mono" style={{ color: step.phase === "gate" ? step.col : "#475569" }}>{i + 1}</span>
                  </div>
                  <p className="text-xs font-bold leading-tight mb-0.5" style={{ color: step.phase === "gate" ? "#e2e8f0" : "#475569" }}>{step.label}</p>
                  <p className="text-[10px] text-slate-600 leading-tight">{step.sub}</p>
                  {step.phase === "gate" && (
                    <div className="mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: `${step.col}15`, color: step.col, border: `1px solid ${step.col}30` }}>
                      gate
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Annotation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-6 pt-5 border-t border-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between text-sm"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 bg-red-500/15 border border-red-500/30">
                  <X className="w-2.5 h-2.5 text-red-400" />
                </div>
                <span className="text-slate-500"><span className="text-slate-300 font-semibold">Without IM:</span> A human opens the PR on Day 1, schedules a review, returns feedback on Day 4. The contributor may have moved on.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 bg-blue-500/15 border border-blue-500/30">
                  <Check className="w-2.5 h-2.5 text-blue-400" />
                </div>
                <span className="text-slate-500"><span className="text-slate-300 font-semibold">With IM:</span> The check runs the instant the PR opens. The feedback is posted in 25 seconds. The contributor fixes it the same afternoon.</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── CONCEPT TABS + POLICY CODE ── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Tab nav */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-2"
          >
            {concepts.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(i)}
                className="text-left rounded-xl px-4 py-4 border transition-all duration-200 cursor-pointer"
                style={{
                  background: activeTab === i ? `${c.accent}12` : "rgba(15,23,42,0.4)",
                  borderColor: activeTab === i ? `${c.accent}40` : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: activeTab === i ? `${c.accent}20` : "rgba(30,41,59,0.6)", border: `1px solid ${activeTab === i ? `${c.accent}40` : "rgba(255,255,255,0.06)"}` }}>
                    <c.icon className="w-3.5 h-3.5" style={{ color: activeTab === i ? c.accent : "#475569" }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: activeTab === i ? c.accent : "#475569" }}>{c.tag}</p>
                    <p className="text-xs font-semibold leading-snug" style={{ color: activeTab === i ? "#e2e8f0" : "#64748b" }}>{c.title}</p>
                  </div>
                </div>
                {activeTab === i && (
                  <motion.div className="h-px mt-3 rounded-full" style={{ background: `linear-gradient(to right, ${c.accent}60, transparent)` }}
                    layoutId="tab-underline" />
                )}
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="card-glass rounded-2xl border p-6 h-full flex flex-col gap-5"
                style={{ borderColor: active.border }}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: active.accent }}>{active.tag}</span>
                  <h3 className="text-slate-100 font-black text-xl mt-1 leading-snug">{active.title}</h3>
                </div>

                <div className="space-y-3">
                  {active.body.map((para, i) => (
                    <p key={i} className="text-slate-400 text-sm leading-relaxed">{para}</p>
                  ))}
                </div>

                {/* Comparison to analogues */}
                <div className="mt-auto rounded-xl border border-slate-800/50 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/50">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Same principle applied across the stack</p>
                  </div>
                  {active.compare.map((row) => (
                    <div key={row.label} className="grid px-4 py-2.5 border-b border-slate-900/50 last:border-0 hover:bg-slate-800/20 transition-colors"
                      style={{ gridTemplateColumns: "160px 1fr" }}>
                      <span className="text-xs font-semibold"
                        style={{ color: row.label.includes("Invisible") ? active.accent : "#64748b" }}>
                        {row.label}
                      </span>
                      <span className="text-xs text-slate-500">{row.use}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── POLICY CODE BLOCK ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className="mt-10 grid md:grid-cols-2 gap-6"
        >
          {/* The actual policy file */}
          <div className="card-glass rounded-2xl border border-blue-500/15 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/60 bg-slate-950/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-slate-500 font-mono">.vale/styles/Jargon/jargon.yml</span>
              <span className="ml-auto text-[10px] font-bold text-blue-400 uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/10">Policy File</span>
            </div>
            <div className="p-4 font-mono text-xs leading-relaxed">
              {policyFile.map((line, i) => {
                const isComment = line.startsWith("#");
                const isKey = line.includes(":") && !line.startsWith("  -");
                const isVal = line.startsWith("  -");
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="leading-6"
                  >
                    {isComment ? (
                      <span className="text-slate-600">{line}</span>
                    ) : isVal ? (
                      <span>
                        <span className="text-slate-600">  - </span>
                        <span className="text-red-400">{line.replace("  - ", "")}</span>
                      </span>
                    ) : isKey ? (
                      <span>
                        <span className="text-blue-300">{line.split(":")[0]}</span>
                        <span className="text-slate-500">:</span>
                        <span className="text-amber-300"> {line.split(":").slice(1).join(":")}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">{line}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* What makes this Policy as Code */}
          <div className="flex flex-col gap-4">
            <div className="card-glass rounded-2xl border border-slate-700/30 p-5">
              <h4 className="text-slate-100 font-bold text-base mb-3">What makes this Policy as Code</h4>
              {[
                { label: "Declarative", body: "You describe what is disallowed, not how to find it. The engine decides the implementation." },
                { label: "Version-controlled", body: "The policy file lives in git. Every change is tracked, reviewed, and reversible." },
                { label: "Enforceable", body: "The CI pipeline fails if the policy is violated. Merging around it requires explicit action." },
                { label: "Auditable", body: "git log shows exactly when each rule was added and who approved it." },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className="flex gap-3 py-2.5 border-b border-slate-800/40 last:border-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-200 text-xs font-bold">{item.label} — </span>
                    <span className="text-slate-500 text-xs">{item.body}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="card-glass rounded-2xl border border-slate-700/30 p-5">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold mb-3">Industry context</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Open Policy Agent, Sentinel, and Conftest apply Policy as Code to infrastructure and security.
                Invisible Mentors applies the same principle to the written word — the first tool to do so
                inside a Git-native, AI-augmented CI pipeline.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stack = [
    { name: "GitHub", role: "Version control & source of truth", detail: "Enterprise-grade version control with built-in CI/CD infrastructure", icon: Github, color: "text-slate-300", border: "border-slate-700/50" },
    { name: "GitHub Actions", role: "Automation engine", detail: "Triggers the full pipeline on every pull request — zero configuration for contributors", icon: Zap, color: "text-blue-400", border: "border-blue-500/20" },
    { name: "Vale", role: "Prose linter", detail: "Open source prose linter enforcing style rules against a custom jargon ruleset", icon: FileText, color: "text-sky-400", border: "border-sky-500/20" },
    { name: "Gemini 2.5 Flash", role: "AI mentor", detail: "Reads flagged text in context and generates a human-quality rewrite with reasoning", icon: Bot, color: "text-teal-400", border: "border-teal-500/20" },
    { name: "MkDocs Material", role: "Documentation site", detail: "Renders the docs as a fast, searchable, professional website — auto-deployed after every clean PR", icon: Globe, color: "text-green-400", border: "border-green-500/20" },
    { name: "GitHub Pages", role: "Hosting", detail: "Free, automatic hosting with custom domain support — zero monthly cost for public repositories", icon: Rocket, color: "text-purple-400", border: "border-purple-500/20" },
  ];

  return (
    <section ref={ref} className="py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Code2 className="w-3.5 h-3.5" />
            The Stack
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            All Open Source.{" "}
            <span className="gradient-text">No Vendor Lock-In.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Every tool in this pipeline is free, open source, and replaceable. No platform dependency. No monthly fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stack.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09 }}
              className={`card-glass card-glass-hover rounded-2xl p-6 border ${item.border}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-lg bg-navy-800 border ${item.border} flex items-center justify-center`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-slate-100 font-bold text-sm">{item.name}</div>
                  <div className={`text-xs ${item.color} font-medium`}>{item.role}</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Conference() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 relative" id="conference">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/30 to-navy-950 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="card-glass rounded-3xl border border-blue-500/20 p-12 glow-blue"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Live Presentation
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4 leading-tight">
            Linux Foundation<br />
            <span className="gradient-text-gold">Open Source Summit</span>
          </h2>

          <p className="text-slate-400 text-lg mb-2">May 2026</p>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <h3 className="text-xl font-bold text-slate-200 mb-6 leading-snug max-w-2xl mx-auto">
            "Architecting for Onboarding: Building a Docs-as-Code Pipeline
            for Open Source Sustainability"
          </h3>

          <div className="flex flex-col items-center gap-1 mb-10">
            <p className="text-slate-200 font-semibold text-lg">Sai Sravan Cherukuri</p>
            <p className="text-slate-400 text-sm">Enterprise Modernization Architect · Platform Engineer</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://saisravan909.github.io/Invisible-Mentors"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              <Globe className="w-4 h-4" />
              View Documentation
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <a
              href="https://github.com/saisravan909/Invisible-Mentors"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// LIVE JARGON DETECTOR
// ─────────────────────────────────────────────
const JARGON_MAP: Record<string, string> = {
  utilize: "use", leverage: "use", paradigm: "approach", paradigms: "approaches",
  synergize: "collaborate", facilitate: "help", implement: "set up",
  robust: "reliable", seamless: "smooth", "cutting-edge": "modern",
  "game-changer": "major improvement", revolutionary: "new",
  "best practices": "recommended steps", "going forward": "from now on",
  "at the end of the day": "ultimately", "circle back": "follow up",
  "touch base": "connect", "deep dive": "close look", actionable: "practical",
};

function JargonDetector() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [text, setText] = useState("We should leverage our existing paradigms to utilize the new framework and facilitate seamless collaboration.");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Array<{ word: string; suggestion: string; col: number }>>([]);
  const [scanned, setScanned] = useState(false);
  const [view, setView] = useState<"demo" | "actions">("demo");
  const [expandedStep, setExpandedStep] = useState<number | null>(4);

  // Live CI trigger state
  type CIRun = { id: number; html_url: string; run_number: number; status: string; conclusion: string | null; created_at: string };
  type CIStep = { name: string; status: string; conclusion: string | null; number: number; started_at: string | null; completed_at: string | null };
  const [ciStatus, setCiStatus] = useState<"idle" | "triggering" | "polling" | "done" | "error">("idle");
  const [ciSha, setCiSha] = useState<string | null>(null);
  const [ciRun, setCiRun] = useState<CIRun | null>(null);
  const [ciSteps, setCiSteps] = useState<CIStep[]>([]);
  const [ciCommitUrl, setCiCommitUrl] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const startPolling = useCallback((sha: string) => {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 40) { clearInterval(pollRef.current!); setCiStatus("done"); return; }
      try {
        const resp = await fetch(
          `https://api.github.com/repos/saisravan909/Invisible-Mentors/actions/runs?head_sha=${sha}&per_page=5`,
          { headers: { "User-Agent": "im-demo" } }
        );
        const data = await resp.json();
        const run: CIRun | undefined = data.workflow_runs?.[0];
        if (!run) return;
        setCiRun(run);
        // Fetch live steps
        const jobsResp = await fetch(
          `https://api.github.com/repos/saisravan909/Invisible-Mentors/actions/runs/${run.id}/jobs`
        );
        const jobsData = await jobsResp.json();
        const steps: CIStep[] = jobsData?.jobs?.[0]?.steps ?? [];
        setCiSteps(steps);
        if (run.status === "completed") {
          clearInterval(pollRef.current!);
          setCiStatus("done");
        }
      } catch {}
    }, 3000);
  }, []);

  const scan = useCallback(async () => {
    setScanning(true);
    setResults([]);
    setScanned(false);
    setView("demo");
    // Reset CI state for new scan
    if (pollRef.current) clearInterval(pollRef.current);
    setCiStatus("triggering");
    setCiSha(null);
    setCiRun(null);
    setCiSteps([]);
    setCiCommitUrl(null);

    await new Promise(r => setTimeout(r, 900));
    const found: Array<{ word: string; suggestion: string; col: number }> = [];
    const lower = text.toLowerCase();
    Object.entries(JARGON_MAP).forEach(([word, suggestion]) => {
      let idx = lower.indexOf(word);
      while (idx !== -1) {
        found.push({ word, suggestion, col: idx + 1 });
        idx = lower.indexOf(word, idx + 1);
      }
    });
    found.sort((a, b) => a.col - b.col);
    setResults(found);
    setScanned(true);
    setScanning(false);

    // Fire & forget: commit to GitHub to trigger real CI
    try {
      const resp = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await resp.json();
      if (data.commitSha) {
        setCiSha(data.commitSha);
        setCiCommitUrl(data.commitUrl ?? null);
        setCiStatus("polling");
        startPolling(data.commitSha);
      } else {
        setCiStatus("error");
      }
    } catch {
      setCiStatus("error");
    }
  }, [text, startPolling]);

  const highlighted = results.length > 0
    ? text.replace(new RegExp(`\\b(${results.map(r => r.word).join("|")})\\b`, "gi"),
        '<mark class="bg-red-500/25 text-red-300 rounded px-0.5 border border-red-500/30">$1</mark>')
    : text;

  const hasJargon = results.length > 0;

  // GitHub Actions steps — step 4 (Vale) status depends on scan result
  const actionSteps = [
    { name: "Set up job",            cmd: "actions/runner",                           dur: "0s",   status: "done" },
    { name: "Checkout code",         cmd: "actions/checkout@v4",                     dur: "0.8s", status: "done" },
    { name: "Set up Python 3.x",     cmd: "actions/setup-python@v5",                 dur: "1.2s", status: "done" },
    { name: "Install dependencies",  cmd: "pip install mkdocs-material google-genai", dur: "3.4s", status: "done" },
    {
      name: "Vale Jargon Check",
      cmd: "vale --config .vale.ini docs/",
      dur: hasJargon ? "1.1s" : "0.9s",
      status: scanned ? (hasJargon ? "fail" : "done") : "queued",
      logs: scanned && hasJargon
        ? [
            "  Linting docs/your-snippet.md...",
            ...results.map(r => `  docs/your-snippet.md:1:${r.col}  error  '${r.word}' → '${r.suggestion}'  Jargon.jargon`),
            `  ✖ ${results.length} error${results.length > 1 ? "s" : ""} — exit status 1`,
          ]
        : scanned
        ? ["  Linting docs/...", "  ✔ 0 errors — exit status 0"]
        : [],
    },
    {
      name: "AI Mentor Audit",
      cmd: "python ai_mentor.py --table",
      dur: hasJargon ? "2.1s" : "skipped",
      status: scanned ? (hasJargon ? "done" : "skip") : "queued",
      logs: scanned && hasJargon
        ? [
            "  → Connecting to Gemini 2.5 Flash API...",
            `  → Sending ${results.length} flagged passage${results.length > 1 ? "s" : ""} (${results.length * 85} tokens)`,
            "  → Received rewrite suggestions",
            "  → Posting sticky comment to PR...",
            "  ✓ Comment posted successfully",
          ]
        : ["  Skipped — Vale found no issues"],
    },
    {
      name: "Deploy to GitHub Pages",
      cmd: "mkdocs gh-deploy --force",
      dur: scanned && !hasJargon ? "2.3s" : "skipped",
      status: scanned ? (!hasJargon ? "done" : "skip") : "queued",
      logs: scanned && !hasJargon
        ? ["  INFO  -  Documentation built in 2.1s", "  INFO  -  Deploying to GitHub Pages...", "  ✔ Docs live at saisravan909.github.io/Invisible-Mentors/"]
        : ["  Skipped — jargon issues must be resolved first"],
    },
  ];

  type StepStatus = "done" | "fail" | "skip" | "queued" | "running";

  const StatusIcon = ({ status }: { status: StepStatus }) => {
    if (status === "done") return <Check className="w-4 h-4 text-green-400" />;
    if (status === "fail") return <X className="w-4 h-4 text-red-400" />;
    if (status === "skip") return <span className="text-slate-600 text-xs font-mono">⊘</span>;
    if (status === "running") return <motion.div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />;
    return <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />;
  };

  const overallStatus = !scanned ? "not-run" : hasJargon ? "fail" : "pass";

  return (
    <section ref={ref} className="py-24 relative" id="try-it">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <ScanText className="w-3.5 h-3.5" />
            Try It Live
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            Is <span className="gradient-text">Your Writing</span> Clean?
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Type any sentence. Scan it. Then toggle to see what the <span className="text-teal-300 font-semibold">actual GitHub Actions run</span> would look like — with your exact words.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-teal-500/15 overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(160deg,rgba(10,14,26,0.95),rgba(5,10,20,0.98))" }}>

          {/* Title bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-slate-600 text-xs font-mono flex-1">vale --config .vale.ini ‹your-text›</span>
            {scanned && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasJargon ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-green-400 border-green-500/30 bg-green-500/10"}`}>
                {hasJargon ? `✖ ${results.length} issue${results.length > 1 ? "s" : ""}` : "✔ clean"}
              </span>
            )}
          </div>

          {/* Input + scan area */}
          <div className="grid md:grid-cols-2 border-b border-white/5">
            {/* Input */}
            <div className="p-5 border-r border-white/5">
              <div className="text-[10px] text-teal-400 font-mono uppercase tracking-widest mb-2">Your text ↓</div>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setScanned(false); setResults([]); }}
                className="w-full h-36 bg-slate-900/60 rounded-xl border border-slate-700/40 text-slate-300 text-sm font-mono p-3 resize-none focus:outline-none focus:border-teal-500/40 transition-colors"
                placeholder="Paste your documentation here..."
              />
              <JargonMeter text={text} />
              <button onClick={scan} disabled={scanning || !text.trim()}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50"
                style={{ background: scanning ? "rgba(20,184,166,0.15)" : "rgba(20,184,166,0.2)", border: "1px solid rgba(20,184,166,0.3)", color: "#2dd4bf" }}>
                {scanning
                  ? <><motion.div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />Scanning...</>
                  : <><Wand2 className="w-4 h-4" />Scan for Jargon</>}
              </button>
            </div>

            {/* Quick results panel */}
            <div className="p-5">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Vale output ↓</div>
              {!scanned && !scanning && (
                <div className="h-36 flex flex-col items-center justify-center gap-2 text-slate-700">
                  <Wand2 className="w-6 h-6 opacity-30" />
                  <span className="text-sm font-mono">Click "Scan for Jargon" →</span>
                </div>
              )}
              {scanning && (
                <div className="h-36 flex flex-col gap-1.5 overflow-hidden justify-center px-2">
                  {["Parsing rules from .vale.ini…", "Loading Jargon.yml style guide…", "Scanning document…", "Checking passive voice…", "Checking jargon list…"].map((l, i) => (
                    <motion.div key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.14 }}
                      className="text-[11px] font-mono text-slate-500">{l}</motion.div>
                  ))}
                </div>
              )}
              {scanned && results.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-36 flex flex-col items-center justify-center gap-2">
                  <Check className="w-8 h-8 text-green-400" />
                  <div className="text-green-400 font-bold text-sm">Vale exit 0 — Writing is clean!</div>
                  <div className="text-slate-600 text-xs font-mono">0 errors in 1 file</div>
                </motion.div>
              )}
              {scanned && results.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5 max-h-40 overflow-y-auto">
                  <div className="text-[11px] font-mono text-red-400 mb-1.5">✖ {results.length} error{results.length > 1 ? "s" : ""} found (exit 1)</div>
                  {results.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 bg-red-500/8 rounded-lg px-3 py-2 border border-red-500/15">
                      <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-mono text-red-300">
                          <span className="text-slate-500">col {r.col}</span> · <span className="font-bold">"{r.word}"</span>
                          <span className="text-slate-600"> → </span><span className="text-green-400">"{r.suggestion}"</span>
                        </div>
                        <div className="text-[10px] text-slate-600">Jargon.jargon</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* ── VIEW TOGGLE — appears after scan ── */}
          {scanned && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Toggle bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-slate-900/30">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-700/40">
                  <button
                    onClick={() => setView("demo")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${view === "demo" ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Demo Tool
                  </button>
                  <button
                    onClick={() => { setView("actions"); setExpandedStep(hasJargon ? 4 : 4); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${view === "actions" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <Github className="w-3.5 h-3.5" />
                    GitHub Actions
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 font-mono">LIVE</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {view === "actions" && (
                    <a href="https://github.com/saisravan909/Invisible-Mentors/actions" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors">
                      <ExternalLink className="w-3 h-3" /> View live runs
                    </a>
                  )}
                  <div className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-full border ${overallStatus === "pass" ? "text-green-400 border-green-500/30 bg-green-500/8" : overallStatus === "fail" ? "text-red-400 border-red-500/30 bg-red-500/8" : "text-slate-500 border-slate-700"}`}>
                    {overallStatus === "pass" ? "✔ Pipeline passed" : overallStatus === "fail" ? "✖ Pipeline failed" : "○ Not run"}
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {view === "demo" && (
                  <motion.div key="demo" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}>
                    {results.length > 0 && (
                      <div className="p-5 border-b border-white/5">
                        <div className="text-[10px] text-purple-400 font-mono uppercase tracking-widest mb-2">Highlighted text ↓</div>
                        <div className="bg-slate-900/60 rounded-xl border border-purple-500/15 p-4 text-sm text-slate-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: highlighted }} />
                        <div className="mt-3 flex items-center gap-2 text-[11px]">
                          <Bot className="w-3 h-3 text-purple-400" />
                          <span className="text-slate-500">In the real pipeline, Gemini 2.5 Flash generates a full rewrite and posts it as a structured PR comment.</span>
                          <button onClick={() => setView("actions")} className="ml-auto text-purple-400 hover:text-purple-300 text-[11px] flex items-center gap-1 shrink-0 transition-colors">
                            See it in GitHub Actions <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="p-5 bg-slate-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <Code2 className="w-3.5 h-3.5 text-green-400" />
                          Add to <span className="text-green-300">.github/workflows/mentor.yml</span>
                        </div>
                        <button onClick={() => navigator.clipboard.writeText(`- name: Vale Jargon Check\n  uses: errata-ai/vale-action@reviewdog\n  with:\n    files: docs/\n    filter_mode: nofilter\n    reporter: github-pr-review`)}
                          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-green-400 transition-colors">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <div className="bg-[#0d1117] rounded-xl border border-slate-700/30 p-4 font-mono text-[11px] leading-relaxed">
                        <div className="text-slate-600">      - name: <span className="text-green-300">Vale Jargon Check</span></div>
                        <div className="text-slate-600">        uses: <span className="text-blue-300">errata-ai/vale-action@reviewdog</span></div>
                        <div className="text-slate-600">        with:</div>
                        <div className="text-slate-600">          files: <span className="text-amber-300">docs/</span></div>
                        <div className="text-slate-600">          filter_mode: <span className="text-teal-300">nofilter</span></div>
                        <div className="text-slate-600">          reporter: <span className="text-purple-300">github-pr-review</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {view === "actions" && (
                  <motion.div key="actions" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }}>

                    {/* ── Live CI Status Banner ── */}
                    <div className={`flex items-center gap-2.5 px-5 py-3 border-b text-xs font-mono flex-wrap
                      ${ciStatus === "error" ? "border-slate-700/40 bg-slate-900/30" :
                        ciStatus === "done" ? (ciRun?.conclusion === "success" ? "border-green-500/15 bg-green-500/5" : "border-red-500/15 bg-red-500/5") :
                        "border-purple-500/15 bg-purple-500/6"}`}>
                      {ciStatus === "triggering" && (
                        <>
                          <motion.div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full shrink-0" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                          <span className="text-purple-300 font-semibold">Pushing your text to GitHub…</span>
                          <span className="text-slate-600">committing docs/demo-snippet.md → triggers CI</span>
                        </>
                      )}
                      {ciStatus === "polling" && !ciRun && (
                        <>
                          <motion.div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full shrink-0" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                          <span className="text-amber-300 font-semibold">Commit pushed — waiting for runner to pick up…</span>
                          {ciCommitUrl && <a href={ciCommitUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-purple-400 hover:text-purple-300 flex items-center gap-1"><ExternalLink className="w-3 h-3" />view commit</a>}
                        </>
                      )}
                      {ciStatus === "polling" && ciRun && (
                        <>
                          <motion.div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                          <span className="text-amber-300 font-semibold">Run #{ciRun.run_number} in progress…</span>
                          <span className="text-slate-600">real pipeline running your text now</span>
                          <a href={ciRun.html_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0"><ExternalLink className="w-3 h-3" />watch live on GitHub</a>
                        </>
                      )}
                      {ciStatus === "done" && ciRun && (
                        <>
                          <span className={`font-semibold ${ciRun.conclusion === "success" ? "text-green-400" : "text-red-400"}`}>
                            {ciRun.conclusion === "success" ? "✔ Run passed" : "✖ Run failed"} · #{ciRun.run_number}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500">real CI completed on your text</span>
                          <a href={ciRun.html_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0"><ExternalLink className="w-3 h-3" />open run on GitHub</a>
                        </>
                      )}
                      {ciStatus === "error" && (
                        <>
                          <Github className="w-3 h-3 text-slate-600 shrink-0" />
                          <span className="text-slate-500">CI trigger unavailable in this environment</span>
                          <a href="https://github.com/saisravan909/Invisible-Mentors/actions" target="_blank" rel="noopener noreferrer" className="ml-auto text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0"><ExternalLink className="w-3 h-3" />view all runs →</a>
                        </>
                      )}
                      {ciStatus === "idle" && (
                        <span className="text-slate-600">Scan your text first to trigger the live pipeline</span>
                      )}
                    </div>

                    {/* ── Run header ── */}
                    <div className="px-5 py-4 border-b border-slate-800/60 bg-[#0d1117]/60">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          ciStatus === "done" && ciRun
                            ? ciRun.conclusion === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                            : ciStatus === "polling" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : hasJargon ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}>
                          {ciStatus === "polling"
                            ? <><motion.div className="w-2.5 h-2.5 border-2 border-amber-400 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} /> Running</>
                            : ciStatus === "done" && ciRun
                              ? ciRun.conclusion === "success" ? <><Check className="w-3 h-3" /> Success</> : <><X className="w-3 h-3" /> Failure</>
                              : hasJargon ? <><X className="w-3 h-3" /> Failure</> : <><Check className="w-3 h-3" /> Success</>
                          }
                        </div>
                        <div>
                          <div className="text-slate-200 text-sm font-semibold">Invisible Mentors · Lint, Mentor & Deploy</div>
                          <div className="text-slate-500 text-xs font-mono">
                            {ciRun
                              ? <>Run #{ciRun.run_number} · triggered by this demo scan</>
                              : <>Triggered by push to <span className="text-blue-400">main</span> · via demo scan</>
                            }
                          </div>
                        </div>
                        <a href={ciRun?.html_url ?? "https://github.com/saisravan909/Invisible-Mentors/actions"} target="_blank" rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-semibold hover:bg-purple-500/25 transition-colors">
                          <ExternalLink className="w-3 h-3" /> {ciRun ? "Open this run" : "View in GitHub"}
                        </a>
                      </div>
                    </div>

                    {/* ── Steps — real if available, simulation fallback ── */}
                    <div className="divide-y divide-slate-800/40">
                      {ciStatus === "done" && ciSteps.length > 0
                        ? ciSteps.map((step) => {
                            const s: StepStatus = step.conclusion === "success" ? "done" : step.conclusion === "failure" ? "fail" : step.conclusion === "skipped" ? "skip" : step.status === "in_progress" ? "running" : "queued";
                            const dur = step.started_at && step.completed_at
                              ? `${((new Date(step.completed_at).getTime() - new Date(step.started_at).getTime()) / 1000).toFixed(1)}s` : "";
                            return (
                              <div key={step.number} className="flex items-center gap-4 px-5 py-3">
                                <StatusIcon status={s} />
                                <span className={`text-sm font-semibold flex-1 ${s === "fail" ? "text-red-300" : s === "done" ? "text-slate-200" : s === "skip" ? "text-slate-600" : "text-slate-500"}`}>{step.name}</span>
                                {s === "fail" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">failed</span>}
                                {s === "skip" && <span className="text-[10px] text-slate-600 font-mono">skipped</span>}
                                <span className={`text-xs font-mono shrink-0 ${s === "done" ? "text-green-500/60" : s === "fail" ? "text-red-500/60" : "text-slate-700"}`}>{dur}</span>
                              </div>
                            );
                          })
                        : actionSteps.map((step, i) => {
                            const isExpanded = expandedStep === i;
                            const s = step.status as StepStatus;
                            const isRunning = (ciStatus === "polling") && ciSteps.length > 0
                              ? ciSteps.some(cs => cs.status === "in_progress" && cs.name.toLowerCase().includes(step.name.toLowerCase().split(" ")[0]))
                              : false;
                            const realStep = ciSteps.find(cs => cs.name.toLowerCase().includes(step.name.toLowerCase().split(" ")[0]));
                            const effectiveStatus: StepStatus = realStep
                              ? realStep.conclusion === "success" ? "done" : realStep.conclusion === "failure" ? "fail" : realStep.conclusion === "skipped" ? "skip" : realStep.status === "in_progress" ? "running" : "queued"
                              : isRunning ? "running" : s;
                            return (
                              <div key={step.name}>
                                <button onClick={() => setExpandedStep(isExpanded ? null : i)}
                                  className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-800/20 ${isExpanded ? "bg-slate-800/20" : ""}`}>
                                  <StatusIcon status={effectiveStatus} />
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-sm font-semibold ${effectiveStatus === "fail" ? "text-red-300" : effectiveStatus === "done" ? "text-slate-200" : effectiveStatus === "skip" ? "text-slate-600" : effectiveStatus === "running" ? "text-amber-300" : "text-slate-500"}`}>
                                      {step.name}
                                    </span>
                                    {effectiveStatus === "fail" && i === 4 && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">jargon detected</span>}
                                    {effectiveStatus === "skip" && <span className="ml-2 text-[10px] text-slate-600 font-mono">skipped</span>}
                                    {effectiveStatus === "running" && <span className="ml-2 text-[10px] text-amber-400/70 font-mono">running…</span>}
                                  </div>
                                  <span className={`text-xs font-mono shrink-0 ${effectiveStatus === "done" ? "text-green-500/60" : effectiveStatus === "fail" ? "text-red-500/60" : "text-slate-700"}`}>
                                    {effectiveStatus !== "queued" ? step.dur : ""}
                                  </span>
                                  {(step as { logs?: string[] }).logs && (step as { logs?: string[] }).logs!.length > 0 && (
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  )}
                                </button>
                                <AnimatePresence>
                                  {isExpanded && (step as { logs?: string[] }).logs && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                      <div className="mx-5 mb-3 bg-[#0d1117] rounded-xl border border-slate-700/30 p-4 font-mono text-[11px] leading-relaxed space-y-0.5">
                                        {(step as { logs?: string[] }).logs!.map((line, li) => (
                                          <motion.div key={li} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: li * 0.06 }}
                                            className={line.includes("✖") || line.includes("error") ? "text-red-400" : line.includes("✔") || line.includes("✓") ? "text-green-400" : line.includes("→") ? "text-blue-300" : "text-slate-500"}>
                                            {line}
                                          </motion.div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                      }
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center gap-4 px-5 py-3.5 bg-[#0d1117]/40 border-t border-slate-800/60">
                      <a href="https://github.com/saisravan909/Invisible-Mentors/actions" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors font-medium">
                        <Github className="w-3.5 h-3.5" /> All live runs on GitHub →
                      </a>
                      <a href="https://github.com/saisravan909/Invisible-Mentors/blob/main/.github/workflows/main.yml" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-400 transition-colors font-medium">
                        <Code2 className="w-3.5 h-3.5" /> Full workflow YAML →
                      </a>
                      {ciSha && <span className="text-[10px] font-mono text-slate-700 ml-auto">{ciSha.slice(0, 7)}</span>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// BEFORE / AFTER COMPARISON
// ─────────────────────────────────────────────
function BeforeAfter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 mb-3">
            One PR. <span className="gradient-text">Two Worlds.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">The same contributor. The same documentation change. The difference is everything.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5">
          {/* Before */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-red-500/20 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/8 border-b border-red-500/15">
              <X className="w-4 h-4 text-red-400" /><span className="text-red-300 font-bold text-sm">Without Invisible Mentors</span>
            </div>
            <div className="p-5 space-y-3" style={{ background: "rgba(10,5,5,0.6)" }}>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                <GitPullRequest className="w-3 h-3" /> PR #47 opened by contributor · <span className="text-red-400">Day 1, 9:02am</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl border border-slate-700/30 p-4 text-sm text-slate-400 leading-relaxed">
                "We should <span className="text-amber-300 font-semibold">utilize</span> the new system to <span className="text-amber-300 font-semibold">leverage</span> existing <span className="text-amber-300 font-semibold">paradigms</span> for seamless onboarding."
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-mono"><Clock className="w-3 h-3" /> Maintainer reviews… <span className="text-red-400">4 days later</span></div>
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">M</div><span className="text-slate-400 text-xs font-semibold">maintainer</span><span className="text-slate-600 text-xs">· 4 days ago</span></div>
                <p className="text-red-300 text-sm">"This writing is unclear. Please rewrite."</p>
              </div>
              <div className="text-center py-2">
                <span className="text-xs text-slate-600 italic">Contributor never came back.</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                {[["96h", "Time to feedback"],["1 PR", "Value lost"],["0", "Contributors gained"]].map(([v,l]) => (
                  <div key={l} className="bg-red-500/8 rounded-lg py-2">
                    <div className="text-red-400 font-black text-base">{v}</div>
                    <div className="text-slate-600 text-[9px] leading-tight">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-green-500/20 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-green-500/8 border-b border-green-500/15">
              <Check className="w-4 h-4 text-green-400" /><span className="text-green-300 font-bold text-sm">With Invisible Mentors</span>
            </div>
            <div className="p-5 space-y-3" style={{ background: "rgba(5,10,5,0.6)" }}>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                <GitPullRequest className="w-3 h-3" /> PR #47 opened by contributor · <span className="text-green-400">Day 1, 9:02am</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl border border-slate-700/30 p-4 text-sm text-slate-400 leading-relaxed">
                "We should <span className="text-red-300 line-through text-xs">utilize</span> <span className="text-green-300">use</span> the new system to <span className="text-red-300 line-through text-xs">leverage</span> <span className="text-green-300">work with</span> existing <span className="text-red-300 line-through text-xs">paradigms</span> <span className="text-green-300">approaches</span>."
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-mono"><Zap className="w-3 h-3 text-green-400" /> Pipeline runs automatically · <span className="text-green-400">28 seconds later</span></div>
              <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center"><Bot className="w-3 h-3 text-blue-400" /></div>
                  <span className="text-blue-300 text-xs font-semibold">invisible-mentors[bot]</span><span className="text-slate-600 text-xs">· just now</span>
                </div>
                <div className="text-[11px] font-mono">
                  <div className="text-slate-500">| Original | Issue | Suggestion |</div>
                  <div className="text-slate-500">|---|---|---|</div>
                  <div className="text-slate-400">| utilize | Jargon | <span className="text-green-300">use</span> |</div>
                  <div className="text-slate-400">| leverage | Jargon | <span className="text-green-300">use</span> |</div>
                  <div className="text-slate-400">| paradigms | Jargon | <span className="text-green-300">approaches</span> |</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                {[["28s", "Time to feedback"],["100%", "Automated"],["✓", "Contributor stays"]].map(([v,l]) => (
                  <div key={l} className="bg-green-500/8 rounded-lg py-2">
                    <div className="text-green-400 font-black text-base">{v}</div>
                    <div className="text-slate-600 text-[9px] leading-tight">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// AUDIENCE POLL
// ─────────────────────────────────────────────
const POLL_QUESTIONS = [
  {
    id: "q1",
    question: "Has your open source project ever lost a contributor because feedback arrived too late?",
    emoji: "⏳",
    context: "Slow reviews are the #1 contributor dropout cause according to GitHub's Octoverse report.",
  },
  {
    id: "q2",
    question: "Does your team spend 2+ hours per week manually reviewing documentation pull requests?",
    emoji: "📝",
    context: "That's 100+ hours per year — equivalent to 2.5 full work weeks per maintainer.",
  },
  {
    id: "q3",
    question: "If setup took under 5 minutes, would you deploy Invisible Mentors to your repo today?",
    emoji: "🚀",
    context: "It really is under 5 minutes. The workflow YAML is 7 lines.",
  },
];

function AudiencePoll() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);
  const [votes, setVotes] = useState<Record<string, { yes: number; no: number }>>({
    q1: { yes: 0, no: 0 }, q2: { yes: 0, no: 0 }, q3: { yes: 0, no: 0 }
  });
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const q = POLL_QUESTIONS[current];
  const v = votes[q.id];
  const total = v.yes + v.no;
  const isRevealed = revealed.has(q.id);

  const vote = (which: "yes" | "no") => {
    setVotes(prev => ({ ...prev, [q.id]: { ...prev[q.id], [which]: prev[q.id][which] + 1 } }));
    setRevealed(prev => new Set(prev).add(q.id));
  };

  const yPct = total > 0 ? Math.round((v.yes / total) * 100) : 0;
  const nPct = total > 0 ? Math.round((v.no / total) * 100) : 0;

  return (
    <section ref={ref} className="py-24 relative" id="audience-poll">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Mic className="w-3.5 h-3.5" />
            Audience Interaction
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-3">
            Show of <span className="gradient-text">Hands</span>
          </h2>
          <p className="text-slate-400">Three quick questions. Raise your hand — or scan the QR to vote on your phone.</p>
        </motion.div>

        {/* Question nav */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {POLL_QUESTIONS.map((q, i) => (
            <button key={q.id} onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 border ${i === current ? "bg-purple-500 border-purple-400 text-white scale-110" : votes[q.id].yes + votes[q.id].no > 0 ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500"}`}>
              {i + 1}
            </button>
          ))}
        </div>

        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(160deg,rgba(10,5,26,0.95),rgba(5,5,20,0.98))" }}
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{q.emoji}</span>
              <div>
                <div className="text-purple-400 text-xs font-mono uppercase tracking-widest">Question {current + 1} of {POLL_QUESTIONS.length}</div>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-100 mb-8 leading-snug">{q.question}</h3>

            {!isRevealed ? (
              <div className="grid grid-cols-2 gap-4">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => vote("yes")}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-green-500/30 bg-green-500/10 hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-200 group">
                  <ThumbsUp className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-green-300 font-black text-xl">YES</span>
                  <span className="text-green-600 text-xs">Raise your hand ✋</span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => vote("no")}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 group">
                  <ThumbsDown className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="text-red-300 font-black text-xl">NO</span>
                  <span className="text-red-600 text-xs">Keep your hand down 🤐</span>
                </motion.button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {[{ label: "Yes", pct: yPct, count: v.yes, color: "#22c55e" },
                  { label: "No",  pct: nPct, count: v.no,  color: "#ef4444" }].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-bold" style={{ color: bar.color }}>{bar.label}</span>
                      <span className="text-slate-400 text-sm font-mono">{bar.pct}% ({bar.count})</span>
                    </div>
                    <div className="h-10 rounded-xl bg-slate-800/60 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${bar.pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 rounded-xl"
                        style={{ background: `${bar.color}30`, borderRight: `2px solid ${bar.color}60` }}
                      />
                      <div className="absolute inset-0 flex items-center px-4">
                        <span className="text-lg font-black" style={{ color: bar.color }}>{bar.pct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-xl bg-blue-500/8 border border-blue-500/15 text-sm text-slate-400">
                  💡 <span className="text-slate-300">{q.context}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setVotes(prev => ({ ...prev, [q.id]: { yes: prev[q.id].yes + 1, no: prev[q.id].no } }))}
                    className="flex-1 py-2 text-xs text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition-colors">+ Yes</button>
                  <button onClick={() => setVotes(prev => ({ ...prev, [q.id]: { yes: prev[q.id].yes, no: prev[q.id].no + 1 } }))}
                    className="flex-1 py-2 text-xs text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">+ No</button>
                  {current < POLL_QUESTIONS.length - 1 && (
                    <button onClick={() => setCurrent(c => c + 1)}
                      className="flex-1 py-2 text-xs text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-colors">
                      Next question →
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SPEAKER FOOTER
// ─────────────────────────────────────────────
function QRCode({ url, label, color = "#3b82f6" }: { url: string; label: string; color?: string }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&color=3b82f6&bgcolor=0a0e1a&margin=8&format=svg`;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-3 rounded-2xl border border-white/10" style={{ background: "rgba(10,14,26,0.8)" }}>
        <img src={qrUrl} alt={`QR code for ${label}`} className="w-28 h-28 rounded-xl" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }} />
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold" style={{ color }}>{label}</div>
        <div className="text-[10px] text-slate-600 font-mono truncate max-w-32">{url.replace("https://","")}</div>
      </div>
    </div>
  );
}

function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("saisravan@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer ref={ref} className="relative border-t border-blue-500/10 overflow-hidden">
      {/* Glow backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Speaker hero card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="max-w-5xl mx-auto px-6 py-16 relative"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Mic className="w-3.5 h-3.5" />
            Meet the Speaker
          </div>
          <h2 className="text-3xl font-black text-slate-100">Let's Connect</h2>
        </div>

        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-8 items-center">
          {/* Speaker card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-blue-500/20 p-6 text-center"
            style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.08),rgba(15,23,42,0.9))" }}
          >
            {/* Photo */}
            <div className="relative inline-block mb-5">
              <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl scale-110" />
              <motion.img
                src="/sai-sravan.jpg"
                alt="Sai Sravan Cherukuri"
                animate={{ boxShadow: ["0 0 20px rgba(59,130,246,0.3)", "0 0 40px rgba(59,130,246,0.5)", "0 0 20px rgba(59,130,246,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative w-32 h-32 rounded-full object-cover object-center border-4 border-blue-500/40"
              />
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-navy-950 flex items-center justify-center">
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-100">Sai Sravan Cherukuri</h3>
            <p className="text-blue-400 text-sm font-semibold mt-1">Open Source Ambassador</p>
            <p className="text-slate-500 text-xs mt-0.5">Invisible Mentors · Linux Foundation 2026</p>

            <div className="flex flex-col gap-2 mt-5">
              <a href="https://www.saisravancherukuri.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold hover:bg-blue-600/30 transition-all">
                <Globe className="w-3.5 h-3.5" />
                saisravancherukuri.com
              </a>
              <a href="https://github.com/saisravan909" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-semibold hover:border-slate-600 transition-all">
                <Github className="w-3.5 h-3.5" />
                github.com/saisravan909
              </a>
              <button onClick={copyEmail}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-semibold hover:border-slate-600 transition-all">
                {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></> : <><Mail className="w-3.5 h-3.5" />saisravan@gmail.com</>}
              </button>
            </div>

            {/* Conference badge */}
            <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold">Linux Foundation · May 2026</span>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="hidden lg:flex flex-col items-center gap-4">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-600/40 to-transparent" />
            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center">
              <Link className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-600/40 to-transparent" />
          </div>

          {/* QR Codes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.25 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="text-center mb-2">
              <h4 className="text-slate-200 font-bold">Scan to Connect</h4>
              <p className="text-slate-500 text-xs mt-1">Take the demo with you or vote from your phone</p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <QRCode
                url="https://im.saisravancherukuri.com"
                label="Live Demo Site"
                color="#3b82f6"
              />
              <QRCode
                url="https://im.saisravancherukuri.com/#audience-poll"
                label="Vote on Your Phone"
                color="#a855f7"
              />
            </div>

            <div className="text-center space-y-2 mt-2">
              <a href="https://github.com/saisravan909/Invisible-Mentors" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-slate-300 text-sm font-semibold hover:border-slate-600 transition-all">
                <Github className="w-4 h-4" />
                Star us on GitHub
                <Star className="w-3.5 h-3.5 text-amber-400" />
              </a>
              <p className="text-slate-600 text-xs">MIT Licensed · Built for the open source community</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo.png" alt="Invisible Mentors" className="h-7 w-auto opacity-60" />
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Heart className="w-3 h-3 text-red-400/60" />
            <span>Built with love for the open source community</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/saisravan909/Invisible-Mentors" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-300 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="https://saisravan909.github.io/Invisible-Mentors" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-300 transition-colors"><Globe className="w-4 h-4" /></a>
            <a href="https://www.saisravancherukuri.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-300 transition-colors"><Link className="w-4 h-4" /></a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

export default function App() {
  // Keyboard navigation: press 1-7 to jump to sections
  useEffect(() => {
    const sections = ["how-it-works","live-demo","try-it","impact","audience-poll","conference","speakers"];
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const n = parseInt(e.key);
      if (n >= 1 && n <= sections.length) {
        document.getElementById(sections[n - 1])?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950">
      <Nav />
      <Hero />
      <Problem />
      <Impact />
      <AnalogySplash />
      <PolicyAsCode />
      <HowItWorks />
      <SpeedTheater />
      <LiveDemo />
      <BeforeAfter />
      <ROICalculator />
      <WhyUs />
      <TechStack />
      <Conference />
      <Footer />
    </div>
  );
}
