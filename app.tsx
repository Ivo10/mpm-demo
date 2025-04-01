// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import {H3HexagonLayer} from '@deck.gl/geo-layers';

type DataType = {
  hex: string;
  count: number;
};

import type {MapViewState} from '@deck.gl/core';

const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json'; // eslint-disable-line

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

type DataPoint = [longitude: number, latitude: number, count: number];

export default function App({
  data = DATA_URL,
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 30,
  mapStyle = MAP_STYLE
}: {
  data?: string | DataPoint[];
  intensity?: number;
  threshold?: number;
  radiusPixels?: number;
  mapStyle?: string;
}) {
  const layers = new H3HexagonLayer<DataType>({
    id: 'H3HexagonLayer',
    data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json',

    extruded: true,
    getHexagon: (d: DataType) => d.hex,
    getFillColor: (d: DataType) => [255, (1 - d.count / 500) * 255, 0],
    getElevation: (d: DataType) => d.count,
    elevationScale: 20,
    pickable: true
  });

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}