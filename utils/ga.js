
///utils/ga.js//

import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-Q2HSWGJTDD");
};

export const logPageView = (url) => {
  ReactGA.send({ hitType: "pageview", page: url });
};
