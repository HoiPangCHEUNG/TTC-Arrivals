// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "../App";
import Error from "./Error";
import Home from "./Home";
import Line from "./Line";
import LineSearch from "./LineSearch";
import StopPrediction from "./StopPrediction";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="lines" element={<Outlet />}>
        <Route path=":lineId" element={<Outlet />}>
          <Route index element={<Line />} />
        </Route>
        <Route index element={<LineSearch />} />
      </Route>
      <Route path="stops" element={<Outlet />}>
        <Route path=":stopId" element={<StopPrediction />} />
      </Route>
      <Route path="*" element={<Error />} />
      <Route index element={<Home />} />
    </Route>
  ),
  {
    basename: `${process.env.PUBLIC_URL}`,
  }
);
