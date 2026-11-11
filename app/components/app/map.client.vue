<script lang="ts" setup>
import { MglMap, MglNavigationControl } from "@indoorequal/vue-maplibre-gl";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import { CENTER_USA } from "~/lib/constants";

setWorkerUrl(workerUrl);

const colorMode = useColorMode();
const style = computed(() =>
  colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 3;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
