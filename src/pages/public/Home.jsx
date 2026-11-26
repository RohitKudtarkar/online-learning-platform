import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  PlayCircle,
  BookOpen,
  FileCheck2,
  Award,
  Star,
  Sparkles,
  Clock,
  Users,
  CheckCircle2,
  Code2,
  Palette,
  Cpu,
  Smartphone,
  Briefcase,
  Layers,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import CourseCard from '../../components/common/CourseCard';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const METRICS = [
  { label: 'Active Learners', value: '4,450+' },
  { label: 'Course Completion Rate', value: '84%' },
  { label: 'Hands-On Lessons & Labs', value: '120+' },
  { label: 'Average Course Rating', value: '4.9 / 5' },
];

const BENEFITS = [
  {
    icon: BookOpen,
    title: 'Structured Hands-On Lessons',
    desc: 'Follow clear, step-by-step video modules paired with concise summaries and downloadable starter files.',
    accent: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: FileCheck2,
    title: 'Notes, Assignments & Quizzes',
    desc: 'Capture personal notes inside every lesson, submit practical projects, and test mastery with interactive quizzes.',
    accent: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Award,
    title: 'Verified Completion Certificates',
    desc: 'Pass your course assessment to unlock a printable, verifiable completion certificate automatically.',
    accent: 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Enroll & Follow Modules',
    desc: 'Pick a track, watch structured lessons at your own pace, and save timestamped notes.',
  },
  {
    step: '02',
    title: 'Build & Submit Projects',
    desc: 'Apply what you learn through real project assignments and check off completed milestones.',
  },
  {
    step: '03',
    title: 'Pass Quiz & Get Certified',
    desc: 'Score 70% or higher on the final assessment to unlock your official certificate.',
  },
];

const CATEGORY_ICONS = {
  'Web Development': Code2,
  'UI/UX Design': Palette,
  'Data & AI': Cpu,
  'Mobile Development': Smartphone,
  'Product & Business': Briefcase,
};

export default function Home() {
  const { courses, categories } = usePlatform();
  const { loginAsDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const featuredCourses = courses.slice(0, 3);
  const topCourse = courses[0];

  const handlePortalJump = (role) => {
    const account = loginAsDemo(role);
    toast.success(
      `Welcome to ${role === 'admin' ? 'Instructor Studio' : 'Student Portal'}, ${account.name}!`
    );
    navigate(role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-6 lg:pt-20 lg:pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[60rem] h-[28rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Practical Skills • Interactive Quizzes • Verified Certificates</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.45rem] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
              Build Job-Ready Skills With{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Hands-On Courses
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Master modern development, UI/UX design systems, and applied workflows at your own pace. Track every lesson, capture personal notes, submit assignments, and earn verified certificates.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link to="/courses">
                <Button variant="primary" size="lg" className="shadow-md shadow-indigo-600/20">
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">
                  <PlayCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  How It Works
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Self-Paced Video Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Real Project Assignments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant Quiz Certificates</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Track Card */}
          {topCourse && (
            <div className="lg:col-span-5">
              <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone="emerald">Featured Track</Badge>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {topCourse.level}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800/70 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {topCourse.rating}
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      ({topCourse.reviewsCount})
                    </span>
                  </span>
                </div>

                <Link
                  to={`/courses/${topCourse.id}`}
                  className="relative block rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video"
                >
                  <img
                    src={topCourse.thumbnail}
                    alt={topCourse.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold tracking-wide">
                    {topCourse.category}
                  </span>
                </Link>

                <div className="space-y-1.5">
                  <Link to={`/courses/${topCourse.id}`}>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {topCourse.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {topCourse.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    {topCourse.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {(
                      typeof topCourse?.studentsCount === 'number'
                        ? topCourse.studentsCount
                        : typeof topCourse?.students === 'number'
                          ? topCourse.students
                          : 0
                    ).toLocaleString()}{' '}
                    learners
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    By {topCourse.instructor.name}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ${topCourse.price}
                    </span>
                    {topCourse.originalPrice > topCourse.price && (
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 line-through">
                        ${topCourse.originalPrice}
                      </span>
                    )}
                  </div>
                  <Link to={`/courses/${topCourse.id}`}>
                    <Button variant="primary" size="md">
                      View Course
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. SOCIAL PROOF METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {METRICS.map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 space-y-1 cursor-default"
            >
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-emerald-600 dark:from-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge tone="indigo" className="mb-2">Learning Tracks</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Explore Courses by Category
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View full catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Layers;
            const count = courses.filter((c) => c.category === cat).length;
            return (
              <Link
                key={cat}
                to="/courses"
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {count} {count === 1 ? 'Course' : 'Courses'} available
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. POPULAR COURSES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge tone="emerald" className="mb-2">Top Rated</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Popular Courses
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Start learning with structured lessons, personal notes, and quizzes.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Browse all courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 5. PLATFORM BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge tone="indigo">Unified Workspace</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Everything You Need to Learn & Build
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Designed to turn passive video watching into measurable skills and verified outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-3.5"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. HOW IT WORKS SNAPSHOT (SIMPLE WORKFLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge tone="indigo" className="mb-2">Simple Workflow</Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                From First Lesson to Certificate in 3 Steps
              </h2>
            </div>
            <Link to="/how-it-works">
              <Button variant="outline" size="sm">
                Full Guide
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 space-y-2.5 cursor-default"
              >
                <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-extrabold shadow-xs">
                  Step {item.step}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DUAL PORTAL CALL-TO-ACTION BANNER (READY TO START?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 p-8 sm:p-12 text-white shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-200">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
                Ready to Start?
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Experience Both the Student Portal & Instructor Studio
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
                Jump directly into the interactive Student Workspace to watch lessons and earn certificates, or open the Instructor Studio to create and manage courses.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 shrink-0">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handlePortalJump('student')}
                className="bg-white text-indigo-700 border-white hover:bg-indigo-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                Open Student Portal
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handlePortalJump('admin')}
                className="bg-slate-950/35 hover:bg-slate-950/50 text-white border border-white/25"
              >
                <ShieldCheck className="w-4 h-4" />
                Open Instructor Studio
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}