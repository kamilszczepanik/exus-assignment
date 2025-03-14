import {
	Button,
	Heading,
	Link,
	SkeletonText,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import { HistoryService } from '../../client/index.ts'
import { PaginationFooter } from '../../components/Common/PaginationFooter.tsx'
import CityDropdown from '../../components/Common/CityDropdown.tsx'
import { Link as RouterLink } from '@tanstack/react-router'

type CityCodeType = string | undefined

const PER_PAGE = 20

const weatherHistorySearchSchema = z.object({
	page: z.number().catch(1),
})

export const Route = createFileRoute('/_layout/history')({
	component: WeatherHistory,
	validateSearch: search => weatherHistorySearchSchema.parse(search),
})

function getWeatherHistoryQueryOptions({
	page,
	selectedCityCode,
}: {
	page: number
	selectedCityCode: CityCodeType
}) {
	return {
		queryFn: () =>
			HistoryService.getWeatherHistory({
				skip: (page - 1) * PER_PAGE,
				limit: PER_PAGE,
				cityCode: selectedCityCode,
			}),
		queryKey: ['history', { page, selectedCityCode }],
	}
}

function WeatherHistory() {
	const [selectedCityCode, setSelectedCityCode] =
		useState<CityCodeType>(undefined)
	const queryClient = useQueryClient()
	const { page } = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })
	const setPage = (page: number) =>
		navigate({ search: (prev: any) => ({ ...prev, page }) })
	const {
		data: weatherHistory,
		isPending,
		isPlaceholderData,
	} = useQuery({
		...getWeatherHistoryQueryOptions({ page, selectedCityCode }),
		placeholderData: prevData => prevData,
		enabled: !!selectedCityCode,
	})
	const hasNextPage =
		!isPlaceholderData && weatherHistory?.data.length === PER_PAGE
	const hasPreviousPage = page > 1

	useEffect(() => {
		if (hasNextPage) {
			queryClient.prefetchQuery(
				getWeatherHistoryQueryOptions({ page: page + 1, selectedCityCode }),
			)
		}
	}, [page, queryClient, hasNextPage])

	return (
		<div className="flex w-full flex-col gap-2 px-8 py-20">
			<Heading className="font-bold text-gray-500" size={'sm'}>
				WEATHER HISTORY
			</Heading>
			<div className="flex items-center justify-between gap-2">
				<div className="w-fit">
					<CityDropdown
						getFirstAvailableCity={true}
						onSelectCity={setSelectedCityCode}
					/>
				</div>
				<Button>
					<Link variant={'primary'} as={RouterLink} to="/">
						Current Weather
					</Link>
				</Button>
			</div>
			<TableContainer>
				<Table size={{ base: 'sm', md: 'md' }}>
					<Thead>
						<Tr>
							<Th>Time</Th>
							<Th>Temperature</Th>
							<Th>Humidity</Th>
							<Th>Wind</Th>
						</Tr>
					</Thead>
					{isPending ? (
						<Tbody>
							<Tr>
								{new Array(4).fill(null).map((_, index) => (
									<Td key={index}>
										<SkeletonText noOfLines={1} paddingBlock="16px" />
									</Td>
								))}
							</Tr>
						</Tbody>
					) : (
						<Tbody>
							{weatherHistory?.data.map(item => (
								<Tr key={item.id} opacity={isPlaceholderData ? 0.5 : 1}>
									<Td>{new Date(item.date).toUTCString()}</Td>
									<Td isTruncated maxWidth="150px">
										{item.temperature}°C
									</Td>
									<Td isTruncated maxWidth="150px">
										{item.humidity}%
									</Td>
									<Td isTruncated maxWidth="150px">
										{item.wind}
									</Td>
								</Tr>
							))}
						</Tbody>
					)}
				</Table>
			</TableContainer>
			<PaginationFooter
				page={page}
				onChangePage={setPage}
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
			/>
		</div>
	)
}
