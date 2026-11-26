import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Printer,
  X,
  BookOpen,
  PlayCircle,
  ArrowRight,
  Calendar,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

function CertificatePreviewModal({ certificate, fallbackStudentName, onClose }) {
  useEffect(() => {
    if (!certificate) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [certificate, onClose]);

  if (!certificate) return null;

  const displayStudentName =
    certificate.studentName || fallbackStudentName || 'Verified Learner';

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 12mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-certificate-wrapper,
          #printable-certificate-wrapper * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          #printable-certificate-wrapper {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 99999 !important;
          }
          #printable-certificate-sheet {
            width: 100% !important;
            max-width: 680px !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
      >
        <div
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 print:hidden"
          />

          {/* Modal Top Bar (Hidden when printing) */}
          <div className="flex items-center justify-between gap-3 print:hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/70 dark:border-indigo-800/70 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Credential Preview · {certificate.id}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate preview"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Printable Certificate Wrapper */}
          <div id="printable-certificate-wrapper">
            <div
              id="printable-certificate-sheet"
              className="relative overflow-hidden rounded-3xl border-2 border-indigo-200/90 dark:border-indigo-800/70 bg-gradient-to-b from-indigo-50/70 via-white to-violet-50/50 dark:from-slate-800/70 dark:via-slate-900 dark:to-indigo-950/30 p-6 sm:p-9 text-center shadow-inner space-y-5 print:bg-white print:border-indigo-300"
            >
              {/* Subtle Radial Center Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-44 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 blur-2xl"
              />

              {/* Corner Frame Accents */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-indigo-400/70 dark:border-indigo-500/50 rounded-tl-md"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-indigo-400/70 dark:border-indigo-500/50 rounded-tr-md"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 border-violet-400/70 dark:border-violet-500/50 rounded-bl-md"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 border-violet-400/70 dark:border-violet-500/50 rounded-br-md"
              />

              {/* Seal Badge */}
              <div className="relative w-16 h-16 rounded-2xl bg-indigo-600 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-white" strokeWidth={2.2} />
              </div>

              <div className="relative space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400">
                  Certificate of Completion
                </p>
                <h2
                  id="certificate-modal-title"
                  className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 print:text-slate-800"
                >
                  This certifies that
                </h2>
              </div>

              <div className="relative py-1">
                <p className="text-2xl sm:text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 print:text-indigo-600 break-words">
                  {displayStudentName}
                </p>
                <div
                  aria-hidden="true"
                  className="w-28 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent mx-auto mt-3"
                />
              </div>

              <p className="relative text-xs sm:text-sm text-slate-600 dark:text-slate-300 print:text-slate-600 max-w-md mx-auto leading-relaxed">
                has successfully completed the course requirements and passed the final assessment for
              </p>

              <div className="relative px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/70 print:bg-white border border-indigo-200/80 dark:border-indigo-800/60 max-w-lg mx-auto">
                <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white print:text-slate-900 break-words">
                  {certificate.courseTitle}
                </h3>
              </div>

              {typeof certificate.score === 'number' && (
                <div className="relative inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-100/90 dark:bg-indigo-950/80 print:bg-indigo-50 border border-indigo-200/80 dark:border-indigo-800/70 text-indigo-700 dark:text-indigo-300 print:text-indigo-700 text-xs font-extrabold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Assessment Score: {certificate.score}%</span>
                </div>
              )}

              {/* Credential Metadata Footer */}
              <div className="relative pt-5 border-t border-slate-200/90 dark:border-slate-700/80 grid grid-cols-3 gap-4 text-center text-xs">
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 print:text-slate-500 font-bold">
                    Instructor
                  </p>
                  <p className="font-extrabold text-slate-800 dark:text-slate-100 print:text-slate-900 break-words">
                    {certificate.instructorName || 'Course Instructor'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 print:text-slate-500 font-bold">
                    Issued Date
                  </p>
                  <p className="font-extrabold text-slate-800 dark:text-slate-100 print:text-slate-900">
                    {certificate.issuedDate || 'Recently Issued'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 print:text-slate-500 font-bold">
                    Credential ID
                  </p>
                  <p className="font-extrabold text-indigo-700 dark:text-indigo-300 print:text-indigo-700 tracking-wide">
                    {certificate.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions (Hidden when printing) */}
          <div className="flex flex-wrap items-center justify-end gap-3 print:hidden">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => window.print()}
              className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Certificates() {
  const { user } = useAuth();
  const {
    courses = [],
    enrolledIds = [],
    certificates = [],
    quizResults = {},
    getCourseProgress,
  } = usePlatform();

  const [selectedCert, setSelectedCert] = useState(null);

  const lockedEnrolledCourses = useMemo(() => {
    const earnedCourseIds = new Set(certificates.map((c) => c.courseId));
    return courses
      .filter(
        (course) =>
          enrolledIds.includes(course.id) && !earnedCourseIds.has(course.id)
      )
      .map((course) => ({
        course,
        progress: getCourseProgress ? getCourseProgress(course.id) : 0,
        quizInfo: quizResults[course.id] || null,
      }));
  }, [courses, enrolledIds, certificates, quizResults, getCourseProgress]);

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <CertificatePreviewModal
        certificate={selectedCert}
        fallbackStudentName={user?.name}
        onClose={() => setSelectedCert(null)}
      />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Header Card */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Verified Course Credentials</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Your Earned{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Certificates
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Preview, print, or save certificates unlocked after completing course modules and passing quizzes in your personal account.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="inline-flex items-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-2xs whitespace-nowrap">
                {certificates.length} Earned · {lockedEnrolledCourses.length} In Progress
              </div>

              <Link to="/student/my-learning">
                <Button
                  variant="primary"
                  size="lg"
                  className="shadow-md shadow-indigo-600/20 hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  My Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Earned Certificates Section */}
        <div className="space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Unlocked Credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Certificates earned by passing course assessments under {user?.name || 'your account'}
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
              />
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 group-hover/empty:bg-amber-500 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  No Certificates Earned Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Complete your course lessons and pass the course quiz to automatically unlock your completion certificate here.
                </p>
              </div>
              <div className="pt-1">
                <Link to="/student/my-learning" className="inline-block">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="group/golearn bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <PlayCircle className="w-4 h-4 shrink-0" />
                    <span>Go to My Learning</span>
                    <ArrowRight className="w-4 h-4 group-hover/golearn:translate-x-0.5 transition-transform duration-200 shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group/cert relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                  />

                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="indigo">Verified Certificate</Badge>
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        {cert.id}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/cert:text-indigo-600 dark:group-hover/cert:text-indigo-400 transition-colors">
                      {cert.courseTitle}
                    </h3>

                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-2.5">
                        <UserCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>
                          Awarded to{' '}
                          <strong className="font-bold text-slate-900 dark:text-white">
                            {cert.studentName || user?.name || 'Learner'}
                          </strong>
                        </span>
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>Issued on {cert.issuedDate || 'Recently'}</span>
                      </p>
                      {typeof cert.score === 'number' && (
                        <p className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                          <span>Quiz Score: {cert.score}%</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {cert.instructorName || 'Instructor'}
                    </span>

                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => setSelectedCert(cert)}
                      className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Printer className="w-4 h-4" />
                      <span>View & Print</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Courses In Progress (Certificate Pending) */}
        {lockedEnrolledCourses.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                In-Progress Courses
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Finish lessons and pass the course quiz to unlock these certificates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {lockedEnrolledCourses.map(({ course, progress, quizInfo }) => (
                <div
                  key={course.id}
                  className="group/locked relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex items-center justify-between gap-4"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-70"
                  />

                  <div className="min-w-0 space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {progress}% completed
                        {quizInfo ? ` · Last quiz: ${quizInfo.score}%` : ''}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                      {course.title}
                    </h3>
                  </div>

                  <Link to={`/student/player/${course.id}`} className="shrink-0">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      className="group/cont bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <PlayCircle className="w-4 h-4 shrink-0" />
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 group-hover/cont:translate-x-0.5 transition-transform duration-200 shrink-0" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}