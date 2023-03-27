import Places from "./places";

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Controls({ leg }: DistanceProps) {
  <div className="controls">
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
  </div>;
}
