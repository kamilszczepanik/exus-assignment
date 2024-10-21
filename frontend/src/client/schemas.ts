export const $Body_login_login_access_token = {
	properties: {
		grant_type: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					pattern: 'password',
				},
				{
					type: 'null',
				},
			],
		},
		username: {
			type: 'string',
			isRequired: true,
		},
		password: {
			type: 'string',
			isRequired: true,
		},
		scope: {
			type: 'string',
			default: '',
		},
		client_id: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
				},
				{
					type: 'null',
				},
			],
		},
		client_secret: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
				},
				{
					type: 'null',
				},
			],
		},
	},
} as const

export const $HTTPValidationError = {
	properties: {
		detail: {
			type: 'array',
			contains: {
				type: 'ValidationError',
			},
		},
	},
} as const

export const $ItemCreate = {
	properties: {
		title: {
			type: 'string',
			isRequired: true,
			maxLength: 255,
			minLength: 1,
		},
		description: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
	},
} as const

export const $ItemPublic = {
	properties: {
		title: {
			type: 'string',
			isRequired: true,
			maxLength: 255,
			minLength: 1,
		},
		description: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
		id: {
			type: 'string',
			isRequired: true,
			format: 'uuid',
		},
		owner_id: {
			type: 'string',
			isRequired: true,
			format: 'uuid',
		},
	},
} as const

export const $ItemUpdate = {
	properties: {
		title: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
					minLength: 1,
				},
				{
					type: 'null',
				},
			],
		},
		description: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
	},
} as const

export const $ItemsPublic = {
	properties: {
		data: {
			type: 'array',
			contains: {
				type: 'ItemPublic',
			},
			isRequired: true,
		},
		count: {
			type: 'number',
			isRequired: true,
		},
	},
} as const

export const $Message = {
	properties: {
		message: {
			type: 'string',
			isRequired: true,
		},
	},
} as const

export const $MeteorologicalStation = {
	properties: {
		name: {
			type: 'string',
			isRequired: true,
			maxLength: 255,
			minLength: 1,
		},
		latitude: {
			type: 'number',
			isRequired: true,
		},
		longitude: {
			type: 'number',
			isRequired: true,
		},
		date_of_installation: {
			type: 'string',
			isRequired: true,
			format: 'date-time',
		},
		code: {
			type: 'string',
			format: 'uuid',
		},
	},
} as const

export const $MeteorologicalStationPublic = {
	properties: {
		name: {
			type: 'string',
			isRequired: true,
			maxLength: 255,
			minLength: 1,
		},
		latitude: {
			type: 'number',
			isRequired: true,
		},
		longitude: {
			type: 'number',
			isRequired: true,
		},
		date_of_installation: {
			type: 'string',
			isRequired: true,
			format: 'date-time',
		},
		code: {
			type: 'string',
			isRequired: true,
			format: 'uuid',
		},
	},
} as const

export const $MeteorologicalStationsPublic = {
	properties: {
		data: {
			type: 'array',
			contains: {
				type: 'MeteorologicalStationPublic',
			},
			isRequired: true,
		},
		count: {
			type: 'number',
			isRequired: true,
		},
	},
} as const

export const $NewPassword = {
	properties: {
		token: {
			type: 'string',
			isRequired: true,
		},
		new_password: {
			type: 'string',
			isRequired: true,
			maxLength: 40,
			minLength: 8,
		},
	},
} as const

export const $Token = {
	properties: {
		access_token: {
			type: 'string',
			isRequired: true,
		},
		token_type: {
			type: 'string',
			default: 'bearer',
		},
	},
} as const

export const $UpdatePassword = {
	properties: {
		current_password: {
			type: 'string',
			isRequired: true,
			maxLength: 40,
			minLength: 8,
		},
		new_password: {
			type: 'string',
			isRequired: true,
			maxLength: 40,
			minLength: 8,
		},
	},
} as const

export const $User = {
	properties: {
		email: {
			type: 'string',
			isRequired: true,
			format: 'email',
			maxLength: 255,
		},
		is_active: {
			type: 'boolean',
			default: true,
		},
		is_superuser: {
			type: 'boolean',
			default: false,
		},
		full_name: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
		id: {
			type: 'string',
			format: 'uuid',
		},
		hashed_password: {
			type: 'string',
			isRequired: true,
		},
	},
} as const

