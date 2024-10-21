import { Button, Heading, Link, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
    const { data: latestWeather, isLoading: isWeatherLoading } = useQuery({
    ...getLatestWeatherQueryOptions({ selectedCityCode }),
  });

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
              {isWeatherLoading || !latestWeather ? (
              <SkeletonText className="w-64" noOfLines={1} />
            ) : (<Text size={"sm"}>{latestWeather?.data[0]?.date}</Text>)}
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
