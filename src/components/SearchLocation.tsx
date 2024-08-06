"use client";

import React, { useEffect } from "react";
import { Command, CommandEmpty, CommandInput, CommandList } from "./ui/command";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/router";

const autocompletePredictionSchema = z.object({
  description: z.string(),
  matched_substrings: z.array(
    z.object({
      length: z.number(),
      offset: z.number(),
    }),
  ),
  place_id: z.string(),
  reference: z.string(),
  structured_formatting: z.object({
    main_text: z.string(),
    main_text_matched_substrings: z.array(
      z.object({
        length: z.number(),
        offset: z.number(),
      }),
    ),
    secondary_text: z.string().optional(),
  }),
});

const geocodeSchema = z.object({
  address_components: z.array(
    z.object({
      long_name: z.string(),
      short_name: z.string(),
      types: z.array(z.string()),
    }),
  ),
  formatted_address: z.string(),
  geometry: z.object({
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    viewport: z.object({
      northeast: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      southwest: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    bounds: z.object({
      northeast: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      southwest: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
  }),
});

const autocompleteResponseSchema = z.array(autocompletePredictionSchema);
type AutocompletePrediction = z.infer<typeof autocompletePredictionSchema>;

const geocodeResponseSchema = z.array(geocodeSchema);
type GeocodeResponse = z.infer<typeof geocodeSchema>;

export function SearchLocation() {
  const [searchValue, setSearchValue] = React.useState("south");
  const [suggestions, setSuggestions] = React.useState<
    AutocompletePrediction[]
  >([]);
  const router = useRouter();

  const debouncedGetSuggestions = useDebouncedCallback(
    async (search: string) => {
      const autocompleteResult = await fetch(
        "api/maps-autocomplete?query=" + search,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const autoCompleteResponse = await autocompleteResult.json();
      console.log(autoCompleteResponse);
      const predictions =
        autocompleteResponseSchema.parse(autoCompleteResponse);
      setSuggestions(predictions);
    },
    300,
  );
  const geocodeSelection = React.useCallback(
    async (selectedPrediction: AutocompletePrediction) => {
      console.log(selectedPrediction);
      const geocodeResult = await fetch(
        "api/maps-geocode?query=" + selectedPrediction.description,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const geocodeResponse = await geocodeResult.json();
      console.log(geocodeResponse);
      try {
        const decoded = geocodeResponseSchema.parse(geocodeResponse);
        console.log(decoded);
        if (decoded.length > 0) {
          const lat = decoded[0]?.geometry?.location?.lat;
          const lng = decoded[0]?.geometry?.location?.lng;
          console.log(lat, lng);
          void router.push(`/forecast/${lat}/${lng}`);
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    [],
  );
  useEffect(() => {
    void debouncedGetSuggestions(searchValue);
  }, [searchValue, debouncedGetSuggestions]);

  return (
    <Command>
      <CommandInput
        placeholder="Type a command or search..."
        value={searchValue}
        onValueChange={(e) => {
          setSearchValue(e);
        }}
      />
      <CommandList>
        {suggestions.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {suggestions.map((suggestion) => (
          <Command
            key={suggestion.place_id}
            onClick={() => geocodeSelection(suggestion)}
          >
            {suggestion.description}
          </Command>
        ))}
      </CommandList>
    </Command>
  );
}
