import {createNavigation} from 'next-intl/navigation';

// Minimal routing config as defineRouting might be causing issues in some versions of next-intl
export const routing = {
  locales: ['en', 'pl'],
  defaultLocale: 'en'
} as const;

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