export const $UserCreate = {
	properties: {
		email: {
			type: 'string',
			isRequired: true,
			format: 'email',
			maxLength: 255,
		},
		is_active: {
			type: 'boolean',
			default: true,
		},
		is_superuser: {
			type: 'boolean',
			default: false,
		},
		full_name: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
		password: {
			type: 'string',
			isRequired: true,
			maxLength: 40,
			minLength: 8,
		},
	},
} as const

export const $UserPublic = {
	properties: {
		email: {
			type: 'string',
			isRequired: true,
			format: 'email',
			maxLength: 255,
		},
		is_active: {
			type: 'boolean',
			default: true,
		},
		is_superuser: {
			type: 'boolean',
			default: false,
		},
		full_name: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
		id: {
			type: 'string',
			isRequired: true,
			format: 'uuid',
		},
	},
} as const

export const $UserRegister = {
	properties: {
		email: {
			type: 'string',
			isRequired: true,
			format: 'email',
			maxLength: 255,
		},
		password: {
			type: 'string',
			isRequired: true,
			maxLength: 40,
			minLength: 8,
		},
		full_name: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
	},
} as const

export const $UserUpdate = {
	properties: {
		email: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					format: 'email',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
		is_active: {
			type: 'boolean',
			default: true,
		},
		is_superuser: {
			type: 'boolean',
			default: false,
		},
		full_name: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
		password: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 40,
					minLength: 8,
				},
				{
					type: 'null',
				},
			],
		},
	},
} as const

export const $UserUpdateMe = {
	properties: {
		full_name: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
		email: {
			type: 'any-of',
			contains: [
				{
					type: 'string',
					format: 'email',
					maxLength: 255,
				},
				{
					type: 'null',
				},
			],
		},
	},
} as const

export const $UsersPublic = {
	properties: {
		data: {
			type: 'array',
			contains: {
				type: 'UserPublic',
			},
			isRequired: true,
		},
		count: {
			type: 'number',
			isRequired: true,
		},
	},
} as const

export const $ValidationError = {
	properties: {
		loc: {
			type: 'array',
			contains: {
				type: 'any-of',
				contains: [
					{
						type: 'string',
					},
					{
						type: 'number',
					},
				],
			},
			isRequired: true,
		},
		msg: {
			type: 'string',
			isRequired: true,
		},
		type: {
			type: 'string',
			isRequired: true,
		},
	},
} as const

export const $WeatherForecastPublic = {
	properties: {
		date: {
			type: 'string',
			isRequired: true,
			format: 'date-time',
		},
		high_temperature: {
			type: 'number',
			isRequired: true,
		},
		low_temperature: {
			type: 'number',
			isRequired: true,
		},
		wind: {
			type: 'string',
			isRequired: true,
		},
		humidity: {
			type: 'number',
			isRequired: true,
			maximum: 100,
			minimum: 0,
		},
		id: {
			type: 'string',
			isRequired: true,
			format: 'uuid',
		},
		city: {
			type: 'MeteorologicalStation',
			isRequired: true,
		},
		user: {
			type: 'any-of',
			contains: [
				{
					type: 'User',
				},
				{
					type: 'null',
				},
			],
			isRequired: true,
		},
	},
} as const

export const $WeatherForecastsPublic = {
	properties: {
		data: {
			type: 'array',
			contains: {
				type: 'WeatherForecastPublic',
			},
			isRequired: true,
		},
		count: {
			type: 'number',
			isRequired: true,
		},
	},
} as const

export const $WeatherHistoryPublic = {
	properties: {
		date: {
			type: 'string',
			isRequired: true,
			format: 'date-time',
		},
		temperature: {
			type: 'number',
			isRequired: true,
		},
		wind: {
			type: 'string',
			isRequired: true,
		},
		humidity: {
			type: 'number',
			isRequired: true,
			maximum: 100,
			minimum: 0,
		},
		id: {
			type: 'string',
			isRequired: true,
			format: 'uuid',
		},
		city: {
			type: 'MeteorologicalStation',
			isRequired: true,
		},
	},
} as const

export const $WeatherHistorysPublic = {
	properties: {
		data: {
			type: 'array',
			contains: {
				type: 'WeatherHistoryPublic',
			},
			isRequired: true,
		},
		count: {
			type: 'number',
			isRequired: true,
		},
	},
} as const
