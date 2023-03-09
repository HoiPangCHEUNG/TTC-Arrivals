import { Badge, Text } from "@fluentui/react-components";
import { Card } from "@fluentui/react-components/unstable";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { routeListEndpoint } from "../../constants/dataEndpoints";
import { fluentStyles } from "../../styles/fluent";
import { FetchTtcData } from "../utils/fetch";
import { parseRouteTitle } from "../utils/routeName";

export function RoutesInfo() {
  const [routesDb, setRoutesDb] = useState<{ tag: number; title: string }[]>(
    []
  );
  const fluentStyle = fluentStyles();

  useEffect(() => {
    const controller = new AbortController();

    const fetchEtaData = async () => {
      const { data, error } = await FetchTtcData(routeListEndpoint, {
        signal: controller.signal,
        method: "GET",
      });

      return { data, error };
    };

    fetchEtaData().then(({ data, error }) => {
      if (error || !data) {
        return;
      }

      if (data.route.length > 0) {
        setRoutesDb(data.route);
      }
    });

    return () => {
      controller.abort();
    };
  }, []);

  const RoutesInfo = useCallback(() => {
    const cards = routesDb.map((routeItem) => {
      const cardLink = `/lines/${routeItem.tag}`;
      return (
        <li key={routeItem.tag}>
          <Card className={fluentStyle.card}>
            <Link className="routeCard" to={cardLink}>
              <Badge className={fluentStyle.routeBadge}>{routeItem.tag}</Badge>
              <Text>{parseRouteTitle(routeItem.title)}</Text>
            </Link>
          </Card>
        </li>
      );
    });

    return (
      <div>
        <ul className="routeList">{cards}</ul>
      </div>
    );
  }, [routesDb]);

  return <RoutesInfo />;
}
