"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface Venue {
  id: number;
  name: string;
  pos: [number, number];
  color?: string;   // optional: accept a hex color
}

export default function VenueMap({
  venues,
  center = [11.5867, 122.7506],
  zoom = 16,
}: {
  venues: Venue[];
  center?: [number, number];
  zoom?: number;
}) {
  const [icons, setIcons] = useState<Record<number, any>>({});

  useEffect(() => {
    const L = require("leaflet");

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });

    const defaultColors: Record<number, string> = {
      1: "#1D3D6D",
      2: "#4CAF50",
      3: "#F57C00",
      4: "#8E24AA",
      5: "#E53935",
    };

    const built: Record<number, any> = {};
    venues.forEach((v) => {
      const hex = v.color || defaultColors[v.id] || "#1D3D6D";
      built[v.id] = L.divIcon({
        className: "custom-pin",
        html: `<div style="background-color: ${hex}; width: 26px; height: 26px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); position: relative;"><span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); color: white; font-weight: 700; font-size: 11px;">${v.id}</span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -26],
      });
    });
    setIcons(built);
  }, [venues]);

  if (Object.keys(icons).length === 0) {
    return (
      <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
        Loading map…
      </div>
    );
  }

  return (
    <MapContainer
      {...({ center } as any)}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        {...({
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        } as any)}
      />
      {venues.map((venue) => (
        <Marker
          key={venue.id}
          position={venue.pos}
          {...({ icon: icons[venue.id] } as any)}
        >
          <Popup>{venue.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}