export interface ProcessedStopDetail {
  id: string;
  title: string;
  latLong: string;
  stopUrl: string;
}

export interface ProcessedRouteDetail {
  name: string;
  tag: string;
  title: string;
  branch: string;
  processedStopList: ProcessedStopDetail[];
}

export interface StopAccordionsParams {
  direction: string;
  lineNum: string;
  tag: string;
  title: string;
  processedStopList: ProcessedStopDetail[];
}
