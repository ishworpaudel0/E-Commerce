import Cookies from "universal-cookie";

const cookies = new Cookies();

export function get(key: string) {
  return cookies.get(key);
}

export function set(key: string, value: string | number) {
  cookies.set(key, value, {
    path: "/",
  });
}

export function remove(key: string) {
  cookies.remove(key);
}
