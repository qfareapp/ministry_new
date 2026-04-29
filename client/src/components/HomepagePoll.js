import React, { useEffect, useState } from "react";
import axios from "axios";

const API_ORIGIN =
  process.env.REACT_APP_API_ORIGIN || "https://ministry-new.onrender.com";

const POLL_OPTIONS = [
  {
    label: "BJP",
    logo: "/assets/poll-logos/bjp.png",
    color: "#f97316",
    tone: "from-orange-400 via-orange-500 to-amber-500",
    bg: "bg-orange-500/10 border-orange-400/30 hover:bg-orange-500/20 hover:border-orange-400/60",
    selectedBg: "bg-orange-500/20 border-orange-400",
    stroke: "#f97316",
  },
  {
    label: "TMC",
    logo: "/assets/poll-logos/tmc.webp",
    color: "#10b981",
    tone: "from-emerald-400 via-green-500 to-teal-500",
    bg: "bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/20 hover:border-emerald-400/60",
    selectedBg: "bg-emerald-500/20 border-emerald-400",
    stroke: "#10b981",
  },
  {
    label: "CPI(M)",
    logo: "/assets/poll-logos/cpim.png",
    color: "#ef4444",
    tone: "from-rose-500 via-red-600 to-red-700",
    bg: "bg-red-500/10 border-red-400/30 hover:bg-red-500/20 hover:border-red-400/60",
    selectedBg: "bg-red-500/20 border-red-400",
    stroke: "#ef4444",
  },
  {
    label: "INC",
    logo: "/assets/poll-logos/inc.png",
    color: "#38bdf8",
    tone: "from-sky-400 via-cyan-500 to-blue-600",
    bg: "bg-sky-500/10 border-sky-400/30 hover:bg-sky-500/20 hover:border-sky-400/60",
    selectedBg: "bg-sky-500/20 border-sky-400",
    stroke: "#38bdf8",
  },
];

const POLL_STORAGE_KEY = "homepage-party-poll-v1";
const POLL_ANCHOR_ID = "homepage-poll";
const GRAPH_WIDTH = 360;
const GRAPH_HEIGHT = 160;
const GRAPH_PADDING = 16;

