export type LatLongItem = {
  lat: number;
  long: number;
  description: string | null;
};

export type MapPoint = {
  id: number;
  name: string;
} & LatLongItem;
