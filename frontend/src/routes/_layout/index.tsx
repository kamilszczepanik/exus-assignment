import {
	Button,
	Heading,
	Link,
	Skeleton,
	SkeletonText,
	Text,
	Icon,
} from '@chakra-ui/react'
import { Link as RouterLink, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import CityDropdown from '../../components/Common/CityDropdown'
import { FaWater, FaWind } from 'react-icons/fa'
import { ForecastService, HistoryService } from '../../client'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../components/Common/Navbar'
import AddForecast from '../../components/Forecast/AddForecast'

type CityCodeType = string | undefined

const FORECAST_DAYS = 7

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
				limit: FORECAST_DAYS,
				cityCode: selectedCityCode,
			}),
		queryKey: ['forecast', { selectedCityCode }],
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

function getNextDays(): Date[] {
	const days = []
	const today = new Date()

	for (let i = 0; i < FORECAST_DAYS; i++) {
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
	const nextDays = getNextDays()

	return (
		<>
			<div className="flex w-full flex-col gap-24 px-8 py-20">
				<div className="flex flex-col gap-2">
					<Heading className="font-bold text-gray-500" size={'sm'}>
						CURRENT WEATHER
					</Heading>
					<div className="flex items-center gap-2">
						<div className="w-fit">
							<CityDropdown
								defaultValue={true}
								onSelectCity={setSelectedCityCode}
							/>
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
							<div className="mb-1 flex items-center gap-4">
								<Heading as="h1" size="4xl">
									{latestWeather.data[0]?.temperature}°C
								</Heading>
								<div className="text-gray-500">
									<div className="flex items-center gap-1">
										<Icon as={FaWind} />
										<label>Wind:</label>
										<Text>{latestWeather.data[0].wind}</Text>
									</div>
									<div className="flex items-center gap-1">
										<Icon as={FaWater} />
										<label>Humidity:</label>
										<Text>{latestWeather.data[0].humidity}%</Text>
									</div>
								</div>
							</div>
						)}
					</>
				</div>
				<div className="flex flex-col">
					<div className="f-full flex items-center justify-between">
						<div className="flex items-center gap-2">
							<label className="font-bold text-gray-500">
								{FORECAST_DAYS}-DAY FORECAST
							</label>
							{currentUser && (
								<Navbar type={'Forecast'} addModalAs={AddForecast} />
							)}
						</div>
						<Button>
							<Link variant={'primary'} as={RouterLink} to="/history">
								Weather History
							</Link>
						</Button>
					</div>
					<div className="py-4">
						{isWeatherLoading || !latestWeather || isForecastLoading ? (
							<div className="flex w-full gap-2">
								{[...Array(FORECAST_DAYS)].map(() => (
									<Skeleton className="h-36 min-w-32 py-4" />
								))}
							</div>
						) : (
							<div className="flex gap-8">
								{nextDays.map((day, index) => {
									const forecast = forecastData?.data.find(
										f => new Date(f.date).toDateString() === day.toDateString(),
									)

									return (
										<div
											key={index}
											className="flex min-w-20 max-w-32 flex-col items-center gap-4"
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
														<div className="flex items-center gap-1">
															<Icon as={FaWind} />
															<Text>{forecast.wind}</Text>
														</div>
														<div className="flex items-center gap-1">
															<Icon as={FaWater} />
															<Text>{forecast.humidity}%</Text>
														</div>
													</div>
												</>
											) : (
												<div className="pt-12 text-center text-gray-500">
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
