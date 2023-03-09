import { useCallback, useEffect, useState } from "react";

import {
  googleMapEndpoint,
  lineDataEndpoint,
} from "../../constants/dataEndpoints";
import { StopDetail } from "../../models/route";
import { RouteJson } from "../../models/routeJson";
import useNavigate from "../../routes/navigate";
import { StopAccordions } from "../accordions/StopAccordions";
import { FetchTtcData } from "../utils/fetch";
import { extractRouteDataFromJson } from "../utils/jsonParser";

export function RouteInfo(props: { line: number }): JSX.Element {
  const [data, setData] = useState<RouteJson>();
  const [lineNum] = useState(props.line);
  const [isLoaded, setIsLoaded] = useState(false);
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
      const { data, error } = await FetchTtcData(
        `${lineDataEndpoint}${lineNum}`,
        {
          signal: controller.signal,
          method: "GET",
        }
      );

      return { data, error };
    };

    fetchStopsData().then(({ data, error }) => {
      if (error || !data) {
        return;
      }

      setData(data);
      setStopDb(extractRouteDataFromJson(data));
      setIsLoaded(true);
    });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (isLoaded && (data === undefined || data?.Error !== undefined)) {
      console.log("GGG");
      navigate("/404");
    }
  });

  const RouteInfo = useCallback(() => {
    if (data && !data.Error) {
      console.log("??");
      console.log(data);
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
