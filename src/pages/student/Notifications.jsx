import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Sparkles,
  Search,
  LayoutDashboard,
  Clock,
  Inbox,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { usePlatform } from '../../context/PlatformContext';

const FILTER_TABS = [
  { id: 'all', label: 'All Updates' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
];

export default function Notifications() {
  const { notifications = [], markAllNotificationsRead } = usePlatform();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localReadIds, setLocalReadIds] = useState([]);

  const normalizedNotifications = useMemo(() => {
    return notifications.map((item) => ({
      ...item,
      read: Boolean(item.read) || localReadIds.includes(item.id),
    }));
  }, [notifications, localReadIds]);

  const unreadCount = normalizedNotifications.filter((n) => !n.read).length;
  const readCount = normalizedNotifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return normalizedNotifications.filter((item) => {
      if (activeTab === 'unread' && item.read) return false;
      if (activeTab === 'read' && !item.read) return false;
      if (!q) return true;
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const messageMatch = (item.message || '').toLowerCase().includes(q);
      return titleMatch || messageMatch;
    });
  }, [normalizedNotifications, activeTab, searchQuery]);

  const handleMarkSingleRead = (id) => {
    setLocalReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleMarkAll = () => {
    if (typeof markAllNotificationsRead === 'function') {
      markAllNotificationsRead();
    }
    setLocalReadIds(normalizedNotifications.map((n) => n.id));
  };

  const KPI_CARDS = [
    {
      label: 'Total Notifications',
      value: normalizedNotifications.length,
      sub: 'In your personal activity feed',
      icon: Bell,
      accent:
        'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/kpi:bg-indigo-600 group-hover/kpi:text-white',
    },
    {
      label: 'Unread Updates',
      value: unreadCount,
      sub:
        unreadCount > 0
          ? 'New activity in your account'
          : 'All new updates reviewed',
      icon: Sparkles,
      accent:
        'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/kpi:bg-violet-600 group-hover/kpi:text-white',
    },
    {
      label: 'Read Activity',
      value: readCount,
      sub: 'Previously checked updates',
      icon: CheckCircle2,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
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
                <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Personal Activity & Alerts</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Your{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Notifications
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Stay up to date with your course enrollments, assignment submissions, quiz milestones, and unlocked certificates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {unreadCount > 0 && (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleMarkAll}
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </Button>
              )}
              <Link to="/student">
                <Button variant="outline" size="lg">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="group/kpi relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-default"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {card.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover/kpi:scale-105 ${card.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  {card.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs & Search Box */}
        {normalizedNotifications.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 self-start">
              {FILTER_TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                const count =
                  tab.id === 'all'
                    ? normalizedNotifications.length
                    : tab.id === 'unread'
                    ? unreadCount
                    : readCount;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[11px] ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="group/search relative w-full sm:w-72 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl transition-all duration-200">
              <Search className="w-4 h-4 text-slate-400 group-hover/search:text-indigo-600 dark:group-hover/search:text-indigo-400 group-focus-within/search:text-indigo-600 dark:group-focus-within/search:text-indigo-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Notifications List or Empty States */}
        {normalizedNotifications.length === 0 ? (
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/empty:bg-indigo-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                No Notifications Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                As you enroll in courses, submit assignments, pass quizzes, and unlock certificates, personal updates will appear here.
              </p>
            </div>
            <div className="pt-1">
              <Link to="/courses">
                <Button variant="primary" size="md">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-3 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              No Matching Notifications
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try switching filter tabs or clearing your search text.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`group/notif relative overflow-hidden rounded-3xl border p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 ${
                  item.read
                    ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
                    : 'bg-indigo-50/40 dark:bg-indigo-950/25 border-indigo-200/90 dark:border-indigo-800/80'
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        item.read
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover/notif:text-indigo-600 dark:group-hover/notif:text-indigo-400 transition-colors">
                          {item.title || 'Activity Update'}
                        </h2>
                        <Badge tone={item.read ? 'slate' : 'indigo'}>
                          {item.read ? 'Read' : 'Unread'}
                        </Badge>
                        {item.time && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.time}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {!item.read && (
                    <div className="shrink-0 self-start sm:self-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => handleMarkSingleRead(item.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Mark Read
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}