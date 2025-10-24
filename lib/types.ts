export interface Place {
  id: number;
  name: string;
  coordinates: { lat: number; lng: number } | null;
}

export interface GeolocationResult {
  latitude: number;
  longitude: number;
}
export interface Point {
    lat: number;
    lng: number;
}

export interface RouteRequestBody {
    points: Point[];
    mode?: 'driving' | 'walking' | 'cycling';
}

export interface RouteStep {
    geometry: string;
    source: string;
    target: string;
    distance: number;
    duration: number;
}

export interface Route {
    distance: number;
    duration: number;
    steps: RouteStep[];
    startPlaceName: string;
    endPlaceName: string;
}

export interface RouteResponse {
    routes: Route[];
    error?: string;
}


export interface GeolocationResult {
    latitude: number;
    longitude: number;
}

export interface GeolocationError {
    message: string;
}