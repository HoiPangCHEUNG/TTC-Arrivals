import { Title1 } from "@fluentui/react-components";
import { t } from "i18next";

import { RoutesInfo } from "../components/fetch/FetchRouteList";

export default function LineSearch() {
  return (
    <main className="linePage">
      <Title1>{t("nav.label.lines")}</Title1>
      <RoutesInfo />
    </main>
  );
}
