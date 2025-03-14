import {
	Button,
	Heading,
	Link,
	Skeleton,
	SkeletonText,
	Text,
	Icon,
	useDisclosure,
} from '@chakra-ui/react'
import { Link as RouterLink, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import CityDropdown from '../../components/Common/CityDropdown'
import { FaEdit, FaPlus, FaTrash, FaWater, FaWind } from 'react-icons/fa'
import {
	ForecastService,
	HistoryService,
	WeatherForecastPublic,
} from '../../client'
import { useQuery } from '@tanstack/react-query'
import AddForecast from '../../components/Forecast/AddForecast'
import Delete from '../../components/Common/DeleteAlert'
import EditForecast from '../../components/Forecast/EditForecast'
import { formatDate, getNextDays } from '../../utils'

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

function Dashboard() {
	const [selectedCityCode, setSelectedCityCode] =
		useState<CityCodeType>(undefined)
	const { data: latestWeather, isLoading: isWeatherLoading } = useQuery({
		...getLatestWeatherQueryOptions({ selectedCityCode }),
	})
	const { data: forecastData, isLoading: isForecastLoading } = useQuery({
		...getWeatherForecastQueryOptions({ selectedCityCode }),
	})
	const nextDays = getNextDays({ amount: FORECAST_DAYS })
	const [hoveredCard, setHoveredCard] = useState<number | null>(null)
	const editForecastModal = useDisclosure()
	const deleteForecastModal = useDisclosure()
	const [isAddForecastOpen, setIsAddForecastOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)

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
								getFirstAvailableCity={true}
								onSelectCity={setSelectedCityCode}
							/>
						</div>
						<div className="w-96">
							{isWeatherLoading || !latestWeather ? (
								<SkeletonText className="w-64" noOfLines={1} />
							) : (
								<Text size={'sm'}>
									{new Date(latestWeather?.data[0]?.date).toUTCString()}
								</Text>
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
								{[...Array(FORECAST_DAYS)].map((_, index) => (
									<Skeleton key={index} className="h-36 min-w-32 py-4" />
								))}
							</div>
						) : (
							<div className="flex gap-4">
								{nextDays.map((day, index) => {
									const forecast = forecastData?.data.find(
										f => new Date(f.date).toDateString() === day.toDateString(),
									)

									return (
										<div
											key={index}
											className="relative flex h-44 w-28 flex-col items-center gap-4 rounded-lg p-2 hover:bg-gray-800"
											onMouseEnter={() => setHoveredCard(index)}
											onMouseLeave={() => setHoveredCard(null)}
										>
											<Text>{formatDate({ date: day })}</Text>
											{forecast ? (
												<>
													<div className="flex gap-1 text-2xl">
														<Text>{forecast.high_temperature}°C</Text>
														<Text className="text-gray-500">
															{forecast.low_temperature}°C
														</Text>
													</div>

													{hoveredCard === index ? (
														<div className="flex w-28 flex-col items-center justify-center gap-2">
															<Button
																size="sm"
																variant="outline"
																className="flex w-24 gap-1"
																onClick={() => {
																	setSelectedDate(day)
																	editForecastModal.onOpen()
																}}
															>
																<Icon as={FaEdit} /> Edit
															</Button>
															<EditForecast
																selectedDate={selectedDate}
																forecast={forecast as WeatherForecastPublic}
																isOpen={editForecastModal.isOpen}
																onClose={editForecastModal.onClose}
																selectedCityCode={selectedCityCode}
															/>
															<Button
																size="sm"
																variant="danger"
																className="flex w-24 gap-1"
																onClick={deleteForecastModal.onOpen}
															>
																<Icon as={FaTrash} />
																Delete
															</Button>
															<Delete
																type={'Forecast'}
																id={forecast.id}
																isOpen={deleteForecastModal.isOpen}
																onClose={deleteForecastModal.onClose}
															/>
														</div>
													) : (
														<div className="flex w-28 flex-col items-center text-gray-500">
															<div>
																<div className="flex items-center gap-1">
																	<Icon as={FaWind} />
																	<Text>{forecast.wind}</Text>
																</div>
																<div className="flex items-center gap-1">
																	<Icon as={FaWater} />
																	<Text>{forecast.humidity}%</Text>
																</div>
															</div>
														</div>
													)}
												</>
											) : (
												<>
													{hoveredCard === index ? (
														<div className="flex w-32 flex-col items-center justify-center gap-2 pt-12">
															<Button
																size="sm"
																variant="primary"
																className="flex w-24 gap-1"
																onClick={() => {
																	setSelectedDate(day)
																	setIsAddForecastOpen(true)
																}}
															>
																<Icon as={FaPlus} /> Add
															</Button>
														</div>
													) : (
														<div className="w-32 pt-12 text-center text-gray-500">
															No forecast available
														</div>
													)}
												</>
											)}
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>
			</div>
			<AddForecast
				isOpen={isAddForecastOpen}
				onClose={() => {
					setIsAddForecastOpen(false)
					setSelectedDate(null)
				}}
				selectedDate={selectedDate} // Pass selected date to modal
				selectedCityCode={selectedCityCode} // Pass selected city to modal
			/>
		</>
	)
}
