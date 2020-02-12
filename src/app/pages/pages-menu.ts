import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  //   home: true,
  // },
  {
    title: 'General',
    icon: 'grid-outline',
    children: [
      {
        title: 'Calendar',
        link: '/pages/general/calendar',
      },
      {
        title: 'Alerts',
        link: '/pages/general/alert',
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
    icon: 'pie-chart-outline',
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
