import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'

import {
	type ApiError,
	type WeatherForecastCreate,
	ForecastService,
} from '../../client'
import useCustomToast from '../../hooks/useCustomToast'
import { handleError } from '../../utils'
import CityDropdown from '../Common/CityDropdown'
import { useEffect } from 'react'

interface Props {
	isOpen: boolean
	onClose: () => void
	selectedDate: Date | null
	selectedCityCode: string | undefined
}

const AddForecast = ({
	isOpen,
	onClose,
	selectedDate,
	selectedCityCode,
}: Props) => {
	const queryClient = useQueryClient()
	const showToast = useCustomToast()
	const formattedDate = selectedDate
		? selectedDate.toISOString().split('T')[0]
		: ''
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<WeatherForecastCreate>({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			date: formattedDate,
			city_code: selectedCityCode || '',
		},
	})

	const mutation = useMutation({
		mutationFn: (data: WeatherForecastCreate) => {
			return ForecastService.createForecast({ requestBody: data })
		},
		onSuccess: () => {
			showToast('Success!', 'Weather forecast created successfully.', 'success')
			reset()
			onClose()
		},
		onError: (err: ApiError) => {
			handleError(err, showToast)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['forecast'] })
		},
	})

	const onSubmit: SubmitHandler<WeatherForecastCreate> = data => {
		mutation.mutate(data)
	}

	useEffect(() => {
		setValue('date', formattedDate)
	}, [selectedDate])

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size={{ base: 'sm', md: 'md' }}
				isCentered
			>
				<ModalOverlay />
				<ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader>Add Forecast</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6} className="flex flex-col">
						<FormControl isRequired isInvalid={!!errors.city_code}>
							<FormLabel htmlFor="city_code">City</FormLabel>
							<CityDropdown
								defaultCityCode={selectedCityCode}
								onSelectCity={code => {
									setValue('city_code', code)
								}}
							/>
							<div className="my-1 min-h-4">
								{errors.city_code && (
									<FormErrorMessage marginTop={0}>
										{errors.city_code.message}
									</FormErrorMessage>
								)}
							</div>
						</FormControl>
						<FormControl isRequired isInvalid={!!errors.date}>
							<FormLabel htmlFor="date">Date</FormLabel>
							<Input
								id="date"
								{...register('date', {
									required: 'Date is required.',
								})}
								placeholder="Date"
								type="date"
							/>
							<div className="my-1 min-h-4">
								{errors.date && (
									<FormErrorMessage marginTop={0}>
										{errors.date.message}
									</FormErrorMessage>
								)}
							</div>
						</FormControl>

						<div className="flex gap-4">
							<FormControl isRequired isInvalid={!!errors.high_temperature}>
								<FormLabel htmlFor="high_temperature">
									High Temp. (°C)
								</FormLabel>
								<Input
									id="high_temperature"
									{...register('high_temperature', {
										required: 'High temp. is required.',
									})}
									placeholder="High"
									type="number"
								/>
								<div className="my-1 min-h-4">
									{errors.high_temperature && (
										<FormErrorMessage marginTop={0}>
											{errors.high_temperature.message}
										</FormErrorMessage>
									)}
								</div>
							</FormControl>

							<FormControl isRequired isInvalid={!!errors.low_temperature}>
								<FormLabel htmlFor="low_temperature">Low Temp. (°C)</FormLabel>
								<Input
									id="low_temperature"
									{...register('low_temperature', {
										required: 'Low temp. is required.',
									})}
									placeholder="Low"
									type="number"
								/>
								<div className="my-1 min-h-4">
									{errors.low_temperature && (
										<FormErrorMessage marginTop={0}>
											{errors.low_temperature.message}
										</FormErrorMessage>
									)}
								</div>
							</FormControl>
						</div>
						<div className="flex gap-4">
							<FormControl isRequired isInvalid={!!errors.wind}>
								<FormLabel htmlFor="wind">Wind</FormLabel>
								<Input
									id="wind"
									{...register('wind', {
										required: 'Wind is required.',
									})}
									placeholder="Wind"
									type="text"
								/>
								<div className="my-1 min-h-4">
									{errors.wind && (
										<FormErrorMessage marginTop={0}>
											{errors.wind.message}
										</FormErrorMessage>
									)}
								</div>
							</FormControl>

							<FormControl isRequired isInvalid={!!errors.humidity}>
								<FormLabel htmlFor="humidity">Humidity</FormLabel>
								<Input
									id="humidity"
									{...register('humidity', {
										required: 'Humidity is required.',
										min: {
											value: 0,
											message: 'Humidity cannot be less than 0',
										},
										max: {
											value: 100,
											message: 'Humidity cannot be more than 100',
										},
									})}
									placeholder="Humidity"
									type="number"
								/>
								<div className="my-1 min-h-4">
									{errors.humidity && (
										<FormErrorMessage marginTop={0}>
											{errors.humidity.message}
										</FormErrorMessage>
									)}
								</div>
							</FormControl>
						</div>
					</ModalBody>
					<ModalFooter gap={3}>
						<Button variant="primary" type="submit" isLoading={isSubmitting}>
							Save
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default AddForecast
