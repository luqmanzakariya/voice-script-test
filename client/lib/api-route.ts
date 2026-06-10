export const API_ROUTE = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  JOBS: "/jobs",
  USERS: "/users",
  USERS_REPORTERS: "/users/by-role?role=REPORTER",
  USERS_EDITORS: "/users/by-role?role=EDITOR",
  JOBS_ASSIGN: "/jobs/assign",
  JOBS_UPDATE: "/jobs/update",
  PAYMENT: "/payments",
  PAYMENT_BY_USER: "/payments/user",
};

export default API_ROUTE;
