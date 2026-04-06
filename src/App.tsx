import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Github, ExternalLink, ChevronDown, Check, X,
  Zap, Shield, GitPullRequest, Bot, Rocket, Globe,
  Clock, Users, TrendingUp, Code2, FileText, Terminal,
  ArrowRight, Play, RotateCcw, AlertCircle, Sparkles
} from "lucide-react";

type DemoState = "idle" | "scanning" | "flagged" | "analyzing" | "complete";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
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
        <div className="hidden md:flex items-center gap-8">
          {["How It Works", "Live Demo", "Impact", "Conference"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
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
    </motion.nav>
  );
}

function Hero() {
  const steps = [
    { icon: GitPullRequest, label: "PR Opened", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: FileText, label: "Vale Scans", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
    { icon: Bot, label: "AI Analyzes", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
    { icon: Check, label: "Docs Deploy", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center grid-bg overflow-hidden pt-20">
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Linux Foundation Open Source Summit · May 2026
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

        {/* Mini pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex items-center justify-center gap-2 flex-wrap"
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

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      number: "01",
      icon: GitPullRequest,
      title: "Contributor Opens a PR",
      description: "A new contributor submits documentation changes. The pipeline triggers automatically — no configuration needed.",
      color: "text-blue-400",
      glow: "shadow-blue-500/20",
      border: "border-blue-500/20",
    },
    {
      number: "02",
      icon: FileText,
      title: "Vale Scans the Writing",
      description: "Vale checks every line against the project's style guide — flagging jargon, passive voice, and corporate speak.",
      color: "text-sky-400",
      glow: "shadow-sky-500/20",
      border: "border-sky-500/20",
    },
    {
      number: "03",
      icon: Bot,
      title: "Gemini AI Reads the Flags",
      description: "When Vale finds issues, Gemini 2.5 Flash reads the full context and generates a human-quality rewrite.",
      color: "text-teal-400",
      glow: "shadow-teal-500/20",
      border: "border-teal-500/20",
    },
    {
      number: "04",
      icon: GitPullRequest,
      title: "Feedback Posted to the PR",
      description: "The mentor's suggestion appears directly in the pull request as a structured comment — with the original, the problem, and the fix.",
      color: "text-purple-400",
      glow: "shadow-purple-500/20",
      border: "border-purple-500/20",
    },
    {
      number: "05",
      icon: Code2,
      title: "Contributor Fixes and Pushes",
      description: "The contributor applies the feedback and pushes again. The pipeline re-runs automatically — no manual trigger.",
      color: "text-amber-400",
      glow: "shadow-amber-500/20",
      border: "border-amber-500/20",
    },
    {
      number: "06",
      icon: Rocket,
      title: "Docs Deploy Automatically",
      description: "Once the writing is clean, the documentation site builds and deploys to GitHub Pages. The maintainer was never paged.",
      color: "text-green-400",
      glow: "shadow-green-500/20",
      border: "border-green-500/20",
    },
  ];

  return (
    <section ref={ref} className="py-28 relative bg-gradient-to-b from-transparent to-navy-900/30">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            The Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            Six Steps.{" "}
            <span className="gradient-text">Zero Manual Reviews.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            The entire pipeline runs in under 60 seconds. The maintainer only looks at the PR
            after the writing is already clean.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`card-glass card-glass-hover rounded-2xl p-7 border ${step.border} shadow-lg ${step.glow}`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl bg-navy-800 border ${step.border} flex items-center justify-center`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <span className={`text-5xl font-black opacity-10 ${step.color}`}>{step.number}</span>
              </div>
              <h3 className="text-slate-100 font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
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

function LiveDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const ref = useRef(null);

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

            {/* Mentor result */}
            <AnimatePresence>
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 rounded-xl bg-navy-900/60 border border-blue-500/20 overflow-hidden"
                >
                  <div className="px-5 py-3 bg-blue-950/40 border-b border-blue-500/15 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-semibold">Invisible Mentor — PR Comment</span>
                    <span className="ml-auto text-xs text-slate-500 font-mono">Posted automatically · 0 human reviews</span>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                      Found <span className="text-red-400 font-semibold">3 jargon phrases</span> that reduce clarity for new contributors. Here is the suggested rewrite:
                    </p>
                    <div className="rounded-lg bg-navy-950/80 border border-green-500/20 p-4 font-mono text-sm text-green-300 mb-4">
                      We encourage you to <span className="text-green-400 font-semibold">use</span> our setup script
                      to <span className="text-green-400 font-semibold">use</span> the latest <span className="text-green-400 font-semibold">approaches</span> in open source collaboration.
                    </div>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-500 font-mono">
                          <th className="text-left pb-2 font-normal">Original</th>
                          <th className="text-left pb-2 font-normal">Suggested</th>
                          <th className="text-left pb-2 font-normal">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MENTOR_FEEDBACK.map((f) => (
                          <tr key={f.original} className="border-t border-slate-800">
                            <td className="py-2 pr-4 text-red-400 font-mono">{f.original}</td>
                            <td className="py-2 pr-4 text-green-400 font-mono">{f.suggested}</td>
                            <td className="py-2 text-slate-400 leading-snug">{f.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
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
        </div>
      </div>
    </section>
  );
}

function Impact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const metrics = [
    { value: 10, suffix: "×", label: "More contributors one maintainer can support without increasing review hours", color: "text-blue-400" },
    { value: 60, suffix: "%", label: "Reduction in maintainer review time per pull request", color: "text-teal-400" },
    { value: 0, suffix: " fees", label: "Additional infrastructure cost — runs entirely on GitHub's free CI/CD tier", color: "text-green-400" },
    { value: 100, suffix: "%", label: "Audit trail coverage — every PR has a documented, timestamped review", color: "text-amber-400" },
  ];

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
            Business Case
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4">
            The Return Is{" "}
            <span className="gradient-text">Measurable</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Not theoretical. Measured in maintainer hours recovered and contributors retained.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="card-glass card-glass-hover rounded-2xl p-7 border border-blue-500/10 text-center"
            >
              <div className={`text-5xl font-black mb-3 ${m.color}`}>
                <CountUp target={m.value} suffix={m.suffix} />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{m.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-5"
        >
          {[
            { icon: Shield, title: "Enterprise Security", desc: "Zero-trust principles. All credentials in GitHub Secrets. No API keys in code, no third-party data handling.", color: "text-blue-400", border: "border-blue-500/20" },
            { icon: Globe, title: "Fully Open Source", desc: "Every component is open source. MIT licensed. No vendor lock-in. Copy four files and you have a mentor in your project.", color: "text-teal-400", border: "border-teal-500/20" },
            { icon: Zap, title: "Under 60 Seconds", desc: "From PR open to mentor feedback in under one minute. Contributors get answers faster than they can make coffee.", color: "text-amber-400", border: "border-amber-500/20" },
          ].map((item) => (
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

function Footer() {
  return (
    <footer className="py-10 border-t border-blue-500/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <img src="/logo.png" alt="Invisible Mentors" className="h-7 w-auto opacity-70" />
        </div>
        <p className="text-slate-600 text-sm">
          MIT Licensed · Built for the global open source community
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/saisravan909/Invisible-Mentors" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://saisravan909.github.io/Invisible-Mentors" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <LiveDemo />
      <Impact />
      <TechStack />
      <Conference />
      <Footer />
    </div>
  );
}
