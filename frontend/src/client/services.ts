import type { CancelablePromise } from "./core/CancelablePromise"
import { OpenAPI } from "./core/OpenAPI"
import { request as __request } from "./core/request"

import type {
  Body_login_login_access_token,
  Message,
  NewPassword,
  Token,
  UserPublic,
  UpdatePassword,
  UserCreate,
  UserRegister,
  UsersPublic,
  UserUpdate,
  UserUpdateMe,
  WeatherForecastCreate,
  WeatherForecastPublic,
  WeatherForecastsPublic,
  MeteorologicalStationsPublic,
  WeatherHistorysPublic,
} from "./models"

export type TDataLoginAccessToken = {
  formData: Body_login_login_access_token
}
export type TDataRecoverPassword = {
  email: string
}
export type TDataResetPassword = {
  requestBody: NewPassword
}
export type TDataRecoverPasswordHtmlContent = {
  email: string
}

export class LoginService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginAccessToken(
    data: TDataLoginAccessToken,
  ): CancelablePromise<Token> {
    const { formData } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/access-token",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static testToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/test-token",
    })
  }

  /**
   * Recover Password
   * Password Recovery
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static recoverPassword(
    data: TDataRecoverPassword,
  ): CancelablePromise<Message> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Reset Password
   * Reset password
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static resetPassword(
    data: TDataResetPassword,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/reset-password/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Recover Password Html Content
   * HTML Content for Password Recovery
   * @returns string Successful Response
   * @throws ApiError
   */
  public static recoverPasswordHtmlContent(
    data: TDataRecoverPasswordHtmlContent,
  ): CancelablePromise<string> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery-html-content/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataReadUsers = {
  limit?: number
  skip?: number
}
export type TDataCreateUser = {
  requestBody: UserCreate
}
export type TDataUpdateUserMe = {
  requestBody: UserUpdateMe
}
export type TDataUpdatePasswordMe = {
  requestBody: UpdatePassword
}
export type TDataRegisterUser = {
  requestBody: UserRegister
}
export type TDataReadUserById = {
  userId: string
}
export type TDataUpdateUser = {
  requestBody: UserUpdate
  userId: string
}
export type TDataDeleteUser = {
  userId: string
}

export class UsersService {
  /**
   * Read Users
   * Retrieve users.
   * @returns UsersPublic Successful Response
   * @throws ApiError
   */
  public static readUsers(
    data: TDataReadUsers = {},
  ): CancelablePromise<UsersPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create User
   * Create new user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static createUser(
    data: TDataCreateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read User Me
   * Get current user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserMe(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/me",
    })
  }

  /**
   * Delete User Me
   * Delete own user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUserMe(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/me",
    })
  }

  /**
   * Update User Me
   * Update own user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUserMe(
    data: TDataUpdateUserMe,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update Password Me
   * Update own password.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static updatePasswordMe(
    data: TDataUpdatePasswordMe,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me/password",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Register User
   * Create new user without the need to be logged in.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static registerUser(
    data: TDataRegisterUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read User By Id
   * Get a specific user by id.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserById(
    data: TDataReadUserById,
  ): CancelablePromise<UserPublic> {
    const { userId } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update User
   * Update a user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUser(
    data: TDataUpdateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody, userId } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete User
   * Delete a user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
    const { userId } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataTestEmail = {
  emailTo: string
}

export class UtilsService {
  /**
   * Test Email
   * Test emails.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static testEmail(data: TDataTestEmail): CancelablePromise<Message> {
    const { emailTo } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/utils/test-email/",
      query: {
        email_to: emailTo,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Health Check
   * @returns boolean Successful Response
   * @throws ApiError
   */
  public static healthCheck(): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/utils/health-check/",
    })
  }
}

export type TDataGetWeatherForecast = {
  cityCode?: string | null
  limit?: number
  skip?: number
}
export type TDataCreateForecast = {
  requestBody: WeatherForecastCreate
}
export type TDataReadForecast = {
  id: string
}
export type TDataUpdateForecast = {
  id: string
  requestBody: WeatherForecastCreate
}
export type TDataDeleteForecast = {
  id: string
}

export class ForecastService {
  /**
   * Get Weather Forecast
   * Get weather forecast for next days in specific city.
   * @returns WeatherForecastsPublic Successful Response
   * @throws ApiError
   */
  public static getWeatherForecast(
    data: TDataGetWeatherForecast = {},
  ): CancelablePromise<WeatherForecastsPublic> {
    const { cityCode, limit = 7, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/forecast/",
      query: {
        city_code: cityCode,
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create Forecast
   * Create new forecast for a day in specific city.
   * @returns WeatherForecastPublic Successful Response
   * @throws ApiError
   */
  public static createForecast(
    data: TDataCreateForecast,
  ): CancelablePromise<WeatherForecastPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/forecast/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read Forecast
   * Get daily weather forecast by ID.
   * @returns WeatherForecastPublic Successful Response
   * @throws ApiError
   */
  public static readForecast(
    data: TDataReadForecast,
  ): CancelablePromise<WeatherForecastPublic> {
    const { id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/forecast/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update Forecast
   * Update a forecast for a day in specific city.
   * @returns WeatherForecastPublic Successful Response
   * @throws ApiError
   */
  public static updateForecast(
    data: TDataUpdateForecast,
  ): CancelablePromise<WeatherForecastPublic> {
    const { id, requestBody } = data
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/forecast/{id}",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete Forecast
   * Delete a weather forecast for a day in city.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteForecast(
    data: TDataDeleteForecast,
  ): CancelablePromise<Message> {
    const { id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/forecast/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export class StationsService {
  /**
   * Get Stations
   * Get all meteorological stations available.
   * @returns MeteorologicalStationsPublic Successful Response
   * @throws ApiError
   */
  public static getStations(): CancelablePromise<MeteorologicalStationsPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/stations/",
    })
  }
}

export type TDataGetWeatherHistory = {
  cityCode?: string | null
  limit?: number
  skip?: number
}

export class HistoryService {
  /**
   * Get Weather History
   * Get weather history for the given city_code or return empty if no match.
   * @returns WeatherHistorysPublic Successful Response
   * @throws ApiError
   */
  public static getWeatherHistory(
    data: TDataGetWeatherHistory = {},
  ): CancelablePromise<WeatherHistorysPublic> {
    const { cityCode, limit = 10, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/history/",
      query: {
        city_code: cityCode,
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export class WsService {
  /**
   * Get
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static get(): CancelablePromise<unknown> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/ws/",
    })
  }
}
