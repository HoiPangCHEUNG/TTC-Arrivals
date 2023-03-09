import { googleMapEndpoint } from "../../constants/dataEndpoints";
import { BranchEta } from "../../models/eta";
import { EtaPredictionJson } from "../../models/etaJson";
import { ProcessedRouteDetail } from "../../models/route";
import { RouteJson, StopDetail } from "../../models/routeJson";

export function extractRouteDataFromJson(
  json: RouteJson
): ProcessedRouteDetail[] {
  if (!json || !json.route || json.Error) return [];

  const stopDetailDict: Map<string, StopDetail> = new Map();
  json.route.stop.forEach((stop) => {
    stopDetailDict.set(stop.tag, stop);
  });

  return json.route.direction.map((direction) => {
    const processedStopList = direction.stop.flatMap((stopTag) => {
      if (stopDetailDict.has(stopTag.tag)) {
        const item = stopDetailDict.get(stopTag.tag);
        if (!item) return [];
        return {
          id: item.tag,
          title: item.title,
          latLong: `${googleMapEndpoint}${item.lat}+${item.lon}`,
          stopUrl: `/stops/${item.stopId}`,
        };
      }

      return [];
    });

    return {
      processedStopList,
      name: direction.name,
      tag: direction.tag,
      title: direction.title,
      branch: direction.branch,
    };
  });
}

export const extractEtaDataFromJson = (
  json: EtaPredictionJson
): BranchEta[] => {
  if (!json || !json.predictions || json.Error) return [];

  const predictions = Array.isArray(json.predictions)
    ? json.predictions
    : [json.predictions];

  return predictions
    .map((prediction) => {
      if (prediction.dirTitleBecauseNoPredictions) {
        return [
          {
            id: "",
            routeTag: parseInt(prediction.routeTag),
            branchTag: "",
            stopTag: parseInt(prediction.stopTag),
            stopTitle: prediction.stopTitle,
            routeTitle: "",
            destination: "",
            dirTag: "",
          },
        ];
      }

      const directions = Array.isArray(prediction.direction)
        ? prediction.direction
        : [prediction.direction];

      return directions.map((direction) => {
        const etas = Array.isArray(direction.prediction)
          ? direction.prediction
          : [direction.prediction];

        let branchTag = "";
        let dirTag = "";
        const branchEtas: number[] = etas.map((eta) => {
          branchTag =
            branchTag === "" && eta.branch !== "" ? eta.branch : branchTag;
          dirTag = dirTag === "" && eta.dirTag !== "" ? eta.dirTag : dirTag;
          return parseInt(eta.minutes);
        });

        // yes I know, dont't judge me...
        const destination =
          direction.title.split("towards").pop()?.trim() ?? "";

        return {
          id: `${dirTag}-${prediction.stopTag}`,
          routeTag: parseInt(prediction.routeTag),
          branchTag,
          stopTag: parseInt(prediction.stopTag),
          stopTitle: prediction.stopTitle,
          etas: branchEtas,
          destination,
          routeTitle: direction.title,
        };
      });
    })
    .flat()
    .sort((a, b) => b.branchTag.localeCompare(a.branchTag));
};
