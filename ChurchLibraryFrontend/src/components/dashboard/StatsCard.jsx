import React from "react";
import { clsx } from "clsx";
import Card from "../common/Card";

const StatsCard = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  className = "",
}) => {
  const changeColor =
    changeType === "positive" ? "text-green-600" : "text-red-600";
  const changeIcon = changeType === "positive" ? "↗" : "↘";

  return (
    <Card
      className={clsx(
        "hover:shadow-lg transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              <span className={clsx("text-sm font-medium", changeColor)}>
                {changeIcon} {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-100 rounded-full">
            <span className="text-2xl text-blue-600">{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
