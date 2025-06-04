import { EnvironmentVariables } from "../types/";

export const getEnvironments = (): EnvironmentVariables => {
  import.meta.env;
  /* return {
    ...import.meta.env,
  }; */
  return {
    VITE_BASE_URL: import.meta.env.VITE_BASE_URL as string,
    // Add other environment variables here if needed
  };
};
