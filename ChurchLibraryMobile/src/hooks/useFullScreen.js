import { useState, useCallback } from 'react';

const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  return { isFullScreen, toggleFullScreen };
};

export default useFullScreen;
