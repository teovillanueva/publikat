"use client";

import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ViewStateChangeEvent,
} from "react-map-gl";
import React from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { usePathname, useRouter } from "./navigation";
import { GlobalLoading } from "./global-loading";
import type { Billboard, Provider } from "@/db/schema";
import { useTheme } from "next-themes";
import GeocoderControl from "./geocoder-control";
import { BillboardCard } from "./billboard-card";

import "mapbox-gl/dist/mapbox-gl.css";

type PopulatedBillboard = Billboard & {
  provider: Provider;
};

interface BillboardsMapProps {
  initialBounds: [number, number, number, number];
  billboards: PopulatedBillboard[];
}

interface BillboardPopupProps {
  billboards: PopulatedBillboard[];
  selectedBillboardId?: string;
  onClose: () => void;
}

function BillboardPopup({
  billboards,
  selectedBillboardId,
  onClose,
}: BillboardPopupProps) {
  const billboard = billboards.find((b) => b.id === selectedBillboardId);

  if (!billboard) return null;

  return (
    <Popup
      longitude={billboard.location.coordinates[0]}
      latitude={billboard.location.coordinates[1]}
      closeButton={false}
      onClose={onClose}
      className="[&>.mapboxgl-popup-content]:p-0 min-w-[330px]"
    >
      <BillboardCard billboard={billboard} />
    </Popup>
  );
}

export function BillboardsMap({
  initialBounds,
  billboards,
}: BillboardsMapProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [bounds, setBounds] = React.useState(initialBounds);
  const [selectedBillboardId, setSelectedBillboardId] =
    React.useState<string>();
  const [isPending, startTransition] = React.useTransition();

  const onMove = useDebouncedCallback((e: ViewStateChangeEvent) => {
    if (billboards.filter((b) => b.id === selectedBillboardId).length === 0) {
      setSelectedBillboardId(undefined);
    }

    const params = new URLSearchParams(window.location.search);

    const _bounds = e.target.getBounds();

    const bbox = [
      _bounds.getWest(),
      _bounds.getSouth(),
      _bounds.getEast(),
      _bounds.getNorth(),
    ] as [number, number, number, number];

    params.set("bbox", JSON.stringify(bbox));

    // Check the difference between the previous and the new bbox
    // and only update the URL if the difference is significant

    if (Math.abs(bbox[0] - bounds[0]) < 0.01) return;

    setBounds(bbox);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 600);

  return (
    <div className="flex flex-col flex-1">
      <GlobalLoading show={isPending} />
      <Map
        onMove={onMove}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLISHABLE_KEY}
        attributionControl={false}
        style={{ flex: 1 }}
        mapStyle={
          resolvedTheme === "dark"
            ? "mapbox://styles/mapbox/dark-v10"
            : "mapbox://styles/mapbox/streets-v9"
        }
        initialViewState={{
          bounds: initialBounds,
          fitBoundsOptions: {
            padding: { top: 200, bottom: 200, left: 100, right: 100 },
          },
        }}
      >
        <GeolocateControl
          showUserLocation={false}
          fitBoundsOptions={{ duration: 1600, zoom: 14 }}
        />
        <NavigationControl />

        <GeocoderControl
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLISHABLE_KEY!}
          position="top-left"
        />
        <BillboardPopup
          onClose={() => setSelectedBillboardId(undefined)}
          billboards={billboards}
          selectedBillboardId={selectedBillboardId}
        />
        {billboards.map((b) => (
          <>
            <Marker
              onClick={(e) => {
                setSelectedBillboardId(b.id);
                e.originalEvent.stopPropagation();
              }}
              key={b.id}
              longitude={b.location.coordinates[0]}
              latitude={b.location.coordinates[1]}
            />
          </>
        ))}
      </Map>
    </div>
  );
}
