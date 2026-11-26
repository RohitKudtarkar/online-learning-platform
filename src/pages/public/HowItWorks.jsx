import { Link, useNavigate } from 'react-router-dom';
import {
  SearchCheck,
  PlayCircle,
  FileCheck2,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  StickyNote,
  HelpCircle,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const STEPS = [
  {
    number: '01',
    icon: SearchCheck,
    title: 'Discover & Enroll in a Track',
    desc: 'Filter courses by topic, category, or skill level, preview the full curriculum, and enroll with a single click.',
    points: ['Filter by skill level & category', 'Transparent curriculum & outcomes', 'Instant access to course workspace'],
    accent: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400',
    pill: 'bg-indigo-600',
  },
  {
    number: '02',
    icon: PlayCircle,
    title: 'Watch Lessons & Save Personal Notes',
    desc: 'Learn through structured video lessons, mark modules completed as you progress, and keep private notes per lesson.',
    points: ['Real-time progress percentage bar', 'Per-lesson notes saved automatically', 'Downloadable lesson resources'],
    accent: 'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400',
    pill: 'bg-violet-600',
  },
  {
    number: '03',
    icon: FileCheck2,
    title: 'Submit Hands-On Assignments',
    desc: 'Put concepts into practice by submitting project repository links, live demos, or structured solution notes.',
    points: ['Practical project briefs & due dates', 'Submit links or detailed write-ups', 'Resubmit updates anytime'],
    accent: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
    pill: 'bg-emerald-600',
  },
  {
    number: '04',
    icon: Award,
    title: 'Pass the Quiz & Unlock Certificates',
    desc: 'Complete the course quiz with 70% or higher to automatically generate a verified, printable certificate.',
    points: ['Instant score breakdown & retakes', '70% passing threshold for certification', 'Preview & print/save certificate PDF'],
    accent: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400',
    pill: 'bg-amber-600',
  },
];

const WORKSPACE_FEATURES = [
  {
    icon: StickyNote,
    title: 'Lesson-Linked Notes',
    desc: 'Jot down key takeaways right below the video player without losing your place.',
  },
  {
    icon: HelpCircle,
    title: 'Interactive Assessments',
    desc: 'Validate what you learned immediately and retry until you hit your target score.',
  },
  {
    icon: ShieldCheck,
    title: 'Instructor Studio Sync',
    desc: 'Instructors can publish courses, edit modules, and track learner progress seamlessly.',
  },
];

export default function HowItWorks() {
  const { loginAsDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleDemoPortal = (role) => {
    const account = loginAsDemo(role);
    toast.success(
      `Entered ${role === 'admin' ? 'Instructor Studio' : 'Student Portal'} as ${account.name}`
    );
    navigate(role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[58rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Step-by-Step Learning Workflow</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            How{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Online Learning Platform
            </span>{' '}
            Works
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Every course combines guided video modules, personal notes, hands-on assignments, and quizzes inside one connected learning experience.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-5"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black text-white shadow-sm ${item.pill}`}
                    >
                      STEP {item.number}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.accent} group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2.5 hover:translate-x-1 transition-transform duration-150"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Built-In Workspace Highlights (Complete Lift, Shadow & Hover Polish) */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-6">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
          />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Badge tone="indigo" className="mb-2 text-xs sm:text-sm px-4 py-1.5">
                Built-In Tools
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Designed to Keep Momentum High
              </h2>
            </div>
            <Link to="/courses">
              <Button variant="primary" size="md">
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WORKSPACE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group/feat p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:-translate-y-1.5 hover:shadow-xl hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 space-y-3.5 cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/feat:bg-indigo-600 group-hover/feat:text-white group-hover/feat:scale-105 transition-all duration-200 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover/feat:text-indigo-600 dark:group-hover/feat:text-indigo-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Try Both Portals CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 p-8 sm:p-12 text-white shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-2.5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
                Interactive Demo
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                See the Workflow in Action
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
                Launch the Student Portal to test lessons, notes, assignments, and quizzes, or open the Instructor Studio to manage courses.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 shrink-0">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDemoPortal('student')}
                className="bg-white text-indigo-700 border-white hover:bg-indigo-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                Try Student Portal
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleDemoPortal('admin')}
                className="bg-slate-950/35 hover:bg-slate-950/50 text-white border border-white/25"
              >
                <ShieldCheck className="w-4 h-4" />
                Try Instructor Studio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}