"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface Venue {
  id: number;
  name: string;
  pos: [number, number];
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
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    // Load Leaflet only on the client, after mount
    const L = require("leaflet");

    // Fix default marker icon paths — avoids 404s in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });

    const icon = L.divIcon({
      className: "custom-pin",
      html: '<div style="background-color: #1D3D6D; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
    setCustomIcon(icon);
  }, []);

  // Don't render the map until the icon is ready
  if (!customIcon) {
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
          {...({ icon: customIcon } as any)}
        >
          <Popup>{venue.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}