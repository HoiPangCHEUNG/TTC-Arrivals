import { useCallback, useEffect, useState } from "react";

import { lineDataEndpoint } from "../../constants/dataEndpoints";
import { AbortError } from "../../constants/errors";
import { ProcessedRouteDetail } from "../../models/route";
import useNavigate from "../../routes/navigate";
import { StopAccordions } from "../accordions/StopAccordions";
import { FetchTtcData } from "../utils/fetch";
import { extractRouteDataFromJson } from "../utils/jsonParser";

export function RouteInfo(props: { line: number }): JSX.Element {
  const [lineNum] = useState(props.line);
  const { navigate } = useNavigate();
  const [processedRouteList, setProcessedRouteList] = useState<
    ProcessedRouteDetail[]
  >([]);

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

        setProcessedRouteList(extractRouteDataFromJson(data));
      })
      .catch((e) => {
        if (e.name !== AbortError) navigate("/404");
      });

    return () => {
      controller.abort();
    };
  }, []);

  const RouteInfo = useCallback(() => {
    if (processedRouteList) {
      const accordionList: JSX.Element[] = processedRouteList.map(
        (ProcessedRoute) => {
          return (
            <li key={`${ProcessedRoute.tag}`}>
              <StopAccordions
                title={ProcessedRoute.title}
                direction={ProcessedRoute.name}
                lineNum={ProcessedRoute.branch}
                processedStopList={ProcessedRoute.processedStopList}
                tag={ProcessedRoute.tag}
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
  }, [processedRouteList]);

  return <RouteInfo />;
}
