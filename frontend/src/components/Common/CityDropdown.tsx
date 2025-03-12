import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Select } from '@chakra-ui/react'
import { StationsService } from '../../client'

interface Props {
	getFirstAvailableCity?: boolean
	defaultCityCode?: string
	onSelectCity: (city: string) => void
	disabled?: boolean
}

export default function CityDropdown({
	getFirstAvailableCity = false,
	defaultCityCode,
	onSelectCity,
	disabled = false,
}: Props) {
	const { data: stations, isLoading } = useQuery({
		queryKey: ['stations'],
		queryFn: () => StationsService.getStations(),
	})
	const [selectedCity, setSelectedCity] = useState<string | null>(null)

	useEffect(() => {
		if (defaultCityCode) {
			setSelectedCity(defaultCityCode)
			onSelectCity(defaultCityCode)
		} else if (getFirstAvailableCity && stations && stations.data.length > 0) {
			setSelectedCity(stations.data[0].code)
			onSelectCity(stations.data[0].code)
		}
	}, [stations, onSelectCity])

	return (
		<Select
			placeholder={!stations?.data.length ? 'Select city' : ''}
			value={selectedCity || ''}
			onChange={e => {
				setSelectedCity(e.target.value)
				onSelectCity(e.target.value)
			}}
			disabled={disabled}
		>
			{isLoading ? (
				<option>Loading...</option>
			) : (
				stations?.data.map(station => (
					<option key={station.code} value={station.code}>
						{station.name}
					</option>
				))
			)}
		</Select>
	)
}
