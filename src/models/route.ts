export interface ProcessedStopDetail {
  id: number;
  latlong: string;
  name: string;
  stopId: string;
}

export interface StopAccordionsParams {
  direction: string;
  lineNum: number;
  tag: string;
  title: string;
  stopList: ProcessedStopDetail[];
}

export interface StopDetail {
  id: number;
  name: string;
  latlong: {
    lat: number;
    long: number;
  };
  stopId: number;
}
