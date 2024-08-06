import { env } from "~/env";

export async function GET(req: Request) {
  console.log(req.url);
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?type=geocode&input=${query}&key=${env.GOOGLE_MAPS_API_KEY}&types=geocode`,
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await res.json();
  console.log(data);
  return Response.json(data.predictions);
}
