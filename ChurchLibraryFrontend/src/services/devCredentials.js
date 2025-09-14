// Temporary development credentials for simple local login
// NOTE: Replace these values as needed during development. Do not use in production.

const DEV_CREDENTIALS = {
  email: "admin@church.local",
  password: "password123",
};

export const DEV_USER = {
  id: "dev-user-1",
  name: "Dev Admin",
  email: DEV_CREDENTIALS.email,
  role: "admin",
};

export default DEV_CREDENTIALS;
