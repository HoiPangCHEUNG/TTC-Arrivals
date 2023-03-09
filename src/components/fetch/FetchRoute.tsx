import { useCallback, useEffect, useState } from "react";

import {
  googleMapEndpoint,
  lineDataEndpoint,
} from "../../constants/dataEndpoints";
import { AbortError } from "../../constants/errors";
import { StopDetail } from "../../models/route";
import { RouteJson } from "../../models/routeJson";
import useNavigate from "../../routes/navigate";
import { StopAccordions } from "../accordions/StopAccordions";
import { FetchTtcData } from "../utils/fetch";
import { extractRouteDataFromJson } from "../utils/jsonParser";

export function RouteInfo(props: { line: number }): JSX.Element {
  const [data, setData] = useState<RouteJson>();
  const [lineNum] = useState(props.line);
  const { navigate } = useNavigate();
  const [stopDb, setStopDb] = useState<StopDetail[]>([]);

  const createStopList = useCallback(
    (stop: { tag: string }[]) => {
      return stop.flatMap((element) => {
        const matchingStop = stopDb.find(
          (searching) => parseInt(element.tag) === searching.id
        );

        // skip not found data
        if (!matchingStop) return [];

        const latLongLink = `${googleMapEndpoint}${matchingStop?.latlong.lat}+${matchingStop?.latlong.long}`;
        const stopLink = `/stops/${matchingStop?.stopId}`;

        return {
          id: matchingStop?.id,
          name: matchingStop?.name,
          latlong: latLongLink,
          stopId: stopLink,
        };
      });
    },
    [stopDb]
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchStopsData = async () => {
      const data = await FetchTtcData(`${lineDataEndpoint}${lineNum}`, {
        signal: controller.signal,
        method: "GET",
      });

      return data;
    };

    fetchStopsData()
      .then((data) => {
        if (!data) {
          return;
        }

        if (data.Error) {
          navigate("/404");
        }

        setData(data);
        setStopDb(extractRouteDataFromJson(data));
      })
      .catch((e) => {
        if (e.name !== AbortError) navigate("/404");
      });

    return () => {
      controller.abort();
    };
  }, []);

  const RouteInfo = useCallback(() => {
    if (data && !data.Error) {
      const accordionList: JSX.Element[] = data.route.direction.map(
        (element) => {
          const list = createStopList(element.stop);
          return (
            <li key={`${element.tag}`}>
              <StopAccordions
                title={element.title}
                direction={element.name}
                lineNum={parseInt(element.branch)}
                stopList={list}
                tag={element.tag}
              />
            </li>
          );
        }
      );

      return (
        <div className="stopsListContainer">
          <ul>{accordionList}</ul>
        </div>
      );
    }

    return null;
  }, [data]);

  return <RouteInfo />;
}
