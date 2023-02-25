import { Title1 } from "@fluentui/react-components";
import { t } from "i18next";
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Link, Outlet, useParams } from "react-router-dom";

import "./App.css";
import { BottomBar, SideBar } from "./components/nav/NavBar";

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const { i18n } = useTranslation();

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  const Title = useCallback(() => {
    const params = useParams();

    return params.stopId && width < 800 ? null : (
      <Title1 className="text-xl font-bold">{t("home.title.name")}</Title1>
    );
  }, [width]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="container">
        <header className="navBar">
          <Link
            className="appTitle"
            to={"/"}
            title={t("home.title.tooltip") || ""}
          >
            <Title />
          </Link>
          <SideBar width={width} />
        </header>
        <Outlet />
        <BottomBar width={width} />
      </div>
    </I18nextProvider>
  );
}

export default App;
