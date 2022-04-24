import { RouteProps } from "react-router-dom";

import Home from "./Home";
import Chat from "./Chat";
import YouMayKnown from "./YouMayKnown";

export default [
  {
    component: Home,
    exact: true,
    path: "/messages",
  },
  {
    component: Chat,
    exact: true,
    path: "/messages/:conversationId",
  },
  {
    component: YouMayKnown,
    exact: true,
    path: "/contacts",
  },
] as Array<RouteProps>;
