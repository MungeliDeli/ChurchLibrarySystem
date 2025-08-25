import React from "react";
import Button from "../common/Button";
import Card from "../common/Card";

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: "add-book", label: "Add Book", icon: "📚", variant: "primary" },
    { id: "add-user", label: "Add User", icon: "👤", variant: "secondary" },
    { id: "borrow-book", label: "Borrow Book", icon: "📖", variant: "success" },
    { id: "return-book", label: "Return Book", icon: "📗", variant: "outline" },
  ];

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            size="medium"
            onClick={() => handleAction(action.id)}
            className="flex flex-col items-center justify-center h-20"
          >
            <span className="text-2xl mb-1">{action.icon}</span>
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
