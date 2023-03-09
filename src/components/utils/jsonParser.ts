import { XMLParser } from "fast-xml-parser";

import { BranchEta } from "../../models/eta";
import { EtaPredictionJson } from "../../models/etaJson";
import { StopDetail } from "../../models/route";
import { RouteJson } from "../../models/routeJson";

export const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

export function extractRouteDataFromJson(json: RouteJson): StopDetail[] {
  if (!json || !json.route || json.Error) return [];
  return json.route.stop.flatMap((element) => {
    if (element.stopId === undefined) return [];

    return {
      id: parseInt(element.tag),
      name: element.title,
      latlong: { lat: parseFloat(element.lat), long: parseFloat(element.lon) },
      stopId: parseInt(element.stopId),
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
