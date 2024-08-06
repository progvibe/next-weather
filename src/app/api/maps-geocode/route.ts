import { env } from "~/env";

export async function GET(req: Request) {
  console.log(req.url);
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${env.GOOGLE_MAPS_API_KEY}`,
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await res.json();
  console.log(data);
  return Response.json(data.results);
}
