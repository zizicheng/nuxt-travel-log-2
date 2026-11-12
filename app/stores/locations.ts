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
        sidebarStore.sidebarItems = locations.map(location => ({
          id: `location-${location.id}`,
          label: location.name,
          icon: "i-tabler:map-pin-filled",
          href: "#",
          location,
        }));

        mapStore.mapPoints = data.value ?? [];
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
