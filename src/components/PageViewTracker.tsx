import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

interface PageViewTrackerProps {
  children: React.ReactNode;
}

const PageViewTracker: React.FC<PageViewTrackerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return <>{children}</>;
};

export default PageViewTracker;
