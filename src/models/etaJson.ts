interface EtaPredictionDetail {
  branch: string;
  dirTag: string;
  minutes: string;
  seconds: string;
}

interface EtaDirection {
  title: string;
  prediction: EtaPredictionDetail | EtaPredictionDetail[];
}

interface EtaPrediction {
  direction: EtaDirection | EtaDirection[];
  dirTitleBecauseNoPredictions?: string;
  routeTag: string;
  routeTitle: string;
  stopTag: string;
  stopTitle: string;
}
export interface EtaPredictionJson {
  copyright: string;
  predictions: EtaPrediction | EtaPrediction[];
  Error?: {
    content: string;
  };
}
