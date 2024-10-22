import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Select } from '@chakra-ui/react'
import { StationsService } from '../../client'

interface Props {
	defaultValue?: boolean
	onSelectCity: (city: string) => void
}

export default function CityDropdown({
	defaultValue = false,
	onSelectCity,
}: Props) {
	const { data: stations, isLoading } = useQuery({
		queryKey: ['stations'],
		queryFn: () => StationsService.getStations(),
	})
	const [selectedCity, setSelectedCity] = useState<string | null>(null)

	useEffect(() => {
		if (defaultValue && stations && stations.data.length > 0) {
			setSelectedCity(stations.data[0].code)
			onSelectCity(stations.data[0].code)
		}
	}, [stations, onSelectCity])

	return (
		<Select
			placeholder="Select city"
			value={selectedCity || ''}
			onChange={e => {
				setSelectedCity(e.target.value)
				onSelectCity(e.target.value)
			}}
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
