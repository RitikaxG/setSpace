import { RefObject, useEffect, useState } from "react";
import axios from "axios";

type Props = {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  className: string;
  // eslint-disable-next-line react/require-default-props
  reference?: RefObject<HTMLInputElement | null>;
};

type Suggestion = {
  display_name: string;
};
export default function CityAutocompleteInput({
  value,
  onChange,
  className,
  reference,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [query, setQuery] = useState(value || "");

  // Sync internal inputValue with external value from react-hook-form
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Every time query chnages fetch new suggestions by sending an API request
  useEffect(() => {
    if (!query) return () => {};
    const fetchSuggestions = async () => {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`,
      );
      setSuggestions(response.data);
    };

    const timeoutId = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (name: string) => {
    setQuery(name);
    setSuggestions([]);
    onChange(name);
  };

  return (
    <div className="relative">
      <input
        ref={reference}
        className={className}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Choose your city"
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((sugg) => (
            <li
              key={sugg.display_name}
              className="flex justify-start text-start"
            >
              <button
                type="button"
                onClick={() => {
                  handleSelect(sugg.display_name);
                }}
              >
                {sugg.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
