import React from "react";
import Card from "../common/Card";

const RecentActivity = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      action: "Book borrowed",
      user: "John Doe",
      book: "The Bible",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Book returned",
      user: "Jane Smith",
      book: "Daily Devotions",
      time: "4 hours ago",
    },
    {
      id: 3,
      action: "New book added",
      user: "Admin",
      book: "Christian Living",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "User registered",
      user: "Mike Johnson",
      time: "2 days ago",
    },
  ];

  const displayActivities =
    activities.length > 0 ? activities : defaultActivities;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {displayActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.action}</span>
                {activity.book && (
                  <span className="text-gray-600"> - {activity.book}</span>
                )}
                {activity.user && (
                  <span className="text-gray-600"> by {activity.user}</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