const getStoredVote = () => {
  try {
    const raw = localStorage.getItem(POLL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setStoredVote = (choice) => {
  try {
    localStorage.setItem(
      POLL_STORAGE_KEY,
      JSON.stringify({ choice, votedAt: new Date().toISOString() })
    );
  } catch {
    return;
  }
};

const buildFingerprintSource = () =>
  [
    navigator.userAgent || "",
    navigator.language || "",
    navigator.platform || "",
    String(new Date().getTimezoneOffset()),
    String(window.screen?.width || ""),
    String(window.screen?.height || ""),
    String(window.screen?.colorDepth || ""),
  ].join("|");

const hashFingerprint = async (value) => {
  if (!window.crypto?.subtle) return value;
  const buffer = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const buildLinePath = (values, maxValue) => {
  if (!values.length) return "";

  const usableWidth = GRAPH_WIDTH - GRAPH_PADDING * 2;
  const usableHeight = GRAPH_HEIGHT - GRAPH_PADDING * 2;

  return values
    .map((value, index) => {
      const x =
        GRAPH_PADDING +
        (values.length === 1
          ? usableWidth / 2
          : (index / (values.length - 1)) * usableWidth);
      const y =
        GRAPH_HEIGHT -
        GRAPH_PADDING -
        (maxValue === 0 ? 0 : (value / maxValue) * usableHeight);

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const getPollShareUrl = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}/#${POLL_ANCHOR_ID}`;
};

const HomepagePoll = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fingerprintHash, setFingerprintHash] = useState("");
  const [selectedChoice, setSelectedChoice] = useState(
    () => getStoredVote()?.choice || ""
  );
  const [message, setMessage] = useState("");
  const [justVoted, setJustVoted] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    hashFingerprint(buildFingerprintSource())
      .then((fingerprint) => {
        if (mounted) {
          setFingerprintHash(fingerprint);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API_ORIGIN}/api/poll/homepage`);
        if (mounted) {
          setResults(response.data);
        }
      } catch {
        if (mounted) {
          setMessage("Poll results could not be loaded.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchResults();
    const intervalId = window.setInterval(fetchResults, 15000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleVote = async (choice) => {
    if (!fingerprintHash || submitting || selectedChoice) return;

    setSubmitting(true);
    setMessage("");
    setShareMessage("");

    try {
      const response = await axios.post(`${API_ORIGIN}/api/poll/homepage/vote`, {
        choice,
        fingerprintHash,
      });

      setStoredVote(choice);
      setSelectedChoice(choice);
      setResults(response.data);
      setJustVoted(true);
      setMessage("Your vote has been counted!");
    } catch (error) {
      const existingChoice = error.response?.data?.existingChoice;
      if (existingChoice) {
        setStoredVote(existingChoice);
        setSelectedChoice(existingChoice);
      }

      if (error.response?.data?.counts) {
        setResults(error.response.data);
      }

      setMessage(error.response?.data?.error || "We could not record your vote.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = getPollShareUrl();
    if (!shareUrl) return;

    setMessage("");

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Poll link copied.");
    } catch {
      setShareMessage("Copy failed.");
    }
  };

  const handleShare = async () => {
    const shareUrl = getPollShareUrl();
    if (!shareUrl) return;

    setMessage("");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "West Bengal Poll",
          text: "Vote in this West Bengal poll.",
          url: shareUrl,
        });
        setShareMessage("Poll link shared.");
        return;
      } catch {
        return;
      }
    }

    await handleCopyLink();
  };

  const totalVotes = results?.totalVotes || 0;
  const trend = results?.trend || [];
  const trendMax = Math.max(
    1,
    ...trend.flatMap((point) =>
      POLL_OPTIONS.map((option) => point.counts?.[option.label] || 0)
    )
  );
  const hasVoted = Boolean(selectedChoice);

  return (
    <section
      id={POLL_ANCHOR_ID}
      className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white"
      style={{
        boxShadow:
          "0 32px 80px -20px rgba(15,23,42,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }}
      />

      <div className="relative z-10 grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300">
              Quick Poll
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              LIVE
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
              >
                Share
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
              >
                Copy link
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              Who gets your vote in{" "}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                West Bengal?
              </span>
            </h2>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              One vote per device. Results update live every 15 seconds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {POLL_OPTIONS.map((option) => {
              const isSelected = selectedChoice === option.label;
              const isDisabled = hasVoted || submitting || !fingerprintHash;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleVote(option.label)}
                  disabled={isDisabled}
                  className={`group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                    isSelected
                      ? `${option.selectedBg} shadow-lg scale-[1.02]`
                      : isDisabled
                      ? "cursor-not-allowed border-white/8 bg-white/4 opacity-60"
                      : `${option.bg} cursor-pointer active:scale-95`
                  }`}
                >
                  <div
                    className={`mb-3 h-1.5 w-full rounded-full bg-gradient-to-r ${option.tone} ${
                      isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                    } transition-opacity`}
                  />

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/90 p-1 shadow-sm">
                        <img
                          src={option.logo}
                          alt={`${option.label} logo`}
                          className="h-full w-full object-contain"
                        />
                      </span>
                      <span className="text-base font-bold text-slate-100">
                        {option.label}
                      </span>
                    </div>
                    {isSelected ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                        ✓
                      </span>
                    ) : (
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                          isDisabled
                            ? "text-slate-600"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      >
                        Vote
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="min-h-[1.5rem]">
            {loading && !results ? (
              <p className="animate-pulse text-sm text-slate-500">Loading poll data...</p>
            ) : shareMessage ? (
              <p className="text-sm text-sky-300">{shareMessage}</p>
            ) : justVoted && message ? (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span>✓</span> {message}
              </p>
            ) : message ? (
              <p className="text-sm text-slate-400">{message}</p>
            ) : null}
          </div>
        </div>

        <div
          className="flex flex-col gap-5 rounded-b-[2rem] px-6 py-7 sm:px-8 sm:py-8 lg:rounded-b-none lg:rounded-r-[2rem] lg:px-8 lg:py-10"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Live Results
              </p>
              <p className="mt-0.5 text-4xl font-extrabold leading-none tabular-nums text-white">
                {loading ? "-" : totalVotes.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-500">total votes cast</p>
            </div>
            {hasVoted && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                Voted ✓
              </div>
            )}
          </div>

          <div className="space-y-3.5">
            {POLL_OPTIONS.map((option) => {
              const count = results?.counts?.[option.label] || 0;
              const percentage =
                totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isWinning =
                totalVotes > 0 &&
                count === Math.max(...POLL_OPTIONS.map((item) => results?.counts?.[item.label] || 0)) &&
                count > 0;

              return (
                <div key={option.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className={`font-semibold ${isWinning ? "text-white" : "text-slate-300"}`}>
                        {option.label}
                      </span>
                      {isWinning && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Leading
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-slate-400">
                      {count.toLocaleString()}
                      <span className="ml-1 text-slate-500">. {percentage}%</span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${option.tone} transition-[width] duration-700 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Vote Trend
            </p>

            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {POLL_OPTIONS.map((option) => (
                <div key={option.label} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: option.stroke }}
                  />
                  <span className="text-[11px] text-slate-400">{option.label}</span>
                </div>
              ))}
            </div>

            {trend.length > 0 ? (
              <div>
                <svg
                  viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
                  className="w-full overflow-visible"
                  role="img"
                  aria-label="Line graph showing vote trends over time"
                >
                  {[0, 1, 2, 3].map((line) => {
                    const y =
                      GRAPH_PADDING +
                      ((GRAPH_HEIGHT - GRAPH_PADDING * 2) / 3) * line;

                    return (
                      <line
                        key={line}
                        x1={GRAPH_PADDING}
                        y1={y}
                        x2={GRAPH_WIDTH - GRAPH_PADDING}
                        y2={y}
                        stroke="rgba(148,163,184,0.12)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {POLL_OPTIONS.map((option) => {
                    const values = trend.map(
                      (point) => point.counts?.[option.label] || 0
                    );
                    const path = buildLinePath(values, trendMax);

                    return (
                      <path
                        key={option.label}
                        d={path}
                        fill="none"
                        stroke={option.stroke}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                    );
                  })}
                </svg>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                  {trend.map((point, index) => (
                    <span key={`${point.label}-${index}`}>{point.label}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-2 text-center text-xs text-slate-600">
                Trend graph appears once votes come in.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepagePoll;
