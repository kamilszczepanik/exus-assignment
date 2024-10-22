export type Body_login_login_access_token = {
	grant_type?: string | null
	username: string
	password: string
	scope?: string
	client_id?: string | null
	client_secret?: string | null
}

export type HTTPValidationError = {
	detail?: Array<ValidationError>
}

export type Message = {
	message: string
}

export type MeteorologicalStation = {
	name: string
	latitude: number
	longitude: number
	date_of_installation: string
	code?: string
}

export type MeteorologicalStationPublic = {
	name: string
	latitude: number
	longitude: number
	date_of_installation: string
	code: string
}

export type MeteorologicalStationsPublic = {
	data: Array<MeteorologicalStationPublic>
	count: number
}

export type NewPassword = {
	token: string
	new_password: string
}

export type Token = {
	access_token: string
	token_type?: string
}

export type UpdatePassword = {
	current_password: string
	new_password: string
}

export type User = {
	email: string
	is_active?: boolean
	is_superuser?: boolean
	full_name?: string | null
	id?: string
	hashed_password: string
}

export type UserCreate = {
	email: string
	is_active?: boolean
	is_superuser?: boolean
	full_name?: string | null
	password: string
}

export type UserPublic = {
	email: string
	is_active?: boolean
	is_superuser?: boolean
	full_name?: string | null
	id: string
}

export type UserRegister = {
	email: string
	password: string
	full_name?: string | null
}

export type UserUpdate = {
	email?: string | null
	is_active?: boolean
	is_superuser?: boolean
	full_name?: string | null
	password?: string | null
}

export type UserUpdateMe = {
	full_name?: string | null
	email?: string | null
}

export type UsersPublic = {
	data: Array<UserPublic>
	count: number
}

export type ValidationError = {
	loc: Array<string | number>
	msg: string
	type: string
}

export type WeatherForecastCreate = {
	date: string
	high_temperature: number
	low_temperature: number
	wind: string
	humidity: number
	city_code: string
}

export type WeatherForecastPublic = {
	date: string
	high_temperature: number
	low_temperature: number
	wind: string
	humidity: number
	id: string
	city: MeteorologicalStation
	user: User | null
}

export type WeatherForecastsPublic = {
	data: Array<WeatherForecastPublic>
	count: number
}

export type WeatherHistoryPublic = {
	date: string
	temperature: number
	wind: string
	humidity: number
	id: string
	city: MeteorologicalStation
}

export type WeatherHistorysPublic = {
	data: Array<WeatherHistoryPublic>
	count: number
}
