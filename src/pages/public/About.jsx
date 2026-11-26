import { Link, useNavigate } from 'react-router-dom';
import {
  Target,
  Layers,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  TrendingUp,
  Star,
  LayoutDashboard,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const STATS = [
  {
    label: 'Active Learners',
    value: '4,450+',
    icon: Users,
    accent:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
  },
  {
    label: 'Completion Rate',
    value: '84%',
    icon: TrendingUp,
    accent:
      'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
  },
  {
    label: 'Hands-On Courses',
    value: '35+',
    icon: BookOpen,
    accent:
      'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white',
  },
  {
    label: 'Average Rating',
    value: '4.9 / 5',
    icon: Star,
    accent:
      'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
  },
];

const VALUES = [
  {
    icon: Target,
    title: 'Project-First Learning',
    desc: 'Every course pairs structured video lessons with real-world assignments and practical deliverables you can showcase.',
    tag: 'Applied Practice',
    accent:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
  },
  {
    icon: Layers,
    title: 'Unified Learning Workspace',
    desc: 'Watch lessons, capture private lesson-linked notes, complete interactive quizzes, and track progress in one place.',
    tag: 'All-In-One Flow',
    accent:
      'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white',
  },
  {
    icon: Award,
    title: 'Verified Completion Credentials',
    desc: 'Pass your course assessment with 70% or higher to automatically generate a printable, verifiable certificate.',
    tag: 'Instant Proof',
    accent:
      'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
  },
];

const PORTALS = [
  {
    role: 'student',
    badge: 'For Learners',
    badgeTone: 'indigo',
    icon: LayoutDashboard,
    title: 'Student Learning Portal',
    desc: 'A distraction-free workspace built to help learners finish courses, retain concepts, and earn verified credentials.',
    features: [
      'Interactive video player with real-time lesson completion tracking',
      'Private notes saved automatically per lesson alongside downloadable files',
      'Project assignment submissions, graded quizzes, and instant certificates',
    ],
    cta: 'Launch Student Portal',
    iconStyle:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/portal:bg-indigo-600 group-hover/portal:text-white',
  },
  {
    role: 'admin',
    badge: 'For Educators',
    badgeTone: 'emerald',
    icon: ShieldCheck,
    title: 'Instructor & Admin Studio',
    desc: 'Complete course authoring and learner analytics tools designed to publish structured programs in minutes.',
    features: [
      'Create and edit courses with custom modules, lessons, and assignments',
      'Manage course categories and toggle draft or published visibility',
      'Monitor enrollment growth, completion rates, and student quiz results',
    ],
    cta: 'Launch Instructor Studio',
    iconStyle:
      'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/portal:bg-emerald-600 group-hover/portal:text-white',
  },
];

export default function About() {
  const { loginAsDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handlePortalJump = (role) => {
    const account = loginAsDemo(role);
    toast.success(
      `Welcome to ${role === 'admin' ? 'Instructor Studio' : 'Student Portal'}, ${account.name}!`
    );
    navigate(role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[60rem] h-[26rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Our Mission & Learning Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Bridging the Gap Between{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Passive Watching & Real Building
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Online Learning Platform was built around a clear belief: learners retain far more when structured lessons, personal notes, practical assignments, and assessments live together in one unified workspace.
          </p>
        </div>

        {/* 2. METRICS BAND (COMPLETE LIFT, SHADOW & SOLID ICON FILL ON HOVER) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:-translate-y-1.5 hover:shadow-xl hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 text-center space-y-2.5 cursor-default"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${stat.accent} flex items-center justify-center mx-auto transition-all duration-200 group-hover:scale-110 shadow-2xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-emerald-600 dark:from-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3. CORE PILLARS (COMPLETE LIFT & SHADOW) */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge tone="indigo" className="text-xs sm:text-sm px-4 py-1.5">
              Core Pillars
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How We Design Every Learning Experience
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Focused on clarity, active recall, and measurable progress from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-4 cursor-default"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${item.accent}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. TWO DEDICATED PORTALS SHOWCASE (COMPLETE LIFT & SHADOW) */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge tone="emerald" className="text-xs sm:text-sm px-4 py-1.5">
              Platform Architecture
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Two Dedicated Portals, One Seamless Ecosystem
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Built for both self-paced learners and hands-on instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.role}
                  className="group/portal relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between space-y-6"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover/portal:scale-105 ${portal.iconStyle}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge tone={portal.badgeTone}>{portal.badge}</Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover/portal:text-indigo-600 dark:group-hover/portal:text-indigo-400 transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {portal.desc}
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                      {portal.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 hover:translate-x-1 transition-transform duration-150"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant={portal.role === 'admin' ? 'secondary' : 'primary'}
                      size="md"
                      onClick={() => handlePortalJump(portal.role)}
                    >
                      {portal.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. BOTTOM CALL TO ACTION BANNER (COMPLETE LIFT & SHADOW) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 p-8 sm:p-12 text-white shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                Start Learning Today
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Ready to Build Your Next Skill Track?
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
                Explore our structured course catalog or walk through our 4-step workflow to see how lessons, quizzes, and certificates fit together.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 shrink-0">
              <Link to="/courses">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-indigo-700 border-white hover:bg-indigo-50"
                >
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-slate-950/35 hover:bg-slate-950/50 text-white border border-white/25"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}