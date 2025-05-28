export const getConfig = (token, contentType) => {
  const config = {
    headers: {
      "Content-type": contentType || "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};

export const setActiveLink = (location, path) => {
  return location.pathname === path ? "active" : "";
};