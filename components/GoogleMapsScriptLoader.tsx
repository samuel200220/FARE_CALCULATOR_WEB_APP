'use client';

import Script from 'next/script';

const GoogleMapsScriptLoader = () => {
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA0FzU66Ipq1sNCsehts5c7lArG5_NZ-O0`}
      strategy="beforeInteractive"
    />
  );
};

export default GoogleMapsScriptLoader;
