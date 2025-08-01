import * as ActionTypes from './ActionTypes';

export const updateDriverPhoneNumber = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_PHONE_NUMBER,
    data: data
})

export const updateDriverPhoneWithCode = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_PHONE_WITH_CODE,
    data: data
})

export const updateDriverCountryCode = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_COUNTRY_CODE,
    data: data
})

export const updateDriverFirstName = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_FIRST_NAME,
    data: data
})

export const updateDriverLastName = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_LAST_NAME,
    data: data
})

export const updateDriverEmail = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_EMAIL,
    data: data
})

export const updateDriverLicenceNumber = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_LICENCE_NUMBER,
    data: data
})

export const updateDriverDateOfBirth = (data) => ({
    type: ActionTypes.UPDATE_DRIVER_DATE_OF_BIRTH,
    data: data
})