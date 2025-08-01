import * as ActionTypes from './ActionTypes';

export const paypalPaymentStatus = (data) => ({
    type: ActionTypes.PAYPAL_PAYMENT_STATUS,
    data: data
})

export const stripePaymentStatus = (data) => ({
    type: ActionTypes.STRIPE_PAYMENT_STATUS,
    data: data
})