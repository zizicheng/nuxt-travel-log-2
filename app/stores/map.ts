import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();

    watch(mapPoints, (newMapPoints) => {
      const firstPoint = newMapPoints[0];
      if (!firstPoint)
        return;

      const bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ));

      map.map?.fitBounds(bounds, {
        padding: 60,
      });
    }, {
      immediate: true,
    });
  }

  return {
    init,
    mapPoints,
  };
});
