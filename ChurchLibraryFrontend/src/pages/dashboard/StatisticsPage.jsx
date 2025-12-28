import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { statisticsAPI } from "../../services/api";
import {
  MdBook,
  MdBookmark,
  MdTrendingUp,
  MdCategory,
  MdBarChart,
  MdCalendarToday,
  MdPeople,
  MdLibraryBooks,
} from "react-icons/md";
import { clsx } from "clsx";

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    completedBooks: 0,
    readingFrequency: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      total: 0,
    },
    bookmarkedItems: 0,
    topCategories: [],
    monthlyTrends: [],
    popularBooks: [],
    userEngagement: {
      activeUsers: 0,
      totalUsers: 0,
      newUsers: 0,
    },
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard statistics
      const dashboardResponse = await statisticsAPI.getDashboardStats();
      const dashboardData = dashboardResponse?.data?.data || dashboardResponse?.data || {};

      // Fetch user statistics
      const userStatsResponse = await statisticsAPI.getUserStats();
      const userStatsData = userStatsResponse?.data?.data || userStatsResponse?.data || {};

      // Fetch popular books
      const popularBooksResponse = await statisticsAPI.getPopularBooks();
      const popularBooksData = popularBooksResponse?.data?.data || popularBooksResponse?.data || [];

      // Combine and set statistics
      setStats({
        completedBooks: dashboardData.completedBooks || 0,
        readingFrequency: {
          daily: dashboardData.dailyReading || 0,
          weekly: dashboardData.weeklyReading || 0,
          monthly: dashboardData.monthlyReading || 0,
          total: dashboardData.totalReading || 0,
        },
        bookmarkedItems: dashboardData.bookmarkedItems || 0,
        topCategories: dashboardData.topCategories || [],
        monthlyTrends: dashboardData.monthlyTrends || [],
        popularBooks: Array.isArray(popularBooksData) ? popularBooksData : [],
        userEngagement: {
          activeUsers: userStatsData.activeUsers || 0,
          totalUsers: userStatsData.totalUsers || 0,
          newUsers: userStatsData.newUsers || 0,
        },
      });
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError(err.message || "Failed to load statistics");
      // Set mock data for development/demo purposes
      setStats({
        completedBooks: 45,
        readingFrequency: {
          daily: 12,
          weekly: 78,
          monthly: 320,
          total: 1250,
        },
        bookmarkedItems: 89,
        topCategories: [
          { name: "Theology", count: 156, percentage: 35 },
          { name: "Devotionals", count: 134, percentage: 30 },
          { name: "Biography", count: 89, percentage: 20 },
          { name: "History", count: 67, percentage: 15 },
        ],
        monthlyTrends: [
          { month: "Jan", books: 45 },
          { month: "Feb", books: 52 },
          { month: "Mar", books: 48 },
          { month: "Apr", books: 61 },
          { month: "May", books: 55 },
          { month: "Jun", books: 68 },
        ],
        popularBooks: [
          { id: 1, title: "The Purpose Driven Life", reads: 234 },
          { id: 2, title: "Mere Christianity", reads: 189 },
          { id: 3, title: "The Screwtape Letters", reads: 156 },
          { id: 4, title: "The Great Divorce", reads: 134 },
          { id: 5, title: "The Chronicles of Narnia", reads: 112 },
        ],
        userEngagement: {
          activeUsers: 156,
          totalUsers: 234,
          newUsers: 12,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      teal: "bg-teal-500",
    };

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-secondary-text)] mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-[var(--color-primary-text)] mb-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-[var(--color-secondary-text)]">{subtitle}</p>
            )}
          </div>
          <div
            className={clsx(
              "p-3 rounded-lg",
              colorClasses[color] || colorClasses.blue
            )}
          >
            <Icon className="text-white text-2xl" />
          </div>
        </div>
      </Card>
    );
  };

  const CategoryBar = ({ category, maxCount }) => {
    const percentage = maxCount > 0 ? (category.count / maxCount) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--color-primary-text)]">
            {category.name}
          </span>
          <span className="text-sm text-[var(--color-secondary-text)]">
            {category.count} ({category.percentage}%)
          </span>
        </div>
        <div className="w-full bg-[var(--color-surface)] rounded-full h-3 overflow-hidden">
          <div
            className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const ReadingFrequencyChart = () => {
    const maxValue = Math.max(
      stats.readingFrequency.daily,
      stats.readingFrequency.weekly,
      stats.readingFrequency.monthly
    );

    const bars = [
      { label: "Daily", value: stats.readingFrequency.daily, color: "bg-blue-500" },
      { label: "Weekly", value: stats.readingFrequency.weekly, color: "bg-green-500" },
      { label: "Monthly", value: stats.readingFrequency.monthly, color: "bg-purple-500" },
    ];

    return (
      <div className="space-y-4">
        {bars.map((bar) => {
          const height = maxValue > 0 ? (bar.value / maxValue) * 100 : 0;
          return (
            <div key={bar.label} className="flex items-end gap-4">
              <div className="w-20 text-sm text-[var(--color-secondary-text)]">
                {bar.label}
              </div>
              <div className="flex-1 flex items-end gap-2">
                <div className="flex-1 relative">
                  <div className="w-full bg-[var(--color-surface)] rounded-t h-32 flex items-end">
                    <div
                      className={clsx(
                        "w-full rounded-t transition-all duration-500",
                        bar.color
                      )}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-lg font-semibold text-[var(--color-primary-text)]">
                    {bar.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const MonthlyTrendChart = () => {
    const maxBooks = Math.max(...stats.monthlyTrends.map((t) => t.books), 1);

    return (
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-2 h-48">
          {stats.monthlyTrends.map((trend) => {
            const height = (trend.books / maxBooks) * 100;
            return (
              <div key={trend.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-[var(--color-primary)] rounded-t transition-all duration-500 hover:opacity-80"
                    style={{ height: `${height}%` }}
                    title={`${trend.books} books`}
                  />
                </div>
                <span className="text-xs text-[var(--color-secondary-text)] mt-2">
                  {trend.month}
                </span>
                <span className="text-xs font-semibold text-[var(--color-primary-text)] mt-1">
                  {trend.books}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-[var(--color-secondary-text)]">
              Loading statistics...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              Error: {error}
            </p>
            <button
              onClick={fetchStatistics}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const maxCategoryCount = Math.max(
    ...stats.topCategories.map((c) => c.count),
    1
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary-text)] mb-2">
            Statistics Dashboard
          </h1>
          <p className="text-[var(--color-secondary-text)]">
            View engagement metrics and library analytics
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={MdBook}
            title="Completed Books"
            value={stats.completedBooks}
            subtitle="Total books read"
            color="blue"
          />
          <StatCard
            icon={MdBookmark}
            title="Bookmarked Items"
            value={stats.bookmarkedItems}
            subtitle="Saved for later"
            color="green"
          />
          <StatCard
            icon={MdTrendingUp}
            title="Total Reading"
            value={stats.readingFrequency.total}
            subtitle="All-time reading activity"
            color="purple"
          />
          <StatCard
            icon={MdPeople}
            title="Active Users"
            value={stats.userEngagement.activeUsers}
            subtitle={`of ${stats.userEngagement.totalUsers} total`}
            color="orange"
          />
        </div>

        {/* Reading Frequency Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MdBarChart className="text-[var(--color-primary)] text-xl" />
              <h2 className="text-xl font-semibold text-[var(--color-primary-text)]">
                Reading Frequency
              </h2>
            </div>
            <ReadingFrequencyChart />
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MdCalendarToday className="text-[var(--color-primary)] text-xl" />
              <h2 className="text-xl font-semibold text-[var(--color-primary-text)]">
                Monthly Trends
              </h2>
            </div>
            <MonthlyTrendChart />
          </Card>
        </div>

        {/* Top Categories and Popular Books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MdCategory className="text-[var(--color-primary)] text-xl" />
              <h2 className="text-xl font-semibold text-[var(--color-primary-text)]">
                Top Categories
              </h2>
            </div>
            <div className="space-y-4">
              {stats.topCategories.length > 0 ? (
                stats.topCategories.map((category) => (
                  <CategoryBar
                    key={category.name}
                    category={category}
                    maxCount={maxCategoryCount}
                  />
                ))
              ) : (
                <p className="text-[var(--color-secondary-text)] text-center py-4">
                  No category data available
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MdLibraryBooks className="text-[var(--color-primary)] text-xl" />
              <h2 className="text-xl font-semibold text-[var(--color-primary-text)]">
                Popular Books
              </h2>
            </div>
            <div className="space-y-3">
              {stats.popularBooks.length > 0 ? (
                stats.popularBooks.map((book, index) => (
                  <div
                    key={book.id || index}
                    className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-[var(--color-primary-text)]">
                        {book.title}
                      </p>
                      <p className="text-sm text-[var(--color-secondary-text)]">
                        {book.reads} reads
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[var(--color-secondary-text)] text-center py-4">
                  No popular books data available
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* User Engagement Details */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <MdPeople className="text-[var(--color-primary)] text-xl" />
            <h2 className="text-xl font-semibold text-[var(--color-primary-text)]">
              User Engagement
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
              <p className="text-2xl font-bold text-[var(--color-primary-text)]">
                {stats.userEngagement.activeUsers}
              </p>
              <p className="text-sm text-[var(--color-secondary-text)] mt-1">
                Active Users
              </p>
            </div>
            <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
              <p className="text-2xl font-bold text-[var(--color-primary-text)]">
                {stats.userEngagement.totalUsers}
              </p>
              <p className="text-sm text-[var(--color-secondary-text)] mt-1">
                Total Users
              </p>
            </div>
            <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
              <p className="text-2xl font-bold text-[var(--color-primary-text)]">
                {stats.userEngagement.newUsers}
              </p>
              <p className="text-sm text-[var(--color-secondary-text)] mt-1">
                New This Month
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;
