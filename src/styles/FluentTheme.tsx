import {
  FluentProvider,
  teamsDarkTheme,
  teamsLightTheme,
} from "@fluentui/react-components";
import { useCallback } from "react";

import { SettingOptions, settingsRedux } from "../models/settings";
import { store, useAppSelector } from "../store";
import { settingsSelectors } from "../store/settings/slice";
import { fluentStyles } from "./fluent";

export function FluentTheme({ children }: { children: JSX.Element }) {
  const fluentStyle = fluentStyles();
  const settings: settingsRedux = useAppSelector((state) => state.settings);

  const isDarkMode = useCallback(() => {
    return (
      settingsSelectors.selectById(
        store.getState().settings,
        SettingOptions.darkMode
      )?.value ?? false
    );
  }, settings.ids);

  return (
    <FluentProvider
      className={fluentStyle.fluentProvider}
      theme={isDarkMode() ? teamsDarkTheme : teamsLightTheme}
    >
      {children}
    </FluentProvider>
  );
}
