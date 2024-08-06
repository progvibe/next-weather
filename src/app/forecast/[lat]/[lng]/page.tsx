export default function ForecastPage({
  params,
}: {
  params: { lat: string; lon: string };
}) {
  return (
    <div>
      <h1>Forecast</h1>
      <p>lat: {params.lat}</p>
      <p>lon: {params.lon}</p>
    </div>
  );
}
