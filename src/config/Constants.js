import { Dimensions } from "react-native";

export const app_name = "Bid4Cab";
export const base_url = "enter_admin_link/";
export const api_url = "enter_admin_link/api/";
export const img_url = "enter_admin_link/public/uploads/";


// customer
export const prefix = "customer/";
export const get_home = prefix+"get_home";
export const get_estimation_fare = prefix+"get_estimation_fare";
export const add_favourite = prefix+"add_favourite";
export const get_about = prefix+"get_about";
export const privacy_policies = prefix+"privacy_policies"; 
export const faq = prefix+"faq"; 
export const app_settings = prefix+"app_settings";
export const check_phone = prefix+"check_phone";
export const login = prefix+"login";
export const register = prefix+"register";
export const forgot_password = prefix+"forgot_password";
export const reset_password = prefix+"reset_password";
export const get_profile = prefix+"get_profile";
export const get_zone = prefix+"get_zone";
export const profile_update = prefix+"profile_update"; 
export const profile_picture_upload = prefix+"profile_picture_upload";
export const profile_picture_update = prefix+"profile_picture_update";
export const sos_contact_list = prefix+"sos_contact_list"; 
export const delete_sos_contact = prefix+"delete_sos_contact"; 
export const add_sos_contact = prefix+"add_sos_contact"; 
export const my_bookings = prefix+"my_bookings"; 
export const trip_details = prefix+"trip_details";
export const ride_confirm = prefix+"ride_confirm"; 
export const get_bill = prefix+"get_bill";
export const get_tips = prefix+"get_tips";
export const add_tip = prefix+"add_tip"; 
export const get_notification_messages = prefix+"get_notification_messages"; 
export const add_rating = prefix+"add_rating";
export const trip_cancel = prefix+"trip_cancel";
export const sos_sms = prefix+"sos_sms"; 
export const add_wallet = prefix+"add_wallet";
export const payment_methods = prefix+"payment_methods";
export const wallet = prefix+"get_wallet";
export const complaint_categories = prefix+"get_complaint_category";
export const complaint_sub_categories = prefix+"get_complaint_sub_category";
export const add_complaint = prefix+"add_complaint"; 
export const promo_codes = prefix+"promo_codes";
export const trip_request_cancel = prefix+"trip_request_cancel";
export const ongoing_trip_requests = prefix+"ongoing_trip_requests";
export const get_bids = prefix+"get_bids";
export const customer_accept = prefix+"accept"; 
export const customer_get_documents = prefix+"get_documents"; 
export const get_sos_list = prefix+"get_sos_list";
export const get_referral_message= prefix+"get_referral_message";
export const delete_account_request = prefix+"delete_account";
// Driver


//Header configuration for animated view
export const maxHeaderHeight = 200;
export const minHeaderHeight = 60;

//Size
export const screenHeight = Math.round(Dimensions.get("window").height);
export const screenWidth = Math.round(Dimensions.get("window").width);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);
 
//Map 
export const GOOGLE_KEY = "enter_map_key";
export const FLUTTERWAVE_KEY = "enter_flutterwave_key";

export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA = 0.0152;
export const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

//Image Path
export const logo = require(".././assets/img/logo.png");
export const money_icon = require(".././assets/img/money.png");
export const discount_icon = require(".././assets/img/discount.png");
export const check_icon = require(".././assets/img/check.png");
export const money_receive_icon = require(".././assets/img/money_receive.png");
export const money_send_icon = require(".././assets/img/money_send.png");
export const success_icon = require(".././assets/img/success.png");
export const cancel = require(".././assets/img/cancel.png");
export const notification_bell = require(".././assets/img/notification-bell.png");
export const add_contact = require(".././assets/img/add_contact.png");
export const chat_bg = require(".././assets/img/chat_bg.png");
export const income_icon = require(".././assets/img/income.png");
export const expense_icon = require(".././assets/img/expense.png");
export const welcome = require(".././assets/img/welcome.png");
export const customer = require(".././assets/img/customer.png");
export const upload_icon = require('.././assets/img/upload_icon.png');
export const trip_cancel_icon = require('.././assets/img/trip_cancel_icon.png');
export const bg_img = require(".././assets/img/BG.png");
export const left_arrow = require(".././assets/img/left-arrow.png");
export const right_arrow = require(".././assets/img/right-arrow.png");
export const distance_icon = require(".././assets/img/distance.png");
export const withdrawal_icon = require(".././assets/img/withdrawal.png");
export const wallet_icon = require(".././assets/img/wallet.png");
export const no_data = require(".././assets/img/no_data.png");
export const customer_mode_img = require(".././assets/img/customer_mode_img.png");
export const driver_mode_img = require(".././assets/img/driver_mode_img.png");
export const app_mode_img = require(".././assets/img/app_mode_img.png");
export const driver_mode = require(".././assets/img/driver_mode.png");
export const passenger_mode = require(".././assets/img/passenger_mode.png");

