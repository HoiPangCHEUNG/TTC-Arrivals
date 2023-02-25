export interface settingsItem {
  id: number;
  value: boolean;
}

export interface settingsRedux {
  ids: string[];
  entities: settingsItem[];
}

/* eslint-disable */
export enum SettingOptions {
  devMode,
  darkMode,
}
/* eslint-disable */
