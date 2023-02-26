import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Radio,
  RadioGroup,
  Switch,
  SwitchOnChangeData,
  Text,
} from "@fluentui/react-components";
import { Dismiss24Filled } from "@fluentui/react-icons";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { NavItem } from "../../models/nav";
import { SettingOptions } from "../../models/settings";
import { store, useAppDispatch } from "../../store";
import { changeSettings, settingsSelectors } from "../../store/settings/slice";
import { fluentStyles } from "../../styles/fluent";

export function SettingsDialog(props: { width: number; item: NavItem }) {
  const fluentStyle = fluentStyles();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const [isDarkMode, setIsDarkMode] = useState(
    settingsSelectors.selectById(
      store.getState().settings,
      SettingOptions.darkMode
    )?.value ?? false
  );

  const darkModeChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) => {
      setIsDarkMode(data.checked);
      dispatch(
        changeSettings({
          id: SettingOptions.darkMode,
          value: data.checked,
        })
      );
    },
    [isDarkMode]
  );

  const isLargerThanDefaultPhone = useCallback(() => {
    return props.width > 390;
  }, [props.width]);

  const getNavButtonClassName = useCallback(() => {
    switch (true) {
      case props.width >= 800:
        return fluentStyle.sideNavButton;
      case isLargerThanDefaultPhone():
        return fluentStyle.bottomNavButton;
      default:
        return fluentStyle.smallRoundNavButton;
    }
  }, [props.width]);

  const getDialogClassName = useCallback(() => {
    return fluentStyle.dialog;
  }, [props.width]);

  const handleLangChange = useCallback(
    (_: FormEvent<HTMLDivElement>, data: { value: string | undefined }) => {
      i18n.changeLanguage(data.value);
    },
    []
  );

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
            className={getNavButtonClassName()}
            shape="circular"
            appearance="subtle"
            icon={props.item.icon}
            size={isLargerThanDefaultPhone() ? "medium" : "large"}
            title={t(props.item.label) ?? ""}
          >
            {isLargerThanDefaultPhone() && <Text>{t(props.item.label)}</Text>}
          </Button>
        </DialogTrigger>
        <DialogSurface className={getDialogClassName()}>
          <DialogBody>
            <DialogTitle>{t("buttons.languageChange")}</DialogTitle>
            <DialogContent>
              <RadioGroup
                defaultValue={i18n.language}
                aria-labelledby={
                  t("buttons.languageChange") ?? "Language selection"
                }
                onChange={handleLangChange}
                className={fluentStyle.radioGroup}
              >
                <Radio value="en" label={t("lang.en")} />
                <Radio value="fr" label={t("lang.fr")} />
                <Radio value="zh" label={t("lang.zh")} />
              </RadioGroup>
              <br />
              <DialogTitle>{t("buttons.appearance")}</DialogTitle>
              <Switch
                className={fluentStyle.switch}
                checked={isDarkMode}
                onChange={darkModeChange}
                label={t("buttons.darkMode")}
              />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button
                  shape="circular"
                  className="DialogDismissButton"
                  appearance="secondary"
                  icon={<Dismiss24Filled />}
                />
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
