import { useEffect, useState } from "react";

type UsePoolingParams = {
  startTrigger: boolean;
  stopConditional: Function;
  action: Function;
  callback: Function;
  interval: number;
};

export const usePooling = ({
  startTrigger,
  stopConditional,
  action,
  callback,
  interval,
}: UsePoolingParams) => {
  const [pooling, setPooling] = useState(false);

  let poolingTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (startTrigger) {
      startPooling();
    }
  }, [startTrigger]);

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
