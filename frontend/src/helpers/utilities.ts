type locationProps = {
  pathname: string
}

export const getConfig = (token: string, contentType?: string) => {
  const config = {
    headers: {
      "Content-type": contentType || "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};

export const setActiveLink = (location: locationProps, path: string) => {
  return location.pathname === path ? "active" : "";
};