//customer document image
export const id_card_with_pic = require(".././assets/img/id_card_with_pic.png");
export const selfie_icon = require(".././assets/img/selfie_icon.png");
export const id_proof_icon = require(".././assets/img/identity_card.png");
export const verification = require(".././assets/img/verification.png");

//Emergency contact image
export const call_admin = require(".././assets/img/call_admin.png");
export const call_ambulance = require(".././assets/img/call_ambulance.png");
export const call_police = require(".././assets/img/call_police.png");

//driver document image path
export const additional_document_img = require(".././assets/img/driver_document/additional_document.png");
export const car_back_view_img = require(".././assets/img/driver_document/car_back_view.png");
export const car_front_view_img = require(".././assets/img/driver_document/car_front_view.png");
export const car_grand_document_img = require(".././assets/img/driver_document/car_grant.png");
export const e_hailing_insurance_img = require(".././assets/img/driver_document/car_insurance.png");
export const car_left_side_view_img = require(".././assets/img/driver_document/car_left_side_view.png");
export const car_right_side_view_img = require(".././assets/img/driver_document/car_right_side_view.png");
export const driver_license_img = require(".././assets/img/driver_document/driving_license.png");
export const driver_id_img = require(".././assets/img/driver_document/identity_card.png");
export const road_tax_img = require(".././assets/img/driver_document/road_tax.png");
export const vocational_license_img = require(".././assets/img/driver_document/vocational_license.png");
export const covernote_img = require(".././assets/img/driver_document/cover_note_img.png");
export const upload_pdf = require(".././assets/img/driver_document/pdf.png");
export const pdf_success = require(".././assets/img/driver_document/pdf_success.png");

//json path
export const profile_background = require(".././assets/json/profile_background.json");
export const pin_marker = require(".././assets/json/pin_marker.json");
export const no_favourites = require(".././assets/json/no_favorites.json");
export const sos = require(".././assets/json/sos.json"); 
export const btn_loader = require(".././assets/json/btn_loader.json");
export const search_loader = require(".././assets/json/search.json"); 
export const location_enable = require(".././assets/json/location_enable.json"); 
export const loader = require(".././assets/json/loader.json");
export const no_data_loader = require(".././assets/json/no_data_loader.json");
export const app_update = require(".././assets/json/app_update.json");
export const refer = require(".././assets/json/refer.json"); 
export const share = require(".././assets/json/share.json"); 
export const no_internet = require(".././assets/json/no_internet.json"); 

//Font Family
export const regular="Poppins-Regular"
// export const regular = "GoogleSans-Regular";
export const normal = "Montreal-Regular";
export const bold = "Montreal-Bold";

//Font Sized
export const f_tiny = 8;
export const f_xs = 10;
export const f_s = 14;
export const f_m = 16;
export const f_l = 18;
export const f_xl = 20;
export const f_xxl = 22;
export const f_25 = 25;
export const f_30 = 30;
export const f_40 = 40;

export const month_names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//More Menu
export const menus = [
    {
      menu_name: 'KYC Verification',
      icon: 'files-o',
      route:'KycVerification'
    },
    {
      menu_name: 'Training',
      icon: 'user',
      route:'Training'
    },
    {
      menu_name: 'Frequently Asked Questions',
      icon: 'question-circle-o',
      route:'DriverFaq'
    },
    {
      menu_name: 'Earnings',
      icon: 'dollar',
      route:'DriverEarnings'
    },
    {
      menu_name: 'Withdrawals', 
      icon: 'credit-card',
      route:'Withdrawal'
    },
     {
      menu_name: 'Wallet Transactions',
      icon: 'money',
      route:'DriverWallet'
    },
    {
      menu_name: 'Notifications',
      icon: 'bell',
      route:'DriverNotifications'
    },
    {
      menu_name: 'About Us',
      icon: 'building-o',
      route:'DriverAboutUs'
    },
    {
      menu_name: 'Logout',
      icon: 'sign-out',
      route:'DriverLogout'
    },
  ]