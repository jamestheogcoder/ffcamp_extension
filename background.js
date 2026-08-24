'use strict';

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error('FFCamp: failed to set panel behavior', err));
