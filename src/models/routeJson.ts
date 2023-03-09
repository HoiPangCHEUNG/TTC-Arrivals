export interface RouteJson {
  copyright: string;
  route: RouteDetail;
  Error?: {
    content: string;
  };
}

interface RouteDetail {
  stop: StopDetail[];
  direction: DirectionDetail[];
}

interface DirectionDetail {
  branch: string;
  name: string;
  stop: { tag: string }[];
  tag: string;
  title: string;
}

interface StopDetail {
  lat: string;
  lon: string;
  stopId: string;
  tag: string;
  title: string;
}
