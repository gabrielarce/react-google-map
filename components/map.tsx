import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Homes from "./homes";
import Distance from "./distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [office, setOffice] = useState<LatLngLiteral>();
  const [officeAlias, setOfficeAlias] = useState<string | null>(null);
  const [homes, setHomes] = useState<Array<string>>([]);
  const [homesCoords, setHomesCoords] = useState<Array<LatLngLiteral>>([]);
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 34.05, lng: -118.24 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "b181cac70f27f5e6",
      disableDefaultUI: false,
      clickableIcons: false,
    }),
    []
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const houses = useMemo(() => homesCoords, [homesCoords]);

  const fetchDirections = (house: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: house,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: tomorrow,
        },
      },
      (result, status) => {
        if (status === "OK" && result) {
          console.log(result);
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="controls">
        <div className={`interface ${isMenuOpen ? "closed" : ""}`}>
          <h1>Commute Cost Calculator</h1>
          <h4>Office Location</h4>
          <Places
            setOffice={(position) => {
              setOffice(position);
              mapRef.current?.panTo(position);
            }}
            setOfficeAlias={(address) => {
              setOfficeAlias(address);
            }}
          />
          {!office && (
            <div className="box bounce-6">
              <p>Enter the address of your office.</p>
            </div>
          )}
          {officeAlias && (
            <div>
              <p className="officeAddress">{officeAlias}</p>
            </div>
          )}

          {directions && <Distance leg={directions.routes[0].legs[0]} />}
          <hr />
          <h4>Homes Locations</h4>
          <Homes
            setHomes={(position) => {
              setHomes([...homes, position]);
            }}
            setHomesCoords={(position) => {
              setHomesCoords([...homesCoords, position]);
            }}
          />
          {homes && (
            <div>
              <ul>
                {homes.map((h, i) => (
                  <li
                    key={i}
                    className="homesAddress"
                    onClick={() => fetchDirections(homesCoords[i])}
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="tab" onClick={toggleMenu}>
          {isMenuOpen ? ">" : "<"}
        </div>
      </div>

      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {office && (
            <>
              <Marker
                position={office}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />

              <MarkerClusterer>
                {(clusterer) =>
                  houses.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(house);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>

              <Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={45000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(8);
tomorrow.setMinutes(0);
tomorrow.setSeconds(0);
tomorrow.setMilliseconds(0);
