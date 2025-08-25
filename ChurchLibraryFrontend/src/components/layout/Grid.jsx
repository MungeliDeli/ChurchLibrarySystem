import React from "react";
import { clsx } from "clsx";

const Grid = ({
  children,
  cols = 1,
  gap = "default",
  className = "",
  responsive = true,
}) => {
  const gapClasses = {
    none: "",
    small: "gap-3",
    default: "gap-6",
    large: "gap-8",
    xl: "gap-10",
  };

  const baseColsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  const responsiveClasses = responsive
    ? {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        12: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
      }
    : baseColsClasses;

  const gridClasses = clsx(
    "grid",
    responsiveClasses[cols] || baseColsClasses[cols],
    gapClasses[gap],
    className
  );

  return <div className={gridClasses}>{children}</div>;
};

export default Grid;
