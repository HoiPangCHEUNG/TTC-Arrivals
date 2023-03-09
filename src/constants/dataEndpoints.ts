const endpoint = "https://retro.umoiq.com/service/publicJSONFeed?command=";

export const multiRouteDataEndpoint = `${endpoint}predictionsForMultiStops&a=ttc`;

export const stopsDataEndpoint = `${endpoint}predictions&a=ttc&stopId=`;

export const lineDataEndpoint = `${endpoint}routeConfig&a=ttc&r=`;

export const routeListEndpoint = `${endpoint}routeList&a=ttc`;

export const googleMapEndpoint = "http://maps.google.com/maps?z=12&t=m&q=loc:";
