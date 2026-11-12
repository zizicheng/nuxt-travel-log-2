import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const shouldFlyTo = ref(true);

  function selectPointWithoutFlyTo(point: MapPoint) {
    selectedPoint.value = point;
    shouldFlyTo.value = false;
  }

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();
    let bounds: LngLatBounds | null = null;
    const padding = 60;

    watch(mapPoints, (newMapPoints) => {
      const firstPoint = newMapPoints[0];
      if (!firstPoint)
        return;

      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ));

      map.map?.fitBounds(bounds, {
        padding,
      });
    }, {
      immediate: true,
    });

    watchEffect(() => {
      if (selectedPoint.value) {
        if (shouldFlyTo.value) {
          map.map?.flyTo({
            center: [selectedPoint.value.long, selectedPoint.value.lat],
            speed: 0.8,
          });
        }
        shouldFlyTo.value = true;
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, {
          padding,
        });
      }
    });
  }

  return {
    init,
    mapPoints,
    selectedPoint,
    selectPointWithoutFlyTo,
  };
});
