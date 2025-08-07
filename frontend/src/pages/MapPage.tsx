import React, { useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN"; // TODO: Kendi tokenınızı ekleyin

const MapPage: React.FC = () => {
  const [viewport, setViewport] = useState({
    latitude: 39.925533,
    longitude: 32.866287,
    zoom: 5,
  });

  return (
    <div className="w-full h-[80vh]">
      <Map
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        onMove={evt => setViewport(evt.viewState)}
      >
        <Marker latitude={39.925533} longitude={32.866287} color="red" />
      </Map>
    </div>
  );
};

export default MapPage;