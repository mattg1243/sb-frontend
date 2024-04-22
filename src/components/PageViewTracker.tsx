import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

interface PageViewTrackerProps {
  children: React.ReactNode;
}

const PageViewTracker: React.FC<PageViewTrackerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // ReactGA.event({ category: 'page_view', action: 'page_view', label: location.pathname });
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return <>{children}</>;
};

export default PageViewTracker;
