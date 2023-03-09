interface EtaPredictionDetail {
  branch: string;
  dirTag: string;
  minutes: string;
  seconds: string;
}

interface EtaDirectionDetail {
  title: string;
  prediction: EtaPredictionDetail | EtaPredictionDetail[];
}

interface PredictioDetail {
  direction: EtaDirectionDetail | EtaDirectionDetail[];
  dirTitleBecauseNoPredictions?: string;
  routeTag: string;
  routeTitle: string;
  stopTag: string;
  stopTitle: string;
}
export interface EtaPredictionJson {
  copyright: string;
  predictions: PredictioDetail | PredictioDetail[];
  Error?: {
    content: string;
  };
}
