import React, { useEffect } from 'react';

export const useOutsideClick = (
  ref: React.MutableRefObject<any>,
  setter: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setter(false);
      }
    };
    // bing the event listener
    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    // unbind on clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
