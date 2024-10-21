import {
	Button,
	Heading,
	Link,
	Skeleton,
	SkeletonText,
	Text,
} from '@chakra-ui/react'
import { Link as RouterLink, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import CityDropdown from '../../components/Common/CityDropdown'

import { ForecastService, HistoryService } from '../../client'
import { useQuery } from '@tanstack/react-query'

type CityCodeType = string | undefined

export const Route = createFileRoute('/_layout/')({
	component: Dashboard,
})

function getLatestWeatherQueryOptions({
	selectedCityCode,
}: {
	selectedCityCode: CityCodeType
}) {
	return {
		queryFn: () =>
			HistoryService.getWeatherHistory({
				skip: 0,
				limit: 1,
				cityCode: selectedCityCode,
			}),
		queryKey: ['latestWeather', { selectedCityCode }],
		enabled: !!selectedCityCode,
	}
}

function getWeatherForecastQueryOptions({
	selectedCityCode,
}: {
	selectedCityCode: CityCodeType
}) {
	return {
		queryFn: () =>
			ForecastService.getWeatherForecast({
				skip: 0,
				limit: 7,
				cityCode: selectedCityCode,
			}),
		queryKey: ['weatherForecast', { selectedCityCode }],
		enabled: !!selectedCityCode,
	}
}

function formatDate(dateString: Date): string {
	const date = new Date(dateString)

	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
	}

	return date.toLocaleDateString('en-US', options)
}

function getNext7Days(): Date[] {
	const days = []
	const today = new Date()

	for (let i = 0; i < 7; i++) {
		const nextDay = new Date(today)
		nextDay.setDate(today.getDate() + i)
		days.push(nextDay)
	}

	return days
}

function Dashboard() {
	const { user: currentUser } = useAuth()
	const [selectedCityCode, setSelectedCityCode] =
		useState<CityCodeType>(undefined)
	const { data: latestWeather, isLoading: isWeatherLoading } = useQuery({
		...getLatestWeatherQueryOptions({ selectedCityCode }),
	})
	const { data: forecastData, isLoading: isForecastLoading } = useQuery({
		...getWeatherForecastQueryOptions({ selectedCityCode }),
	})
	const next7Days = getNext7Days()

	return (
		<>
			<div className="flex w-full flex-col gap-24 px-8 py-20">
				<div className="flex flex-col gap-2">
					<Heading className="font-bold text-gray-500" size={'sm'}>
						CURRENT WEATHER
					</Heading>
					<div className="flex items-center gap-2">
						<div className="w-fit">
							<CityDropdown onSelectCity={setSelectedCityCode} />
						</div>
						<div className="w-96">
							{isWeatherLoading || !latestWeather ? (
								<SkeletonText className="w-64" noOfLines={1} />
							) : (
								<Text size={'sm'}>{latestWeather?.data[0]?.date}</Text>
							)}
						</div>
					</div>
					<>
						{isWeatherLoading || !latestWeather ? (
							<Skeleton className="h-16 w-64" />
						) : (
							<div className="mb-1 flex items-center gap-2">
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
					<div className="f-full flex items-center justify-between">
						<div className="flex items-center gap-2">
							<label className="font-bold text-gray-500">7-DAY FORECAST</label>
							{currentUser && <Button>Edit Forecast</Button>}
						</div>
						<Button>
							<Link variant={'primary'} as={RouterLink} to="/items">
								View Weather History
							</Link>
						</Button>
					</div>
					<div>
						{isForecastLoading ? (
							<SkeletonText className="w-full" noOfLines={7} />
						) : (
							<div className="flex gap-8">
								{next7Days.map((day, index) => {
									const forecast = forecastData?.data.find(
										f => new Date(f.date).toDateString() === day.toDateString(),
									)

									return (
										<div
											key={index}
											className="flex flex-col items-center gap-4 py-4"
										>
											<Text>{formatDate(day)}</Text>
											{forecast ? (
												<>
													<div className="flex gap-1 text-2xl">
														<Text>{forecast.high_temperature}°C</Text>
														<Text className="text-gray-500">
															{forecast.low_temperature}°C
														</Text>
													</div>
													<div className="text-gray-500">
														<Text>Wind: {forecast.wind}</Text>
														<Text>Humidity: {forecast.humidity}%</Text>
													</div>
												</>
											) : (
												<div className="text-gray-500">
													No forecast available
												</div>
											)}
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
