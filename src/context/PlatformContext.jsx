import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COURSES, INITIAL_CATEGORIES } from '../data/seedData';
import { useAuth } from './AuthContext';
import {
  DEFAULT_USER_ACTIVITY,
  loadUserActivity,
  saveUserActivity,
} from '../utils/userStorage';

const PlatformContext = createContext(null);
const CATALOG_STORAGE_KEY = 'olp_catalog_v1';

function loadCatalogState() {
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) {
      return { courses: INITIAL_COURSES, categories: INITIAL_CATEGORIES };
    }
    const parsed = JSON.parse(raw);
    return {
      courses:
        Array.isArray(parsed.courses) && parsed.courses.length > 0
          ? parsed.courses
          : INITIAL_COURSES,
      categories:
        Array.isArray(parsed.categories) && parsed.categories.length > 0
          ? parsed.categories
          : INITIAL_CATEGORIES,
    };
  } catch {
    return { courses: INITIAL_COURSES, categories: INITIAL_CATEGORIES };
  }
}

export function PlatformProvider({ children }) {
  const { user } = useAuth();
  const activeUserId = user?.id || null;

  const [catalog, setCatalog] = useState(loadCatalogState);
  const [activity, setActivity] = useState(() =>
    loadUserActivity(activeUserId)
  );

  // Whenever the logged-in user changes, load strictly that user's activities
  useEffect(() => {
    setActivity(loadUserActivity(activeUserId));
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog));
  }, [catalog]);

  // Persist changes strictly under the active user's unique key: olp_activity_<userId>
  useEffect(() => {
    if (!activeUserId) return;
    saveUserActivity(activeUserId, activity);
  }, [activeUserId, activity]);

  const addNotification = (title, message) => {
    if (!activeUserId) return;
    setActivity((prev) => ({
      ...prev,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title,
          message,
          time: 'Just now',
          read: false,
        },
        ...(prev.notifications || []),
      ],
    }));
  };

  const enrollCourse = (courseId) => {
    if (!activeUserId) return;
    const course = catalog.courses.find((c) => c.id === courseId);
    if (!course || activity.enrolledIds.includes(courseId)) return;

    setActivity((prev) => ({
      ...prev,
      enrolledIds: [...prev.enrolledIds, courseId],
      wishlistIds: prev.wishlistIds.filter((id) => id !== courseId),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Enrollment Confirmed',
          message: `You are now enrolled in "${course.title}".`,
          time: 'Just now',
          read: false,
        },
        ...(prev.notifications || []),
      ],
    }));

    setCatalog((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? { ...c, studentsCount: (c.studentsCount || 0) + 1 }
          : c
      ),
    }));
  };

  const toggleWishlist = (courseId) => {
    if (!activeUserId) return;
    setActivity((prev) => {
      const exists = prev.wishlistIds.includes(courseId);
      return {
        ...prev,
        wishlistIds: exists
          ? prev.wishlistIds.filter((id) => id !== courseId)
          : [...prev.wishlistIds, courseId],
      };
    });
  };

  const toggleLessonComplete = (courseId, lessonId) => {
    if (!activeUserId) return;
    setActivity((prev) => {
      const current = prev.completedLessons[courseId] || [];
      const updated = current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId];
      return {
        ...prev,
        completedLessons: { ...prev.completedLessons, [courseId]: updated },
      };
    });
  };

  const saveNote = (lessonId, text) => {
    if (!activeUserId) return;
    setActivity((prev) => ({
      ...prev,
      notes: { ...prev.notes, [lessonId]: text },
    }));
  };

  const submitQuiz = (courseId, score, passed, studentName) => {
    if (!activeUserId) return;
    const course = catalog.courses.find((c) => c.id === courseId);
    const learnerName = studentName || user?.name || 'Student';

    setActivity((prev) => {
      const alreadyHasCert = prev.certificates.some(
        (cert) => cert.courseId === courseId
      );
      const newCertificates =
        passed && !alreadyHasCert && course
          ? [
              ...prev.certificates,
              {
                id: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
                courseId,
                courseTitle: course.title,
                studentName: learnerName,
                instructorName: course.instructor?.name || 'Instructor',
                issuedDate: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                score,
              },
            ]
          : prev.certificates;

      const nextNotifications =
        passed && course
          ? [
              {
                id: `notif-${Date.now()}`,
                title: 'Certificate Unlocked!',
                message: `You passed the quiz (${score}%) and earned your certificate for "${course.title}".`,
                time: 'Just now',
                read: false,
              },
              ...(prev.notifications || []),
            ]
          : prev.notifications || [];

      return {
        ...prev,
        quizResults: {
          ...prev.quizResults,
          [courseId]: { score, passed, date: new Date().toISOString() },
        },
        certificates: newCertificates,
        notifications: nextNotifications,
      };
    });
  };

  const submitAssignment = (courseId, linkOrText) => {
    if (!activeUserId) return;
    setActivity((prev) => ({
      ...prev,
      submissions: {
        ...prev.submissions,
        [courseId]: {
          content: linkOrText,
          submittedAt: new Date().toLocaleDateString(),
          status: 'Submitted',
        },
      },
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Assignment Submitted',
          message:
            'Your project submission has been recorded for instructor review.',
          time: 'Just now',
          read: false,
        },
        ...(prev.notifications || []),
      ],
    }));
  };

  const markAllNotificationsRead = () => {
    if (!activeUserId) return;
    setActivity((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) => ({
        ...n,
        read: true,
      })),
    }));
  };

  // Instructor / Admin Catalog Actions
  const saveCourse = (courseData) => {
    setCatalog((prev) => {
      const exists = prev.courses.some((c) => c.id === courseData.id);
      const updatedCourses = exists
        ? prev.courses.map((c) => (c.id === courseData.id ? courseData : c))
        : [courseData, ...prev.courses];
      return { ...prev, courses: updatedCourses };
    });
  };

  const deleteCourse = (courseId) => {
    setCatalog((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== courseId),
    }));
    setActivity((prev) => ({
      ...prev,
      enrolledIds: prev.enrolledIds.filter((id) => id !== courseId),
      wishlistIds: prev.wishlistIds.filter((id) => id !== courseId),
    }));
  };

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed || catalog.categories.includes(trimmed)) return;
    setCatalog((prev) => ({
      ...prev,
      categories: [...prev.categories, trimmed],
    }));
  };

  const getCourseProgress = (courseId) => {
    const course = catalog.courses.find((c) => c.id === courseId);
    if (!course || !Array.isArray(course.sections)) return 0;
    const totalLessons = course.sections.reduce(
      (acc, s) => acc + (s.lessons ? s.lessons.length : 0),
      0
    );
    if (totalLessons === 0) return 0;
    const completed = (activity.completedLessons[courseId] || []).length;
    return Math.round((completed / totalLessons) * 100);
  };

  const currentActivity = activeUserId ? activity : DEFAULT_USER_ACTIVITY;

  return (
    <PlatformContext.Provider
      value={{
        courses: catalog.courses,
        categories: catalog.categories,
        ...currentActivity,
        addNotification,
        enrollCourse,
        toggleWishlist,
        toggleLessonComplete,
        saveNote,
        submitQuiz,
        submitAssignment,
        markAllNotificationsRead,
        saveCourse,
        deleteCourse,
        addCategory,
        getCourseProgress,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export const usePlatform = () => useContext(PlatformContext);