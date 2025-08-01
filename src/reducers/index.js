import { combineReducers } from 'redux';
import CurrentAddressReducer from './CurrentAddressReducer.js';
import BookingReducer from './BookingReducer.js';
import RegisterReducer from './RegisterReducer.js';
import PaymentReducer from './PaymentReducer.js';
import DriverRegisterReducer from './DriverRegisterReducer.js';
import ChangeLocationReducer from './ChangeLocationReducer.js';
import VehicleReducer from './VehicleReducer.js';

const allReducers = combineReducers({
  current_location:CurrentAddressReducer,
  booking:BookingReducer,
  register:RegisterReducer,
  driver_register:DriverRegisterReducer,
  payment:PaymentReducer,
  vehicle:VehicleReducer,
  change_location:ChangeLocationReducer,

});

export default allReducers;