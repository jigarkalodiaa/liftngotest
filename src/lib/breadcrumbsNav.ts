/** Breadcrumb trail item (path is root-relative, e.g. `/services`). */
export type BreadcrumbNavItem = { name: string; path: string };

export const BREADCRUMB_HOME: BreadcrumbNavItem = { name: 'Home', path: '/' };

export const BREADCRUMB_SERVICES: BreadcrumbNavItem = { name: 'Services', path: '/services' };

export const BREADCRUMB_ABOUT: BreadcrumbNavItem = { name: 'About', path: '/about' };

export const BREADCRUMB_BLOG: BreadcrumbNavItem = { name: 'Blog', path: '/blog' };

export const BREADCRUMB_FIND_RESTAURANT: BreadcrumbNavItem = {
  name: 'Food & restaurants',
  path: '/find-restaurant',
};
