import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: 'IoT Dashboard',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'General',
    icon: 'layout-outline',
    children: [
      {
        title: 'Calendar',
        link: '/pages/general/calendar',
      },
    ],
  },
  {
    title: 'Pricing',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'sub menu',
        link: '/pages/dashboard',
      }
    ],
  },
  {
    title: 'Product',
    icon: 'keypad-outline',
    link: '/pages/ui-features',
    children: [
      {
        title: 'Sub menu',
        link: '/pages/dashboard',
      }
    ],
  },
  {
    title: 'Reports',
    icon: 'browser-outline',
    children: [
      {
        title: 'Sub menu',
        link: '/pages/dashboard',
      },
    ],
  },
  {
    title: 'Pricing Admin',
    icon: 'message-circle-outline',
    children: [
      {
        title: 'Sub menu',
        link: '/pages/dashboard',
      }
    ],
  },

];
