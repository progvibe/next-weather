"use server";

import { env } from "~/env";

export async function getSearchSuggestions(query: string) {
  const suggestions = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json&input=${query}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return suggestions;
}
