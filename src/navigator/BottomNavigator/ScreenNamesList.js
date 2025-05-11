import Icons from '../../../constants/Icons';
import AllEvents from '../../Screens/AllEvents/AllEvents';
import Dashboard from '../../Screens/Dashboard/Dashboard1';
// import Setting from '../../Screens/Settings/Setting';
import {
  ALL_EVENTS,
  DASHBOARD,
  DASHBOARD_BOTTOM,
} from '../../utils/Routes/Routes';
export const ScreenNamesList = [
  {
    route_path: DASHBOARD_BOTTOM,
    label: 'Dashboard',
    icon: 'home',
    component: Dashboard,
  },
  {
    route_path: ALL_EVENTS,
    label: 'Events',
    icon: "calendar",
    component: AllEvents,
  },
  {
    route_path: ALL_EVENTS,
    label: 'Events',
    icon: "user",
    component: AllEvents,
  },
];
