import L from "leaflet";
import React, { useEffect } from "react";
import { Marker, TileLayer, useMap } from "react-leaflet";

import "./Map.css";

const gpsIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Red_circle.gif?20210202002436",
  iconSize: new L.Point(30, 30),
  className: "Map__MarkerIcon",
});

interface MapProps {
  coordinate: [number, number];
}

function Map({ coordinate }: MapProps) {
  const map = useMap();

  useEffect(() => {
    if (!coordinate) return;

    map.panTo(coordinate);
  }, [coordinate, map]);

  return (
    <div className="Map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={gpsIcon} position={coordinate} autoPan></Marker>
    </div>
  );
}

export default Map;
