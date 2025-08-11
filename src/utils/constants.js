export const ROUTES = {
  Splash: "Splash",
  Auth: "Auth",
  Main: "Main",
  Home: "Home",
  Library: "Library",
  Bible: "Bible",
  Profile: "Profile",
};

export const VALIDATION = {
  emailRegex:
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/,
  passwordMinLength: 6,
  nameMinLength: 2,
};

export const TIMEOUTS = {
  splashMs: 3000,
  short: 300,
  default: 800,
  networkMs: 10000,
};
