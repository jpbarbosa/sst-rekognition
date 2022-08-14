import { useState } from "react";

type UsePoolingParams = {
  stopConditional: Function;
  action: Function;
  callback: Function;
  interval: number;
};

export const usePooling = ({
  stopConditional,
  action,
  callback,
  interval,
}: UsePoolingParams) => {
  const [pooling, setPooling] = useState(false);

  let poolingTimeout: NodeJS.Timeout;

  const startPooling = async () => {
    if (stopConditional()) {
      setPooling(false);
      callback();
      clearTimeout(poolingTimeout);
      return;
    }

    setPooling(true);
    await action();
    poolingTimeout = setTimeout(() => {
      startPooling();
    }, interval);
  };

  return {
    startPooling,
    pooling,
  };
};
