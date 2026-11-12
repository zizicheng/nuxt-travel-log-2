export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoint = {
  id: number;
  label: string;
} & LatLongItem;
