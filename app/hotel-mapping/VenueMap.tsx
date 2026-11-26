"use client";

import { divIcon } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Venue {
  id: number;
  name: string;
  pos: [number, number];
  markerLabel?: string;
  color?: string;
}

function SelectedVenue({ venue }: { venue?: Venue }) {
  const map = useMap();
  useEffect(() => {
    if (venue) map.panTo(venue.pos);
  }, [map, venue]);
  return null;
}

export default function VenueMap({ venues, center, zoom, selectedVenue, onSelect }: {
  venues: Venue[];
  center: [number, number];
  zoom: number;
  selectedVenue: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}
      />
      {venues.map((venue) => {
        const color = venue.color && /^#[0-9a-f]{6}$/i.test(venue.color) ? venue.color : "#1D3D6D";
        const label = venue.markerLabel && /^\d{1,3}$/.test(venue.markerLabel) ? venue.markerLabel : "";
        const icon = divIcon({
          className: "",
          html: `<span style="display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:${color};border:2px solid white;color:white;font-size:11px;font-weight:700;box-shadow:0 0 0 ${selectedVenue === venue.id ? 4 : 1}px #0B2A4A55">${label}</span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });
        return (
          <Marker key={venue.id} position={venue.pos} icon={icon} title={venue.name} eventHandlers={{ click: () => onSelect(venue.id) }}>
            <Popup>{venue.name}</Popup>
          </Marker>
        );
      })}
      <SelectedVenue venue={venues.find((venue) => venue.id === selectedVenue)} />
    </MapContainer>
  );
}
