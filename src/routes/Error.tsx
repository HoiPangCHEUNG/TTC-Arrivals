import { Text } from "@fluentui/react-components";
import { t } from "i18next";

export default function Error() {
  return (
    <div>
      <Text>{t("error.notFound")}</Text>
    </div>
  );
}
