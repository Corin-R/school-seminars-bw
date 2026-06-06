import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import { interpolateRainbow } from "d3-scale-chromatic";
import "leaflet/dist/leaflet.css";

function colorForIndex(index, total) {
  return interpolateRainbow(index / total);
}


export default function App() {
  const [rawData, setRawData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(
    new Set()
  );
  const [pendingCategories, setPendingCategories] = useState(new Set());

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("enriched_data.json")
      .then((r) => r.json())
      .then(setRawData)
      .catch(console.error);
  }, []);

  const allSchools = useMemo(() => {
    if (!rawData?.schools) return [];

    return Object.values(rawData.schools).flat();
  }, [rawData]);

  let seminar_map = {}
  allSchools.forEach(element => {
    var tmp_category = `${element.school_id}~${element.school_kind}`
    if (tmp_category.includes("undefined")) {
      seminar_map[tmp_category] = "School not accociated with a seminar";
    } else {
      seminar_map[tmp_category] = element.school_seminar;
    }
  });

  const categories = useMemo(() => {
    return [
      ...new Set(
        allSchools.map(
          (s) => `${s.school_id}~${s.school_kind}`
        )
      ),
    ].sort();
  }, [allSchools]);

  const categoryMap = useMemo(() => {
    return new Map(
      categories.map((category, idx) => [category, idx])
    );
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const term = search.toLowerCase();
    var filtered_arr = [];

    Object.entries(seminar_map).forEach(element => {
      // console.log(element);
      if (element[0].toLowerCase().includes(term) || element[1].toLowerCase().includes(term)) {
        filtered_arr.push(element[0]);
      }
    });

    /* 
    return categories.filter((c) =>
      c.toLowerCase().includes(term)
    ); 
    */
    return filtered_arr;

  }, [categories, search]);
  // console.log("filtered", filteredCategories);

  function colorForCategory(category) {
    const index = categoryMap.get(category) ?? 0;

    return colorForIndex(
      index,
      categoryMap.size
    );
  }
  function toggleCategory(category) {
    setPendingCategories((prev) => {
      const next = new Set(prev);

      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }

      return next;
    });
  }
  function selectAll() {
    setPendingCategories(new Set(categories));
  }
  function clearAll() {
    setPendingCategories(new Set());
  }
  function applyFilters() {
    setSelectedCategories(new Set(pendingCategories));
  }

  return (
    <div>

      <div style={{
        backgroundColor: "#ff5151",
        padding: 10,
        zIndex: "100"
      }}>
        Users beware: This project has been programmed haphazardly. Also, BW has a disfunctional db. Issues may ocurr!
      </div>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
        }}
      >
        <div
          style={{
            width: 360,
            borderRight: "1px solid #ddd",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: 12,
            overflow: "hidden",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 10,
            }}
          >
            Categories ({categories.length})
          </h3>

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              padding: 8,
              marginBottom: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <button onClick={selectAll}>
              Select All
            </button>

            <button onClick={clearAll}>
              Clear
            </button>

          </div>

          <div
            style={{
              overflowY: "auto",
              flex: 1,
            }}
          >
            {filteredCategories.map((category) => {
              const color =
                colorForCategory(category);

              return (
                <label
                  key={category}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={pendingCategories.has(
                      category
                    )}
                    onChange={() =>
                      toggleCategory(category)
                    }
                  />

                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: category.includes("undefined") ? "#000" : color,
                      display: "inline-block",
                    }}
                  />

                  <span
                    style={{
                      fontSize: 13,
                      wordBreak: "break-word",
                    }}
                  >
                    {seminar_map[category]}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            height: "100%",
          }}
        >
          <MapContainer
            center={[48.5, 9.5]}
            zoom={8}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {allSchools.map((school) => {
              const category =
                `${school.school_id}~${school.school_kind}`;

              const color = category.includes(
                "undefined"
              )
                ? "#000"
                : colorForCategory(category);

              const radius_size = category.includes(
                "undefined"
              )
                ? 4
                : 8;

              const isSelected =
                pendingCategories.size === 0 ||
                pendingCategories.has(category);

              // console.log(school);
              // console.log(pendingCategories);
              // console.log(isSelected)


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
      </div>
    </div>
  );
}
