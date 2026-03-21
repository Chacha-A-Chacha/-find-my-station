"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    label?: string;
    verified?: boolean;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

export default function MapView({
  center,
  zoom = 15,
  markers = [],
  onMapClick,
  className = "",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    if (onMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add markers
    markers.forEach((m) => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);background:${m.verified ? "#16a34a" : "#f59e0b"};display:flex;align-items:center;justify-content:center;">
          ${m.verified ? '<svg width="12" height="12" viewBox="0 0 20 20" fill="white"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ""}
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
      if (m.label) {
        marker.bindPopup(m.label);
      }
    });
  }, [markers]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-64 sm:h-80 rounded-lg overflow-hidden ${className}`}
    />
  );
}
