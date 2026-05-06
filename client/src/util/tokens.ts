import Cookies from "universal-cookie";

const cookies = new Cookies();

const COOKIE_OPTIONS = {
  path: "/",
  secure: window.location.protocol === "https:",
  sameSite: "lax" as const,
};

export const saveAccessToken = (token: string) => {
  cookies.set("accessToken", token, COOKIE_OPTIONS);
};

export const getAccessToken = (): string | undefined => {
  return cookies.get("accessToken");
};

export const saveRefreshToken = (token: string) => {
  // Refresh tokens often have a longer expiry.
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  cookies.set("refreshToken", token, {
    ...COOKIE_OPTIONS,
    expires,
  });
};

export const getRefreshToken = (): string | undefined => {
  return cookies.get("refreshToken");
};

export const clearTokens = () => {
  cookies.remove("accessToken", { path: "/" });
  cookies.remove("refreshToken", { path: "/" });
};
