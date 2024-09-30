export const baseNavItems = {
  home: "/",
  게시판: "/board",
  "관리자 게시판": "/admin",
  pokemon: "/pokemon",
  login: "/login",
};

export type NavItemsType = typeof baseNavItems;

export function getNavItems(isLoggedIn: boolean): NavItemsType {
  if (isLoggedIn) {
    const { login, ...rest } = baseNavItems;
    return {
      ...rest,
      logout: "/api/auth/signout",
    };
  }
  return baseNavItems;
}

export default baseNavItems;
