import { ProgressCircle, Surface } from '@heroui/react';
import { CircleMarker, Popup } from 'react-leaflet';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useSchools } from '@/context/SchoolProvider';

export default function Map() {
  const { colorForCategories, selectedCategories, schools, loading, error } = useSchools();

  if (loading) {
    return (
      <ProgressCircle isIndeterminate aria-label="Loading">
        <ProgressCircle.Track>
          <ProgressCircle.TrackCircle />
          <ProgressCircle.FillCircle />
        </ProgressCircle.Track>
      </ProgressCircle>
    );
  }


  if (error !== null) {
    return (
      <Surface variant='tertiary'>
        Could not load data!
      </Surface>
    );
  }

  return (
    <div className="flex-1 min-w-0 min-h-0 border-2 border-solid">
      <MapContainer
        center={[48.5, 9.5]}
        zoom={8}
        className="w-full h-full"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {schools!.map(school => {
          const category =
            `${school.school_id}-${school.school_kind}`;


          const color = category in colorForCategories
            ? colorForCategories[category]
            : "#000";

          const radius_size = category.includes(
            "undefined"
          )
            ? 4
            : 8;

          const isSelected = selectedCategories[category] ?? true;

          if (!isSelected) {
            return null;
          }

          return (
            <CircleMarker
              key={school.uuid}
              center={[
                school.lat,
                school.lng,
              ]}
              radius={radius_size}
              fillColor={color}
              color="#000"
              fillOpacity={
                isSelected ? 0.9 : 0.1
              }
              opacity={
                isSelected ? 1 : 0
              }
            >
              <Popup>
                <b>{school.name}</b>

                <br />
                {school.city}

                <br />
                Kind: {school.school_kind}

                <br />
                School Seminar ID:{" "}
                {school.school_id}

                <br />
                Seminar:{" "}
                {school.school_seminar}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}