import { Box, Button, Heading, Link, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import CityDropdown from "../../components/Common/CityDropdown";
import { CityCodeType } from "../../client/core/types";
import { HistoryService } from "../../client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function getLatestWeatherQueryOptions({ selectedCityCode }: { selectedCityCode: CityCodeType }) {
  return {
    queryFn: () =>
      HistoryService.getWeatherHistory({ skip: 0, limit: 1, cityCode: selectedCityCode }),
    queryKey: ["latestWeather", { selectedCityCode }],
    enabled: !!selectedCityCode,
  };
}

function Dashboard() {
  const { user: currentUser } = useAuth();
  const [selectedCityCode, setSelectedCityCode] = useState<CityCodeType>(undefined);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

    const { data: latestWeather, isLoading: isWeatherLoading } = useQuery({
    ...getLatestWeatherQueryOptions({ selectedCityCode }),
  });


  // Function to format the current date and time
  const formatDateTime = (): string => {
    const date = new Date();

    // Options to format the time and date as desired
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleString("en-GB", options);
  };

  useEffect(() => {
    setCurrentDateTime(formatDateTime());

    const intervalId = setInterval(() => {
      setCurrentDateTime(formatDateTime());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);
  

  return (
    <>
      <div className="px-8 py-20 flex flex-col gap-24 w-full">
        <div className="flex flex-col gap-2">
          <Heading className="text-gray-500 font-bold" size={'sm'} >
            CURRENT WEATHER
          </Heading>
          <div className="flex gap-2 items-center">
            <div className="w-fit">
              <CityDropdown onSelectCity={setSelectedCityCode} />
            </div>
            <div className="w-96">
              <Text size={"sm"}>{currentDateTime}</Text>
            </div>
          </div>
          <>
            {isWeatherLoading || !latestWeather ? (
              <Skeleton className="h-16 w-64" />
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <Heading as="h1" size="4xl">
                  {latestWeather.data[0]?.temperature}°C
                </Heading>
                <div className="text-gray-500">
                  <div className="flex gap-1">
                    <label>Wind:</label>
                    <Text>{latestWeather.data[0]?.wind}</Text>
                  </div>
                  <div className="flex gap-1">
                    <label>Humidity:</label>
                    <Text>{latestWeather.data[0]?.humidity}%</Text>
                  </div>
                </div>
              </div>
            )}
          </>
          {/* <div className="flex items-center gap-2">
            <Heading as="h1" size="4xl">
              14°C
            </Heading>
            <div className="text-gray-500">
              <div className="flex gap-1">
                <label>Wind:</label>
                <Text>12 km/h</Text>
              </div>
              <div className="flex gap-1">
                <label>Humidity:</label>
                <Text>79%</Text>
              </div>
            </div>
          </div> */}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between f-full">
            <div className="flex items-center gap-2">
              <label className="text-gray-500 font-bold">FORECAST</label>
              {currentUser && <Button>Edit Forecast</Button>}
            </div>
            <Button>
              <Link variant={'primary'} as={RouterLink} to="/items">
                View Weather History
              </Link>
            </Button>
          </div>
          <div>

          </div>
        </div>
      </div>
    </>
  );
}
