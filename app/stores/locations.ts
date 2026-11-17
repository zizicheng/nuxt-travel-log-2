import type { MapPoint } from "~/lib/types";

export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  watch(
    [data, status],
    ([locations, currentStatus]) => {
      if (locations) {
        const mapPoints: MapPoint[] = [];
        const sidebarItems: SidebarItem[] = [];

        locations.forEach((location) => {
          const mapPoint = createMapPointFromLocation(location);
          sidebarItems.push({
            id: `location-${location.id}`,
            label: location.name,
            icon: "i-tabler:map-pin-filled",
            to: { name: "dashboard-location-slug", params: { slug: location.slug } },
            mapPoint,
          });
          mapPoints.push(mapPoint);
        });
        sidebarStore.sidebarItems = sidebarItems;
        mapStore.mapPoints = mapPoints;
      }

      sidebarStore.loading = currentStatus === "pending";
    },
    {
      immediate: true,
      flush: "sync",
    },
  );

  return {
    locations: data,
    status,
    refresh,
  };
});
