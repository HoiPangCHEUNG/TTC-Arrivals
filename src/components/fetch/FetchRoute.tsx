import { Badge, Button } from "@fluentui/react-components";
import { Map24Filled, VehicleBus16Filled } from "@fluentui/react-icons";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  googleMapEndpoint,
  lineDataEndpoint,
} from "../../constants/dataEndpoints";
import { RouteXml } from "../../models/etaXml";
import { LineStop } from "../../models/lineStop";
import useNavigate from "../../routes/navigate";
import { fluentStyles } from "../../styles/fluent";
import { StopAccordions } from "../accordions/StopAccordions";
import { FetchXMLWithCancelToken } from "../utils/fetch";
import { extractStopDataFromXml } from "../utils/xmlParser";

function RouteInfo(props: { line: number }): JSX.Element {
  const [data, setData] = useState<RouteXml>();
  const [lineNum] = useState(props.line);
  const [isLoaded, setIsLoaded] = useState(false);
  const { navigate } = useNavigate();
  const [stopDb, setStopDb] = useState<LineStop[]>([]);
  const fluentStyle = fluentStyles();

  const createStopList = useCallback(
    (stop: { tag: string }[]) => {
      return stop.flatMap((element) => {
        const matchingStop = stopDb.find(
          (searching) => parseInt(element.tag) === searching.id
        );

        // skip not found data
        if (!matchingStop) return [];

        const latLongLink = `${googleMapEndpoint}${matchingStop?.latlong[0]}+${matchingStop?.latlong[1]}`;
        const stopLink = `/stops/${matchingStop?.stopId}`;

        return {
          id: (
            <Badge className={fluentStyle.badge} appearance="outline">
              {matchingStop?.id}
            </Badge>
          ),
          key: matchingStop?.id ?? 0,
          name: `${matchingStop?.name}`,
          latlong: (
            <a title={t("buttons.mapPin") ?? ""} href={latLongLink}>
              <Button icon={<Map24Filled />} />
            </a>
          ),
          stopId: (
            <Link to={stopLink} title={t("buttons.busIcon") ?? ""}>
              <Button icon={<VehicleBus16Filled />} />
            </Link>
          ),
        };
      });
    },
    [stopDb]
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchStopsData = async () => {
      const { parsedData, error } = await FetchXMLWithCancelToken(
        `${lineDataEndpoint}${lineNum}`,
        {
          signal: controller.signal,
          method: "GET",
        }
      );

      return { parsedData, error };
    };

    fetchStopsData().then(({ parsedData, error }) => {
      if (error || !parsedData) {
        return;
      }

      setData(parsedData);
      setStopDb(extractStopDataFromXml(parsedData));
      setIsLoaded(true);
    });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (isLoaded && (data === undefined || data?.body.Error !== undefined)) {
      navigate("/404");
    }
  });

  const Route = useCallback(() => {
    if (data !== undefined && data.body.Error === undefined) {
      const accordionList: JSX.Element[] = data.body.route.direction.map(
        (element) => {
          const list = createStopList(element.stop);
          return (
            <li key={`${element.tag}`}>
              <StopAccordions
                title={element.title}
                direction={element.name}
                lineNum={element.branch}
                result={list}
                tag={element.tag}
              />
            </li>
          );
        }
      );

      return <ul>{accordionList}</ul>;
    }

    return null;
  }, [data]);

  return (
    <div className="stopsListContainer">
      <Route />
    </div>
  );
}
export default RouteInfo;
