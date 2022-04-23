import { RouteProps } from "react-router-dom";

import Home from "./Home";
import Chat from "./Chat";

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
] as Array<RouteProps>;
