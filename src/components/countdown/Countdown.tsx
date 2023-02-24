import { Badge, Title2 } from "@fluentui/react-components";
import { t } from "i18next";
import { useCallback } from "react";

import { fluentStyles } from "../../styles/fluent";

export function Countdown(props: { minute: number }) {
  const fluentStyle = fluentStyles();

  const ArrivingBadge = useCallback(() => {
    return props.minute <= 3 ? (
      <div className="badge arriving">
        <Badge color="danger" shape="rounded">
          {t("badge.arriving")}
        </Badge>
      </div>
    ) : null;
  }, [props.minute]);

  const EtaTime = useCallback(() => {
    return props.minute >= 0 ? (
      <Title2 className={fluentStyle.countDown}>{`${props.minute}${t(
        "eta.minuteShort"
      )}`}</Title2>
    ) : null;
  }, [props.minute]);

  return (
    <div className="countdown">
      <ArrivingBadge />
      <EtaTime />
    </div>
  );
}
