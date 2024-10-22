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

interface Props {
	isOpen: boolean
	onClose: () => void
}

const AddForecast = ({ isOpen, onClose }: Props) => {
	const queryClient = useQueryClient()
	const showToast = useCustomToast()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<WeatherForecastCreate>({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			wind: '',
			date: '',
			humidity: 0,
			city_code: '',
			low_temperature: 0,
			high_temperature: 0,
		},
	})

	const mutation = useMutation({
		mutationFn: (data: WeatherForecastCreate) =>
			ForecastService.createForecast({ requestBody: data }),
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
					<ModalBody pb={6}>
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
							{errors.wind && (
								<FormErrorMessage>{errors.wind.message}</FormErrorMessage>
							)}
						</FormControl>
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
