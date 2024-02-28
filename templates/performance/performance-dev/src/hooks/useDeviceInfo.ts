import { startTransition, useEffect, useMemo, useState } from 'react';

function useDeviceInfo() {
  const [mw, setMw] = useState(window.innerWidth);
  const [orientation, setOrientation] = useState(0);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    if (typeof window.screen.orientation !== 'undefined') {
      window.screen.orientation.onchange = function () {
        startTransition(() => {
          setOrientation((orientation) => orientation + 1);
        });
      };
    }

    return () => window.removeEventListener('resize', onResize);

    function onResize() {
      setMw(window.innerWidth);
    }
  }, []);

  const isMobile = useMemo(() => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    )
      return true;

    return false;
  }, []);

  return { isMobile, mw, orientation };
}

export default useDeviceInfo;
