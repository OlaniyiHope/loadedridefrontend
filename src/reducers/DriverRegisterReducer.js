import * as Actions from '../actions/ActionTypes'
const DriverRegisterReducer = (state = { driver_phone_number:undefined, driver_phone_with_code:undefined, driver_country_code:undefined, driver_first_name:undefined, driver_last_name:undefined, driver_email:undefined, driver_licence_number:undefined, driver_date_of_birth:undefined }, action) => {
    switch (action.type) {
        case Actions.UPDATE_DRIVER_PHONE_NUMBER:
            return Object.assign({}, state, {
               driver_phone_number: action.data
            });
        case Actions.UPDATE_DRIVER_PHONE_WITH_CODE:
            return Object.assign({}, state, {
                driver_phone_with_code: action.data
            });
        case Actions.UPDATE_DRIVER_COUNTRY_CODE:
            return Object.assign({}, state, {
                driver_country_code: action.data
            });
        case Actions.UPDATE_DRIVER_FIRST_NAME:
            return Object.assign({}, state, {
                driver_first_name: action.data
            });
        case Actions.UPDATE_DRIVER_LAST_NAME:
            return Object.assign({}, state, {
                driver_last_name: action.data
            });
        case Actions.UPDATE_DRIVER_EMAIL:
            return Object.assign({}, state, {
                driver_email: action.data
            });
        case Actions.UPDATE_DRIVER_LICENCE_NUMBER:
            return Object.assign({}, state, {
                driver_licence_number: action.data
            });
        case Actions.UPDATE_DRIVER_DATE_OF_BIRTH:
            return Object.assign({}, state, {
                driver_date_of_birth: action.data
            });
        default:
            return state;
    }
}

export default DriverRegisterReducer;
