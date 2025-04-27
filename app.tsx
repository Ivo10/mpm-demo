import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { H3HexagonLayer } from '@deck.gl/geo-layers';

type DataType = {
  hex: string;
  count: number;
};

import type { MapViewState } from '@deck.gl/core';

// 全局保存 root 实例
let root: Root | null = null;

// 定义 App 组件的 Props 类型
interface AppProps {
  data?: DataType[]; // 根据实际数据结构调整
}

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export default function App({ data = [] }: AppProps) {
  const layers = new H3HexagonLayer<DataType>({
    id: 'H3HexagonLayer',
    data: data,
    extruded: true,
    getHexagon: (d: DataType) => d.hex,
    getFillColor: (d: DataType) => [255, (1 - d.count) * 255, 0],
    getElevation: (d: DataType) => 0,
    elevationScale: 20,
    pickable: true
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh', // 占满整个视口
      backgroundColor: 'white' // 保持与页面背景一致
    }}>
      {/* 顶部预留区域 */}
      <div style={{
        borderBottom: '1px solid #eee',
        backgroundColor: 'white'
      }}>
      </div>

      {/* DeckGL 容器 */}
      <div style={{
        flex: 1, // 自动填充剩余空间
        position: 'relative'
      }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
          width="100%"
          height="100%"
        >
          <Map reuseMaps mapStyle={MAP_STYLE} />
        </DeckGL>
      </div>
    </div>
  );
}

// 初始渲染函数
export function renderToDOM(container: HTMLDivElement) {
  root = createRoot(container);
  root.render(<App />);
}

// 更新数据的函数
export function updateData(newData: DataType[]) {
  if (root) {
    root.render(<App data={newData} />); // 重新渲染并传入新数据
  }
}