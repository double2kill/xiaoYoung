import { useState } from 'react';

export const useAdminMode = (initialMode: boolean = false) => {
  const [isAdminMode, setIsAdminMode] = useState(initialMode);

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  return {
    isAdminMode,
    setIsAdminMode,
    toggleMode,
  };
};
