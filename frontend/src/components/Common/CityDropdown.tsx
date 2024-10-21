import { useQuery } from "@tanstack/react-query";
import { Select } from "@chakra-ui/react";
import { StationsService } from "../../client";

interface Props {
    onSelectCity: (city: string) => void;
}

export default function CityDropdown({ onSelectCity }: Props) {
  const { data: stations, isLoading } = useQuery({
    queryKey: ["stations"],
    queryFn: () => StationsService.getStations(),
  });

  return (
    <Select placeholder="Select city" size={"sm"} onChange={(e) => onSelectCity(e.target.value)}>
      {isLoading ? (
        <option>Loading...</option>
      ) : (
        stations?.data.map((station) => (
          <option key={station.code} value={station.code}>
            {station.name}
          </option>
        ))
      )}
    </Select>
  );
}
