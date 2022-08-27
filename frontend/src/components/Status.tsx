import React from "react";

type StatusItem = {
  condition: boolean;
  message: string;
};

type StatusProps = {
  status: StatusItem[];
};

export const Status: React.FC<StatusProps> = ({ status }) => {
  const renderStatus = () => {
    for (const item of status) {
      if (item.condition) {
        return (
          <div className="status">
            <div className="message">{item.message}</div>
          </div>
        );
      }
    }
  };

  return <>{renderStatus()}</>;
};
