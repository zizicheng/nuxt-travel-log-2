<script lang="ts" setup>
import { MglMap, MglMarker, MglNavigationControl, MglPopup } from "@indoorequal/vue-maplibre-gl";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import { CENTER_USA } from "~/lib/constants";

setWorkerUrl(workerUrl);

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() =>
  colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 3;

onMounted(() => {
  mapStore.init(); ;
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top"
          :data-tip="point.name"
          :class="{ 'tooltip-open': mapStore.selectedPoint === point }"
          @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
          @mouseleave="mapStore.selectedPoint = null"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="30"
            :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'"
          />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
