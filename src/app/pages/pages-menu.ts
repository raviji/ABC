import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  // {
  //   title: 'Home',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  //   home: true,
  // },
  {
    title: 'General',
    icon: 'grid-outline',
    children: [
      {
        title: 'Home',
        link: '/pages/home',
      },
      {
        title: 'User Dashboard',
        link: '/pages/dashboard',
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
