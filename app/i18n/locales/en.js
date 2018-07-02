import { Platform } from "react-native";
export default {
  //units
  litre: "Litre",
  litre_symbol: "L",
  millilitre: "Millilitre",
  millilitre_symbol: "ml",
  kilogram: "Kilogram",
  kilogram_symbol: "Kg",
  gram: "Gram",
  gram_symbol: "g",
  unit: "Unit",
  unit_symbol: "unit",
  dozen: "Dozen",
  dozen_symbol: "dz",

  //common words
  other: "Other",
  upload_product_image: "Upload Product Image",
  add_product_image: "Add Product Image",
  add_product_review: "Add Product Review",
  add_your_name: "Add Your Name",
  uploading: "Uploading...",
  product_image_updated: "Product Image Updated",
  share: "Share",
  share_card: "Share Review",
  review: "Review",
  max_chars: "Max {{count}} characters",
  i_will_do_it_later: "I'll do it later",

  //app intro screen
  app_intro_1_title: `Smart & 100% secure way of saving your Bills, Important Documents and Expenses in a Digital Format`,
  app_intro_1_desc: `Create Your Product Card in less Than 10 Seconds and Start Receiving Alerts for Warranty, Service, Insurance and even PUC.`,
  app_intro_2_title: `Keep Track of Brand Warranty, Repair Warranty, Insurance & AMC Renewal through Timely Reminders`,
  app_intro_2_desc: `Create product card and reach out to Brands, Insurance Providers or Nearest Service Center with just One Touch.`,
  app_intro_3_title: `Select Accessories for your Home Appliances, Car, Bike, Mobile & Gadgets and Amazing Offers across products.`,
  app_intro_3_desc: `Know the Life Cycle Cost of All Your Products. Based on this You Can Decide Whether to Continue Maintaining the Product or Replacing it.`,
  app_intro_4_title: `Be The Product Review Expert. Help Your Friends, Family and Followers make a wise purchase decision`,
  app_intro_4_desc: `You Can Capture and Track All Expenses Across Categories Such As Household and Utility, Travel, Dining, Healthcare and More.`,
  app_intro_next: "NEXT",
  app_intro_skip: "SKIP",
  app_intro_start: "Let's Get Started ",

  //login screen
  login_screen_title: "Get Started",
  login_screen_input_placeholder: "Enter Mobile Number",
  login_screen_btn_text: "SEND OTP",
  login_screen_or_text: "OR INSTANT SIGN IN WITH",
  login_screen_no_otp_required_text: "No OTP Required",
  login_screen_invalid_number_error: "Please enter 10 digit mobile number",
  login_screen_terms_of_use:
    "By signing up you agree to our Terms & Conditions and Privacy Policy",
  login_screen_read_them_here: "Read them here",

  //verify screen
  verify_screen_title: "Verify",
  verify_screen_invalid_otp_error:
    "Please enter 4 digit OTP you received on your phone",
  verify_screen_enter_otp_msg:
    "Please enter the OTP we’ve sent to {{phoneNumber}}",
  verify_screen_btn_text: "Submit",

  //add products screen
  add_products_screen_title: "Add Products",
  add_products_screen_skip: "SKIP",
  add_products_screen_finish_msg_no_product: "Want to add some other product?",
  add_products_screen_finish_msg_one_product:
    "{{productName}} added to your eHome",
  add_products_screen_finish_msg_multiple_products:
    "All your products added to your eHome",
  add_products_screen_finish_btn_no_product: "YES",
  add_products_screen_finish_btn_one_product: "ADD MORE PRODUCTS",
  add_products_screen_finish_btn_multiple_products: "ADD MORE PRODUCTS",
  add_products_screen_finish_do_it_later: "I'll Do it Later",
  add_products_screen_slide_mobile: "Now let’s add your Mobile to Your eHome",
  add_products_screen_slide_car: "Gotta a Car! Why not add it to Your eHome",
  add_products_screen_slide_bike:
    "If you have a bike too, add it to Your eHome",
  add_products_screen_slide_fridge:
    "Do you like it so far, let’s add more products : Fridge",
  add_products_screen_slide_television:
    "Do you like it so far, let’s add more products : Television",
  add_products_screen_slide_washing_machine:
    "Do you like it so far, let’s add more products : Washing Machine",
  add_products_screen_slide_detect_device: "DETECT THIS DEVICE",
  add_products_screen_slide_select_brand: "Select a brand",
  add_products_screen_slide_enter_brand: "Enter your brand",
  add_products_screen_slide_select_model: "Select Model Name",
  add_products_screen_slide_enter_model: "Enter your model",
  add_products_screen_slide_upload_bill: "Upload Bill (Optional)",
  add_products_screen_slide_bill_uploaded: "Bill Uploaded",
  add_products_screen_slide_add_product_btn: "Add Product",
  add_products_screen_slide_add_mobile_eHome:
    "Now let’s add your Mobile to Your eHome",
  add_products_screen_slide_add_brand_name: "Please select or enter brand name",
  add_products_screen_slide_add_model_name: "Please select or enter model name",
  add_products_screen_slide_add_brand_first: "Please select brand first",

  //add product screen
  add_product_screen_title: "Add Product",
  add_product_screen_cancel: "CANCEL",
  add_product_screen_alert_select_main_category:
    "Please select expense category",
  add_product_screen_alert_select_expense: "Please select expense type",
  add_product_screen_alert_select_product: "Please select product type",
  add_product_screen_alert_select_purchase_date:
    "Please select the purchase (closest to purchase) date to activate warranty alerts and expense insights.",
  add_product_screen_purchase_date_hint:
    "Purchase date helps in activating warranty alerts as well as expense insights.",
  add_product_screen_placeholder_main_category: "Select Expense Category",
  add_product_screen_placeholder_expense_type: "Select Expense Type",
  add_product_screen_placeholder_product_type: "Select Product Type",
  add_product_screen_placeholder_amount: "Amount (optional)",
  add_product_screen_placeholder: "Product Name (optional)",
  add_product_screen_placeholder_purchase_date: "Purchase date",
  add_product_screen_placeholder_upload_bill: "Upload Bill (Optional)",
  add_product_screen_add_product_btn: "Add Product",
  add_product_screen_finish_msg:
    "Product added to your eHome under {{mainCategoryName}}",
  add_product_screen_finish_btn: "ADD MORE PRODUCTS",
  add_product_screen_finish_do_it_later: "I'll Do it Later",

  //ASC search screen
  asc_search_screen_title: "Search Results for {{brandAndCategory}}",
  asc_search_screen_no_results_title: "No nearby Service centers",
  asc_search_screen_no_results_desc:
    "Currently there are no Servie centers near you",
  asc_search_screen_phone_not_available: "No Phone no available for the center",
  asc_search_screen_directions: "Directions",
  asc_search_screen_call: "Call",

  //bill copy popup screen
  bill_copy_popup_screen_downloading_file: "Downloading.. please wait..",
  bill_copy_popup_screen_downloaded_image_ios:
    "Image downloaded, check 'Photos' app!",
  bill_copy_popup_screen_downloaded_image_android:
    "Image downloaded, check 'Gallery'!",
  bill_copy_popup_screen_download_error: "Some error occurred in downloading!",
  bill_copy_popup_screen_downloading_file_to_share:
    "Downloading file to share.. please wait..",
  bill_copy_popup_screen_no_data_available: " Data not available",

  //docs under processing screen
  docs_under_processing_screen_title: "Docs Under Processing",
  docs_under_processing_screen_no_result_title: "No Documents Found",
  docs_under_processing_screen_no_result_desc:
    "Documents or bills recently uploaded by you will appear under this section",

  //insights screen
  insights_screen_title: "Insights & Trends",
  insights_screen_filter_last_7_days: "Last 7 Days",
  insights_screen_filter_current_month: "Current Month",
  insights_screen_filter_current_year: "Current Year",
  insights_screen_filter_overall: "Lifetime",
  insights_screen_filter_options_title: "See insights of",
  insights_screen_filter_close: "Cancel",
  insights_screen_total_tax_paid: "GST Paid",
  insights_screen_tax_see_details: "See details",
  insights_screen_section_heading_expenses: "EXPENSES",
  insights_screen_total_spends: "Total Spend",

  //mailbox screen
  mailbox_screen_title: "Mailbox",
  mailbox_screen_no_result_title: "No Action Here",
  mailbox_screen_no_result_desc:
    "We will start sending important messages as soon as the action starts",

  //main category screen
  main_category_screen_filters_title: "Filters",
  main_category_screen_filters_cancel: "Cancel",
  main_category_screen_filters_apply: "Apply",
  main_category_screen_filters_title_categories: "Type",
  main_category_screen_filters_title_brands: "Brand",
  main_category_screen_filters_title_sellers: "Sellers",

  //products list
  products_list_no_result_title: "No Documents Found",
  products_list_no_result_desc_furniture:
    "Looks like you have no products added in Furniture Section",
  products_list_no_result_desc_hardware:
    "Looks like you have no products added in Hardware Section",
  products_list_no_result_desc_kitchen_utensils:
    "Looks like you have no products added in Kitchen Utensils Section",
  products_list_no_result_desc_other_furniture:
    "Looks like you have no products added in Other Furniture Section",
  products_list_no_result_desc_electronics:
    "Looks like you have no products added in Electronics & Electricals Section",
  products_list_no_result_desc_automobile:
    "Looks like you have nothing added in Automobile Section",
  products_list_no_result_desc_travel:
    "Looks like you have no Expenses added in Travel Section",
  products_list_no_result_desc_hotel_stay:
    "Looks like you have no Expenses added in Hotel Stay Section",
  products_list_no_result_desc_dining:
    "Looks like you have no Expenses added in Dining Section",
  products_list_no_result_desc_expense:
    "Looks like you have nothing added in Medical expense section",
  products_list_no_result_desc_medical_docs:
    "Add your Prescriptions, Test reports and other Medical reports here",
  products_list_no_result_desc_insurance:
    "Add your Life insurance, Health insurance and other Medical insurance documents here",
  products_list_no_result_desc_beauty_salon:
    "Looks like you have no Expenses added in Beauty & Salon Section",
  products_list_no_result_desc_other_services:
    "Looks like you have no Expenses added in Other Services Section",
  products_list_no_result_desc_beauty_and_salon:
    "Looks like you have no Expenses added in Beauty & Salon Section",
  products_list_no_result_desc_lessons:
    "Looks like you have no expenses added in Lessons & Hobbies section",
  products_list_no_result_desc_fashion:
    "Looks like you have no expenses added in Fashion Section",
  products_list_no_result_desc_household_expense:
    "Add your Household expenses like grocery, vegetables, maid, stationery, newspaper etc",
  products_list_no_result_desc_utility_bills:
    "Add your Utility expenses like phone, electricity, water, gas and maintenance",
  products_list_no_result_desc_education:
    "Looks like you have no expense added in Education section",
  products_list_no_result_desc_home_decor:
    "Looks like you have no expense added in Home Decor section",
  products_list_no_result_desc_other_household:
    "Looks like you have no expense added in Other Household section",
  products_list_no_result_desc_others:
    "Any other document will appear under this section after you upload it",
  products_list_no_result_desc_personal:
    "Add your personal documents like Educational certificates here",
  products_list_no_result_desc_visiting_card: "Add your Visitng cards here",
  products_list_no_result_desc_rent_agreement: "Add your Rent agreement here",
  product_list_click_below: "Click below to",

  // add list button
  add_fashion_expense: "ADD FASHION EXPENSE",
  add_electronics: "ADD ELECTRONICS & ELECTRICALS",
  add_automobile: "ADD AUTOMOBILE",
  add_personal: "ADD PERSONAL DOC",
  add_rent_agreement: "ADD RENT AGREEMENT",
  add_visiting_card: "ADD VISITING CARD",
  add_furniture: "ADD FURNITURE",
  add_kitchen_utensils: "ADD KITCHEN UTENSILS",
  add_hardware: "ADD HARDWARE",
  add_furniture_hardware: "ADD FURNITURE & HARDWARE",
  add_travel: "ADD TRAVEL",
  add_dining: "ADD DINING",
  add_hotel_stay: "ADD HOTEL STAY",
  add_expense: "ADD EXPENSE",
  add_other_services: "ADD OTHER SERVICES",
  add_beauty_and_salon: "ADD BEAUTY & SALON",
  add_lessons_hobbies: "ADD LESSIONS & HOBBIES",
  add_household_expense: "ADD HOUSEHOLD EXPENSE",
  add_utility_bills: "ADD UTILITY BILLS",
  add_education: "ADD EDUCATION BILLS",
  add_home_decor: "ADD HOME DECOR",
  add_other_household: "ADD OTHER HOUSEHOLD",
  add_medical_doc: "ADD MEDICAL DOC",
  add_healthcare: "ADD HEALTHCARE",
  add_insurance: "ADD INSURANCE",
  add_others: "ADD OTHERS",

  //more screen
  more_screen_item_faq: "FAQs",
  more_screen_item_tips: "Tips to Build Your eHome ",
  more_screen_item_call: "Call Us",
  more_screen_item_email: "Email Us",
  more_screen_item_share: "Share App",
  more_screen_item_app_version: "App Version",
  more_screen_item_app_language_change: "Change Language",
  more_screen_item_app_search_authorized: "Search Authorized Service Center",
  more_screen_item_app_version_update_to: "Update Now",
  more_screen_item_logout: "Logout",
  more_screen_logout: "Yes, Logout",
  more_screen_stay: "No, Stay",
  more_screen_no_update_available: "No update available",

  //product details screen
  product_details_screen_title: "Product Card",
  product_details_screen_view_bill_btn: "VIEW BILL",
  product_details_screen_upload_bill_btn: "UPLOAD BILL",
  product_details_screen_no_bill_msg: "*Product bill not added",
  product_details_screen_total_text: "Total",
  product_details_screen_cost_breakdown_product: "Product Cost",
  product_details_screen_cost_breakdown_warranty: "Warranty",
  product_details_screen_cost_breakdown_insurance: "Insurance",
  product_details_screen_cost_breakdown_repairs: "Repairs",
  product_details_screen_cost_breakdown_amc: "AMC",
  product_details_screen_cost_breakdown_total: "Total",
  product_details_screen_cost_breakdown_close: "Close",
  product_details_screen_after_sale_btn: "CUSTOMER CARE",
  product_details_screen_after_sale_options_title: "Choose an option",
  product_details_screen_after_sale_options_email: "Email Manufacturer",
  product_details_screen_after_sale_options_call: "Call Manufacturer",
  product_details_screen_after_sale_options_service: "Service Request/Repair",
  product_details_screen_after_sale_options_asc:
    "Nearest Authorised Service center",
  product_details_screen_after_sale_options_cancel: "Cancel",
  product_details_screen_main_category: "Main Category",
  product_details_screen_category: "Category",
  product_details_screen_sub_category: "Sub-Category",
  product_details_screen_brand: "Brand",
  product_details_screen_model: "Model",
  product_details_screen_date_of_purchase: "Date of Purchase",
  product_details_screen_seller_no_info: "Seller info not available",
  product_details_screen_seller_category: "Seller Category",
  product_details_screen_seller_name: "Seller Name",
  product_details_screen_seller_location: "Location",
  product_details_screen_seller_contact: "Contact No.",
  product_details_screen_seller_address: "Address",
  product_details_screen_seller_find_store: "FIND STORE",
  product_details_screen_warranty_title: "Warranty",
  product_details_screen_dual_warranty_title:
    "{{dualWarrantyItem}} Warranty Details",
  product_details_screen_extended_warranty_title:
    "Third Party Warranty Details",
  product_details_screen_warranty_expiry: "Expiry Date",
  product_details_screen_warranty_type: "Warranty Type",
  product_details_screen_warranty_provider: "Provider",
  product_details_screen_warranty_amount: "Amount",
  product_details_screen_warranty_seller: "Seller",
  product_details_screen_warranty_seller_contact: "Seller Contact",
  product_details_screen_warranty_no_info: "Details Not Available!",
  product_details_screen_insurance_title: "Insurance",
  product_details_screen_insurance_type: "Type",
  product_details_screen_insurance_provider: "Provider",
  product_details_screen_insurance_expiry: "Expiry Date",
  product_details_screen_insurance_policy_no: "Policy No.",
  product_details_screen_insurance_premium_amount: "Premium Amount",
  product_details_screen_insurance_amount_insured: "Total Coverage",
  product_details_screen_insurance_seller: "Seller",
  product_details_screen_insurance_seller_contact: "Seller Contact",
  product_details_screen_insurance_no_info: "Details Not Available!",
  product_details_screen_amc_title: "AMC",
  product_details_screen_amc_expiry: "Expiry Date",
  product_details_screen_amc_policy_no: "Policy No.",
  product_details_screen_amc_premium_amount: "Premium Amount",
  product_details_screen_amc_amount_insured: "Total Coverage",
  product_details_screen_amc_seller: "Seller",
  product_details_screen_amc_seller_contact: "Seller Contact",
  product_details_screen_amc_no_info: "Details Not Available!",
  product_details_screen_repairs_title: "Repair/Service",
  product_details_screen_repairs_repair_date: "Repair Date",
  product_details_screen_repairs_amount: "Repair Amount",
  product_details_screen_repairs_for: "Repair Details",
  product_details_screen_repairs_warranty_upto: "Warranty up to",
  product_details_screen_repairs_seller: "Seller",
  product_details_screen_repairs_seller_contact: "Seller Contact",
  product_details_screen_repairs_no_info: "Details Not Available!",
  product_details_screen_puc_title: "PUC",
  product_details_screen_service_schedule_title: "Service Schedule",
  product_details_screen_puc_effective_date: "Effective Date",
  product_details_screen_puc_expiry_date: "Expiry Date",
  product_details_screen_puc_seller: "Seller",
  product_details_screen_puc_seller_contact: "Seller Contact",
  product_details_screen_puc_no_info: "Details Not Available!",
  product_details_screen_edit: "EDIT",
  product_details_screen_add_insurance: "+ ADD INSURANCE",
  product_details_screen_add_puc: "+ ADD PUC",
  product_details_screen_add_repair: "+ ADD REPAIR",
  product_details_screen_ok: "OK",
  product_details_screen_view_doc: "View Doc",
  product_details_screen_add_warranty: "+ ADD WARRANTY",
  product_details_screen_add_manufacturer: "Contact Manufacturer",
  product_details_screen_add_insurance_provider: "Contact Insurance Provider",
  product_details_screen_add_warranty_provider: "Contact Warranty Provider",
  product_details_screen_add_nearest_authorized:
    "Nearest Authorised Service center",
  product_details_screen_add_customer_care:
    "Customer care is available for brand/manufacturer, insurance and third party warranty providers only.",
  product_details_screen_add_brand_not_available:
    "Product brand not available. Please upload your bill if you haven't",
  product_details_screen_open_email: "Can't open this email",
  product_details_screen_cancel: "Cancel",
  product_details_screen_review_product: "Rate your Experience",
  product_details_screen_write_feedback: "Write your feedback…",
  product_details_screen_submit: "Submit",
  product_details_screen_your_review: "YOUR REVIEW",
  product_details_screen_edits: "Edit",
  product_details_screen_yes_delete: "Yes, delete",
  product_details_screen_no_dnt_delete: "No, don't Delete",
  product_details_screen_docs: "Doc",
  product_details_screen_general_info: "General Info",
  product_details_screen_important: "IMPORTANT INFO",
  product_details_screen_sellers: "SELLER",
  product_details_screen_gen_info: "GENERAL INFO",
  product_details_screen_review_added: "Review Added",
  product_details_screen_seller_details: "Seller Details",
  product_details_screen_your_experience: "HOW WAS YOUR EXPERIENCE",
  product_details_screen_your_upload: "Upload",
  product_details_screen_your_general_details: "General Details",
  product_details_screen_edit_text: "EDIT",
  //new
  product_details_screen_tab_customer_care: "CUSTOMER CARE",
  product_details_screen_tab_all_info: "PRODUCT LIFE CYCLE",
  product_details_screen_tab_important: "IMPORTANT INFO",
  product_details_screen_connect_brand_connect: "Connect with Brand",
  product_details_screen_connect_insurance_provider:
    "Connect with Insurance Provider",
  product_details_screen_connect_warranty_provider: "WARRANTY PROVIDER",
  product_details_screen_connect_numbers: "Customer Care Numbers",
  product_details_screen_connect_links: "Request Service",
  product_details_screen_brand_portal: "Brand Portal",
  product_details_screen_connect_emails: "Email ID",
  product_details_screen_asc_title: "NEAREST AUTHORISED SERVICE CENTRE",
  product_details_screen_asc_select_location: "Select your location",
  product_details_screen_asc_no_results: "No nearby Service centers ",
  product_details_screen_asc_directions: "Directions",
  product_details_screen_general_details: "General Details",
  product_details_screen_seller_details: "Seller Details",
  product_details_screen_edit: "EDIT",
  product_details_screen_service_schedule_title: "Service Schedule",
  product_details_screen_service_manufacturer_warranty: "Manufacturer Warranty",
  product_details_screen_service_third_party_warranty:
    "Third Party Extended Warranty",
  product_details_screen_warranty_expiry_date: "Expiry Date",
  product_details_screen_add_warranty: "Add Warranty",
  product_details_screen_add_extended_warranty: "Add Extended Warranty",
  product_details_screen_insurance_details: "Details",
  product_details_screen_add_insurance: "Add Insurance",
  product_details_screen_amc_details: "Details",
  product_details_screen_add_amc: "Add AMC",
  product_details_screen_repair_details: "Details",
  product_details_screen_add_repair: "Add Repair",
  product_details_screen_puc_details: "Details",
  product_details_screen_add_puc: "Add PUC",

  //profile screen
  profile_screen_label_name: "Name",
  profile_screen_label_phone: "Phone Number",
  profile_screen_label_email: "Email",
  profile_screen_label_address: "Address",
  profile_screen_save_btn: "Save & Update",
  profile_screen_change_msg_name: "Your profile details are updated!",
  profile_screen_change_msg_email: "Your profile details are updated!",
  profile_screen_change_msg_resend_email: "Verification email sent!!",
  profile_screen_change_msg_address: "Your profile details are updated!",
  profile_screen_email_verified: "Verified",
  profile_screen_email_not_verified: "Not Verified",
  profile_screen_please_wait: "uploading, please wait..",
  profile_screen_details_updated: "Your profile details are updated!",
  profile_screen_details_upload_pic: "Upload Profile Pic",
  profile_screen_details_changing_name: "changing name.. please wait..",
  profile_screen_details_changing_email: "changing email.. please wait..",
  profile_screen_details_changing_address: "changing address.. please wait..",
  profile_screen_details_please_wait: "please wait..",
  profile_screen_details_email_verification: "Email Verification",
  profile_screen_details_sent_verification:
    "Please check your email inbox for the verification link we've sent.",
  profile_screen_details_dismiss: "Dismiss",

  //upload document screen
  upload_document_screen_title: "Review & Upload",
  upload_document_screen_upload_success_msg: "Docs uploaded successfully",
  upload_document_screen_no_document_msg: "No Document to upload",
  upload_document_screen_select_document_btn: "Select Document",
  upload_document_screen_upload_btn: "UPLOAD DOC",
  upload_document_screen_upload_options_title: "Upload Doc",
  upload_document_screen_upload_options_camera: "Take picture using camera",
  upload_document_screen_upload_options_gallery: "Upload image from gallery",
  upload_document_screen_upload_options_document: "Upload document",
  upload_document_screen_upload_options_cancel: "Cancel",
  upload_document_screen_uploading_msg: "Uploading... Please Wait..",
  upload_document_screen_success_title: "Bill Submitted",
  upload_document_screen_success_msg:
    "Our experts are now creating the Product Card from the bill linking information such as seller and brand details with their customer care numbers, email ids, warranty and insurance information. We will notify you as soon as your Product Card is created and stored securely under Your eHome.",
  upload_document_screen_success_ok: "OK",

  //ASC screen
  asc_screen_title: "Authorised Service Centres",
  asc_screen_section_1_title: "Search Authorised Service Centre (ASC)",
  asc_screen_section_2_title: "Or search ASC for a Brand",
  asc_screen_section_no_products_msg: "No Products Added",
  asc_screen_section_add_product_btn: "ADD PRODUCT",
  asc_screen_placeholder_select_brand: "Select a Brand",
  asc_screen_placeholder_select_category: "Select a Product",
  asc_screen_placeholder_select_location: "Select Location",
  asc_screen_placeholder_search_btn: "SEARCH NEAREST",
  asc_screen_select_brand_first: "Please select brand first",
  asc_screen_select_fields_first: "Please select brand and product",
  asc_screen_select_location: "Please select location",

  //Do You Know screen
  do_you_know_screen_title: "Do You Know",
  do_you_know_screen_end_msg: "You have reached the end. Staye tuned for more.",
  do_you_know_screen_tags_search_placeholder: "Search...",
  do_you_know_screen_tags_search_cta: "Search",

  //Dashboard Screen
  dashboard_screen_title: "Dashboard",
  dashboard_screen_whats_coming_up: "What's Due",
  dashboard_screen_recent_activity: "Recent Activity",
  dashboard_screen_recent_attendance: "Recent Attendance",
  dashboard_screen_ehome_insights: "Expense Insight",
  dashboard_screen_chart_last_7_days: "Last 7 Days",
  dashboard_screen_total_spends: "Total Spends",
  dashboard_screen_total_items_added: "Total Items added",
  dashboard_screen_last_updated_on: "Last updated on {{date}}",
  dashboard_screen_this_month: "This Month",
  dashboard_screen_see_details: "See Details",

  //eHome Screen
  ehome_screen_title: "eHome",
  ehome_screen_processing_docs: "Processing Docs",
  ehome_screen_items_pending_count: "{{pendingDocsCount}} item(s) pending",
  ehome_screen_items_category_item_count: "{{count}} items",
  ehome_screen_items_category_item_last_updated: "LAST UPDATED {{date}}",

  //my calendar screen
  my_calendar: "Recent Attendance",
  my_calendar_screen_title: "Attendance Manager",
  my_calendar_screen_add_btn: "Add Service",
  my_calendar_screen_empty_screen_msg:
    "Track and manage attendance & payouts for all your household services like your maid, milkman and newspaper wala.",
  my_calendar_screen_total_days: "Total Days",
  my_calendar_screen_till_date: "Till {{date}}",
  my_calendar_screen_days_present: "Days Present",
  my_calendar_screen_days_absent: "Days Absent",
  my_calendar_screen_days: {
    one: "{{count}} day",
    other: "{{count}} days",
    zero: "{{count}} day"
  },
  my_calendar_screen_summary: "Summary",
  my_calendar_screen_from: "From",
  my_calendar_screen_to: "To",
  my_calendar_screen_no_of_units: "No. of Units",
  my_calendar_screen_payment_type: "Payment Type",

  //add/edit calendar service screen
  add_edit_calendar_service_screen_title: "Add Attendance",
  add_edit_calendar_service_screen_title_slider:
    "Select service type for attendance",
  add_edit_calendar_service_screen_form_name: "Name",
  add_edit_calendar_service_screen_form_provider_name: "Provider Name",
  add_edit_calendar_service_screen_form_wages_type: "Wages Type",
  add_edit_calendar_service_screen_form_fees_type: "Fees Type",
  add_edit_calendar_service_screen_form_wages: "Current Wage",
  add_edit_calendar_service_screen_form_fees: "Current Fee",
  add_edit_calendar_service_screen_form_rental: "Current Rental",
  add_edit_calendar_service_screen_form_rental_type: "Rental Type",
  add_edit_calendar_service_screen_form_starting_date: "Starting from Date",
  add_edit_calendar_service_screen_form_end_date: "End Date",

  //calendar service card screen
  calendar_service_screen_title: "Service Details",
  calendar_service_screen_present: "Present",
  calendar_service_screen_total_present: "Total Present",
  calendar_service_screen_absent: "Absent",
  calendar_service_screen_total_absent: "Total Absent",
  calendar_service_screen_price: "Price",
  calendar_service_screen_total_calculated_amount: "Total Amount",
  calendar_service_screen_total_paid_amount: "Total Paid",
  calendar_service_screen_unit_price_avg: "Current Unit Price",
  calendar_service_screen_unit_price: "Unit Price ",
  calendar_service_screen_quantity: "Quantity",
  calendar_service_screen_attendance: "Attendance",
  calendar_service_screen_payments: "Payments",
  calendar_service_screen_other_details: "Other Details",
  calendar_service_screen_total_amount: "Total Amount",
  calendar_service_screen_add_payment_record: "Add Payment Record",
  calendar_service_screen_save: "Save",
  calendar_service_screen_change: "Change",
  calendar_service_screen_payment_details: "Payment Details",
  calendar_service_screen_paid_on: "Paid On",
  calendar_service_screen_amount_paid: "Amount Paid",
  calendar_service_screen_item_details: "Item Details",
  calendar_service_screen_product_name: "Product Name",
  calendar_service_screen_provider_name: "Provider Name",
  calendar_service_screen_provider_number: "Provider Number",
  calendar_service_screen_service_number: "Service Number",
  //FAQs screen
  faq_screen_title: "FAQs",

  //search screen
  search_screen_placeholder: "Search...",
  search_screen_recent_searches: "RECENT SEARCHES",

  //tips screen
  tips_screen_title: "Tips to Build Your eHome",

  //total tax screen
  total_tax_screen_title: "GST Paid",
  total_tax_screen_total: "Total GST",
  total_tax_screen_filter_last_7_days: "Last 7 Days",
  total_tax_screen_filter_current_month: "Current Month",
  total_tax_screen_filter_current_year: "Current Year",
  total_tax_screen_filter_lifetime: "Lifetime",
  total_tax_screen_filter_options_title: "See tax info of",
  total_tax_screen_filter_close: "Cancel",

  //transactions screen
  transactions_screen_transactions: "TRANSACTIONS",
  transactions_screen_no_transactions: "NO TRANSACTIONS",
  transactions_screen_filter_last_7_days: "Last 7 Days",
  transactions_screen_filter_current_month: "Current Month",
  transactions_screen_filter_current_year: "Current Year",
  transactions_screen_filter_overall: "Lifetime",
  transactions_screen_filter_options_title: "See insights of",
  transactions_screen_filter_close: "Cancel",

  //add-edit-expense-screen
  add_edit_expense_screen_title_add_automobile: "Add Automobile",
  add_edit_expense_screen_title_add_electronics:
    "Add Electronics & Electricals",
  add_edit_expense_screen_title_add_furniture: "Add Furniture & Hardware",
  add_edit_expense_screen_title_add_visiting_card: "Add Visiting Card",
  add_edit_expense_screen_title_add_medical_docs: "Add Medical Documents",
  add_edit_expense_screen_title_add_personal_doc: "Add Personal Doc",
  add_edit_expense_screen_title_add_services: "Add Services Expense",
  add_edit_expense_screen_title_add_travel: "Add Travel & Dining",
  add_edit_expense_screen_title_add_healthcare: "Add Healthcare Expense",
  add_edit_expense_screen_title_add_fashion: "Add Fashion Expense",
  add_edit_expense_screen_title_add_home: "Add Home Expense",
  add_edit_expense_screen_title_add_repair: "Add Repair",
  add_edit_expense_screen_title_add_eHome: "Product added to your eHome.",
  add_edit_expense_screen_title_add_products: "ADD MORE PRODUCTS",
  add_edit_expense_screen_title_add_later: "I'll Do it Later",
  add_edit_expense_screen_title_add_sure: "Are you sure?",
  add_edit_expense_screen_title_add_docs:
    "All the unsaved information and document copies related to this product would be deleted",
  add_edit_expense_screen_title_add_go_back: "Go Back",
  add_edit_expense_screen_title_add_stay: "Stay",
  add_edit_expense_screen_title_add_rent_agreement: "Rent Agreement",
  add_edit_expense_screen_title_add_personal_doc: "Other Personal Doc",
  add_edit_expense_screen_title_add_visit_card: "Visiting Card",
  add_edit_expense_screen_title_add_select_doc:
    "Please select 'Type of doc' first",
  add_edit_expense_screen_title_add_upload_doc:
    "Please upload the document first",
  add_edit_expense_screen_title_add_doc: "ADD DOC",
  add_edit_expense_screen_title_add_doc_added: "Doc added to your eHome.",
  add_edit_expense_screen_title_add_select_type: "Select a type above to",
  add_edit_expense_screen_title_add_brand_name:
    "Please select or enter brand name",
  add_edit_expense_screen_title_add_type: "Please select a type",
  add_edit_expense_screen_title_add_purchase_date:
    "Please select a purchase date",
  add_edit_expense_screen_title_add_date: "Please select a date",
  add_edit_expense_screen_title_add_amount: "Please enter amount",
  add_edit_expense_screen_title_add_repairs: "Please select repair date",
  add_edit_expense_screen_title_add_no_products: "No Products in your eHome",
  add_edit_expense_screen_title_add_add_products: " + Add Product",
  add_edit_expense_screen_title_add_repair_details: "to add repair details",
  add_edit_expense_screen_title_add_select_eHome: "Select Product in eHome",
  add_edit_expense_screen_title_add_select_product_above:
    "Please select a product above OR",
  add_edit_expense_screen_title_add_repair_details: "Repair Details",
  add_edit_expense_screen_title_add_repair_date: "Repair Date",
  add_edit_expense_screen_title_add_repair_amount: "Repair Amount",
  add_edit_expense_screen_title_add_sellers_name: "Seller Name",
  add_edit_expense_screen_title_add_warranty_upto: "Warranty Up to",
  add_edit_expense_screen_title_add_add_repair: "ADD REPAIR",
  add_edit_expense_screen_title_add_repair_added:
    "Repair added with the product.",
  add_edit_expense_screen_title_select_automobile: "Select Automobile Type",
  add_edit_expense_screen_title_select_electronics:
    "Select Electronic & Electrical Type",
  add_edit_expense_screen_title_select_furniture:
    "Select Furniture & Hardware Type",
  add_edit_expense_screen_title_select_service_expense:
    "Select Service Expense Type",
  add_edit_expense_screen_title_select_fashion_expense:
    "Select Fashion Expense Type",
  add_edit_expense_screen_title_select_home_expense: "Select Home Expense Type",
  add_edit_expense_screen_title_select_medical_document:
    "Select Medical Document Type",
  add_edit_expense_screen_title_select_health_expense:
    "Select Healthcare Expense Type",
  add_edit_expense_screen_title_select_personal_doc:
    "Select Personal Document Type",

  //faqs
  faq_question_1: "What is BinBill?",
  faq_answer_1:
    "BinBill App complements your On-The-Go lifestyle. The One App for all your After Sales needs and complete Product Life Time usage. You can track your expenses and be aware of your financial position. It also has your personal Attendance Manager for all your monthly or periodic services.",
  faq_question_2: "What is eHome? How can I create it?",
  faq_answer_2:
    "An eHome is a digital recreation of your House. You can select a category and add products that you own including Home Appliances, Car, Bike, Electrical items etc. Bills of your regular expenses like Grocery, Restaurant, Medical and other Day To Day purchase can also be added. eHome sorts these expenses into relevant categories. You can now retrieve all information with just one touch. It also has your personal Attendance Manager for all monthly or periodic services.",
  faq_question_3: "How does eHome help organize my life?",
  faq_answer_3:
    "BinBill Smartly organises your products and expenses in relevant categories. You can manage your product’s after purchase life cycle. All related expenses and important documents are available with just one touch. Now you will never have to look for this information anywhere else except in your eHome.",
  faq_question_4: "What is a Product Card?",
  faq_answer_4:
    "Product cards are building blocks of your eHome. It is a digital snapshot of all the critical information such as Warranty, Insurance, PUC, Service expenses, Customer care, Nearest Authorised Service Center for all your products. Once a Product Card is created, you will never have to worry about remembering the whereabouts of the bill of purchase, the warranty card, insurance due date etc.",
  faq_question_5: "How does Product Card help me in after sales service?",
  faq_answer_5:
    "Among other benefits, a product card once created lets you know the prescribed Service Schedules, Warranty, Customer Service and Nearest Service station. All this information is available at one place at one touch.",
  faq_question_6: "What is the Share Review feature and how is it useful?",
  faq_answer_6:
    "Share Review feature is designed to help your friends, family learn from your product experience. With this feature you can be your network’s Product Review Expert.",
  faq_question_7: "What is Attendance Manager?",
  faq_answer_7:
    "This feature emphasises our offering of One Home: Multiple Needs: One Platform. With the Attendance Manager, you can  very simply manage monthly/periodic attendance and payouts for services of your Milkman, Newspaper wala, Maids etc. Now no more jotting down dates everywhere and manual calculations for all these services.",
  faq_question_8: "Who all can use BinBill?",
  faq_answer_8:
    "It starts with YOU.BinBill can be used by all and sundry who want to stay organized, manage their expenses and stay in control of their finances.",
  faq_question_9: "What type of bills and documents can I upload?",
  faq_answer_9:
    "You can upload all your Expense bills. This includes - Bills of Home Appliances, Durables, Cars, Grocery, Travel and Hotel accomodation, Restaurants, Household expenses etc. You can also save your important documents like RC Book, PUC certificate, Insurance invoices, Educational certificates here. If you think a document is important, you can upload it on BinBill.",
  faq_question_10: "How do I benefit by adding an expense bill?",
  faq_answer_10:
    "All our spending habits are sporadic. We go out on trips and plan weekends with friends, families etc. sharing our expenses. It is difficult to track these expenses. However if you record theses expenses on BinBill, it helps you know the What, When, Why and Where of these expenses. It also gives you an insight on your spending  helping you to know where you could have saved.",
  faq_question_11: " Do I need to pay anything to avail these services?",
  faq_answer_11:
    "No! This is absolutely free for end users. We are just assisting you to stay more organized and hasslefree. Refer and add more members to enjoy our advanced features in the coming time.",
  faq_question_12: "As I am new to BinBill, how do I start my journey?",
  faq_answer_12:
    "The first step is to register your eHome, which is free of cost. Start adding product bills and documents leaving the rest to us to create your wonderful eHome. BinBill has a user-friendly interface making it easy for anyone to use.",
  faq_question_13: "For how long do my bills stay in BinBill?",
  faq_answer_13:
    "Your bills will be available in your BinBill Account for as long as you wish.",
  faq_question_14: "Can I retrieve stored bills?",
  faq_answer_14:
    "Yes. You can view and download bills anytime just with one touch.",
  faq_question_15: "Can I add Product Card information later?",
  faq_answer_15:
    "Yes, you can. However, it it is recommended to add details of products while creating your product card. Remember, it is only a one-time effort and convenience for lifetime.",
  faq_question_16: "How is ‘EazyDay’ section useful for me?",
  faq_answer_16:
    "This section helps you plan your day with ease and gives you an overview of all activities for the day. This works on the principle of non repeat and works on items which we do periodically and not frequently. Our unique algorithm not only helps you maintain a list of your favourite food/clothes/tasks but also tells you when a particular dish was cooked, a shirt was worn or a task was done. This helps you decide better what to cook/wear/do in the present day. It even helps you manage daily attendance of your house help, milkman and newspaper wala!",
  faq_question_17: "What is ‘Who’s Absent Today’ section?",
  faq_answer_17:
    "This feature helps you manage all your household services like your house help, milkman and newspaper wala by keeping their attendance and payout record for the month. Now no more jotting down dates everywhere and manual calculations for all these services.",
  faq_question_18: "How does ‘What’s Cooking Today’ section work for me?",
  faq_answer_18:
    "It’s always difficult to decide what to cook today and because of that we tend to miss out on many delicacies for a long period of time. This section helps you decide what needs to be cooked for the day, tomorrow or later. This works on the principle of Non Repeat and works on items which we do periodically and not frequently. Our unique algorithm not only helps you maintain your favourite food list but also tells you when a particular dish was cooked. This helps you decide better what to cook today. We have a representative list of local and popular dishes that you can select for your state as well as create your own list of dishes to be cooked.",
  faq_question_19: "How does ‘What to Wear Today’ section work for me?",
  faq_answer_19:
    "It’s always a difficult task deciding what to wear each day especially when you have an extensive wardrobe so much so that you very often don’t even remember you own a particular dress or trouser stacked somewhere! This section helps you create a digital wardrobe of all the clothing or accessory items you own alongwith their pictures for an easy recall and decision on what to wear each day. You could also key in an item without a picture if you wish.",
  faq_question_20: "How does ‘What to Do Today’ section work for me?",
  faq_answer_20:
    "This is a very useful section helping you plan all tasks to be completed in the entire day. We have listed down various periodic household tasks not done very frequently and hence are difficult to recall. You can also add any other task not appearing in the list to create your daily ‘to do’ list.This section helps you decide what needs to be done for the day, tomorrow or later.This works on the principle of non repeat and works on items which we do periodically and not frequently.Our unique algorithm not only helps you maintain your necessary task list but also tells you when a particular task was done.This helps you decide better what to do today or later.",

  //tab screen header
  tab_screen_header_search_placeholder: "Search...",

  // add expenses options
  add_expenses_options_upload_title:
    "Got a Bill? Some other Important Document",
  add_expenses_options_upload_btn: "UPLOAD NOW",
  add_expenses_options_upload_bottom_text: "We will take care of everything",
  add_expenses_options_or: "OR",
  add_expenses_options_manual_title:
    "Don’t have a Bill? Want to add some expense",
  add_expenses_options_manual_btn: "ADD MANUALLY",
  add_expenses_options_manual_bottom_text: "You can always add bill later",
  add_expenses_options_cancel_btn: "CANCEL",

  //app-tour texts
  plus_btn_tip:
    "Click here to Add your Bills, Expenses and Important Documents.",
  ehome_tip:
    "Click here to check your private and secure eHome for your saved Bills, Expenses & Documents.",
  attendance_tip:
    "Plan your Day for tasks to be done, clothes to be worn and dishes to be cooked. Track attendance & payouts for all your household services too!",
  do_you_know_tip:
    "Discover amazing facts & tips related to brands and lifestyle, to fill you with awe! ",
  asc_tip:
    "Click here to find Authorised Service Centres of any Brand and connect with just one simple click.",
  insights_tip: "Keep a track of your monthly and periodic expenses.",
  mailbox_tip:
    "This is your eHome’s inbox where all Reminders and Notifications will be delivered for you to track.",
  coming_up_tip:
    "This is your Alert section. You can track all your Renewal and Expiry dates here.",
  add_bill_btn_tip: "To add multiple bills at the same time, use the + icon.",
  zoom_image_tip:
    "Just pinch out to zoom in your bills, to have a better view.",
  upload_bill_tip:
    "Upload Bill: You can upload Bills and Documents here. If you don’t have the Bill, you can always add it later on.",
  product_card_tip:
    "This is the Product Card for your {{categoryName}}. It’s a digital identity of your Product for you to access anytime, anywhere.",
  product_card_upload_bill_tip:
    "Don't want to add the details manually, just upload the bill and your Home Manager will fill in the rest.",
  product_card_share_tip:
    "Share your product experience with your Friends, Family and Followers to help them make a wise purchase decision.",
  product_card_review_tip: "Review your product experience.",
  product_card_add_image_tip:
    "This helps you personalize this item.  You can upload image which suitably represents the item. Adding real image to your card makes it more shareable with your friends and family.",
  deals_filter_tip: "Filter your requirement further.",

  //blank dashboard
  blank_dashboard_headline: "Welcome to BinBill",
  blank_dashboard_text: "Your Own Home Manager",
  blank_dashboard_btn_text: "UPLOAD DOC",
  blank_dashboard_know_more_text: "Know More",
  blank_dashboard_one_step: "One Stop For",

  //add-edit last step
  add_edit_amc_add_amc: "Add AMC",
  add_edit_amc_edit_amc: "Edit AMC",
  add_edit_amc_are_you_sure: "Are you sure?",
  add_edit_amc_unsaved_info:
    "All the unsaved information and document copies related to this AMC would be deleted",
  add_edit_amc_go_back: "Go Back",
  add_edit_amc_stay: "Stay",
  add_edit_amc_delete_amc: "Are you sure?",
  add_edit_amc_delete_amc_desc:
    "All the information and document copies related to this AMC will be deleted.",
  add_edit_amc_could_not_delete: "Couldn't delete",
  add_edit_no_dnt_delete: "No, don't Delete",
  add_edit_amc_effective_date: "Please select AMC effective date",
  add_edit_amc_save: "SAVE",
  add_edit_insurance_add_insurance: "Add Insurance",
  add_edit_insurance_edit_insurance: "Edit Insurance",
  add_edit_insurance_delete: "Delete",
  add_edit_insurance_unsaved_info:
    "All the unsaved information and document copies related to this insurance would be deleted",
  add_edit_insurance_delete_insurance: "Are you sure?",
  add_edit_insurance_delete_insurance_desc:
    "All the information and document copies related to this insurance will be deleted.",
  add_edit_insurance_yes_delete: "Yes, delete",
  add_edit_insurance_provider_name: "Please select or enter provider name",
  add_edit_personal_doc_are_you_sure: "Are you sure?",
  add_edit_personal_doc_unsaved_info:
    "All the unsaved information and copies related to this document would be deleted",
  add_edit_personal_doc_first: "Please select 'Type of doc' first",
  add_edit_personal_doc_upload_first: "Please upload the document first",
  add_edit_personal_doc_type_of_doc: "Type of doc",
  add_edit_personal_doc_name: "Name",
  add_edit_personal_doc_business_name: "Business Name",
  add_edit_personal_doc_phone_number: "Phone Number",
  add_edit_personal_doc_email: "Email",
  add_edit_personal_doc_address: "Address",
  add_edit_personal_doc_add_doc: "ADD DOC",
  add_edit_personal_doc_doc_added: "Doc added to your eHome.",
  add_edit_puc_add_puc: "Add PUC",
  add_edit_puc_edit_puc: "Edit PUC",
  add_edit_puc_unsaved_info:
    "All the unsaved information and document copies related to this PUC would be deleted",
  add_edit_puc_delete_puc: "Are you sure?",
  add_edit_puc_delete_puc_desc:
    "All the information and document copies related to this PUC will be deleted.",
  add_edit_puc_select_puc: "Please select 'PUC Effective Date' or 'PUC up to'",
  add_edit_repair_add_repair: "Add Repair",
  add_edit_repair_edit_repair: "Edit Repair",
  add_edit_repair_unsaved_info:
    "All the unsaved information and document copies related to this repair would be deleted",
  add_edit_repair_delete_repair: "Are you sure?",
  add_edit_repair_delete_repair_desc:
    "All the information and document copies related to this repair will be deleted.",
  add_edit_repair_date: "Please select repair date",
  add_edit_warranty_unsaved_info:
    "All the unsaved information and document copies related to this warranty would be deleted",
  add_edit_warranty_delete_warranty: "Are you sure?",
  add_edit_warranty_delete_warranty_desc:
    "All the information and document copies related to this warranty will be deleted.",
  add_edit_warranty_effective_date: "Please enter the Effective Date",
  add_edit_warranty_uptoo: "Please select Warranty up to",
  add_edit_product_option_product: "Add Products & Documents",
  add_edit_product_option_or: "OR",
  add_edit_product_option_expense: "Add Expenses & Moments",
  add_edit_direct_upload_docs:
    "Document Uploaded, Provide further details to complete the process",
  add_edit_direct_category: "Select Category",
  add_edit_direct_subcategory: "Select Sub-Category",
  add_edit_direct_insurance_provider: "Select Insurance Provider",
  add_edit_direct_type: "Select Type",
  add_edit_direct_brand: "Select Brand",
  add_edit_direct_model: "Select Model",
  add_edit_direct_select_main_category_first: "Select Category First",
  add_edit_direct_select_category_first: "Select Sub-Category First",
  add_edit_direct_select_brand_first: "Select Brand First",
  add_edit_direct_select_model_first: "Select Model First",
  add_edit_direct_add_docs: "Update Details",
  add_edit_direct_doc_successfully: "Document Uploaded Successfully",
  add_edit_direct_add_eHome: "ADD PRODUCTS TO eHOME",
  add_edit_direct_later: "I'll Do it Later",
  add_edit_healthcare_unsaved_info:
    "All the unsaved information and document copies related to this insurance would be deleted",
  add_edit_healthcare_doc_added: "Doc added to your eHome.",
  add_edit_healthcare_edit_insurance: "Edit Insurance",
  add_edit_medical_unsaved_info:
    "All the unsaved information and copies related to this document would be deleted",
  add_edit_medical_upload_doc: "Please upload doc",
  add_edit_medical_add_doc: "ADD DOC",
  add_edit_product_basic_unsaved_info:
    "All the unsaved information and document copies related to this product would be deleted",
  add_edit_product_basic_select_brand: "Please select or enter brand",
  add_edit_product_basic_select_type: "Please select a type",
  add_edit_product_basic_select_amount: "Please enter amount",
  add_edit_product_basic_select_date: "Please select a date",
  add_edit_force_update_upgrade:
    "Update to a New, More Awesome and Friendlier BinBill!",
  add_edit_force_update_versions:
    "The new version brings a whole host of fantastic features and improvements.",
  add_edit_force_update_text1: "Home Attendance Manager",
  add_edit_force_update_text2: "Share Personalised Review",
  add_edit_force_update_text3: "Do You Know series",
  add_edit_force_update_now: "UPDATE NOW",
  add_edit_force_not_now: "Maybe Later",
  add_edit_force_ok: "OK",

  //app-tour
  add_app_tour: "GOT IT",

  //expenseForms
  expense_forms_amc_form_amc_text: "AMC (If Applicable)",
  expense_forms_amc_form_amc_effective_date: "AMC Effective Date",
  expense_forms_amc_form_amc_recommended: "(Recommended)",
  expense_forms_amc_form_amc_seller_name: "AMC Provider Name",
  expense_forms_amc_form_amc_seller_contact: "AMC Provider Contact",
  expense_forms_amc_form_amc_amount: "AMC Amount (₹)",
  expense_forms_amc_form_amc_upload: "Upload AMC Doc",
  expense_forms_expense_basic_detail: "Basic Details",
  expense_forms_expense_basic_upload_bill: "Upload Bill",
  expense_forms_expense_basic_expense: "Expense Type",
  expense_forms_expense_basic_expense_name: "Expense Name",
  expense_forms_expense_basic_expense_recommend:
    "Recommended for fast and easy retrieval",
  expense_forms_expense_basic_expense_date: "Date",
  expense_forms_expense_basic_expense_amount: "Amount (₹)",
  expense_forms_expense_basic_expense_next_date: "Next Due Date",
  expense_forms_expense_basic_expense_seller_name: "Seller Name",
  expense_forms_expense_basic_expense_seller_contact: "Seller Contact",
  expense_forms_extended_warranty_third_party_text:
    "Third Party Extended Warranty",
  expense_forms_extended_warranty_provider: "Provider",
  expense_forms_extended_warranty_provider_name: "Enter Provider Name",
  expense_forms_extended_warranty_start_date: "Warranty Start Date",
  expense_forms_extended_warranty_upto: "Warranty up to (years)",
  expense_forms_warranty_upload_warr_doc: "Upload Warranty Doc",
  expense_forms_extended_warranty_title: "title",
  expense_forms_extended_warranty_doc: "Upload Extended Warranty Doc",
  expense_forms_healthcare: "Basic Details",
  expense_forms_healthcare_upload_doc: "Upload Doc",
  expense_forms_healthcare_plan_name: "Plan Name",
  expense_forms_healthcare_type: "Type",
  expense_forms_healthcare_for: "For (Self/Child/Wife/Parents/Family/Etc.)",
  expense_forms_healthcare_policy: "Policy No",
  expense_forms_healthcare_effective_date: "Effective Date",
  expense_forms_healthcare_premium_amount: "Premium Amount",
  expense_forms_healthcare_coverage: "Coverage",
  expense_forms_insurance: "Insurance (If Applicable)",
  expense_forms_insurance_name: "Insurance",
  expense_forms_insurance_details: "Insurance Details",
  expense_forms_insurance_provider: "Insurance Provider",
  expense_forms_insurance_provider_name: "Enter Provider Name",
  expense_forms_insurance_polocy_no: "Insurance Policy No ",
  expense_forms_insurance_premium_amount: "Insurance Premium Amount (₹)",
  expense_forms_insurance_upload_policy: "Upload Policy Doc",
  expense_forms_insurance_total_coverage: "Total Coverage (₹)",
  expense_forms_medical_doc_title: "Report Title",
  expense_forms_medical_doc_doctor_name: "Doctor/Hospital Name",
  expense_forms_medical_doc_doctor_contact: "Doctor/Hospital Contact",
  expense_forms_product_basics_name: "Product Name",
  expense_forms_product_basics_name_brand: "Brand",
  expense_forms_product_basics_brand_name: "Enter Brand Name",
  expense_forms_product_basics_model: "Model",
  expense_forms_product_basics_enter_model: "Enter Model Name",
  expense_forms_product_basics_select_brand_first: "Please select brand first",
  expense_forms_product_basics_imei: "IMEI No",
  expense_forms_product_basics_serial: "Serial No",
  expense_forms_product_basics_vin_no: "VIN No.",
  expense_forms_product_basics_registration_no: "Registration No",
  expense_forms_product_basics_purchase_date: "Purchase Date",
  expense_forms_product_basics_purchase_amount: "Purchase Amount (₹)",
  expense_forms_product_basics_seller_name: "Seller Name",
  expense_forms_product_basics_seller_contact: "Seller Contact",
  expense_forms_puc: "PUC (Optional)",
  expense_forms_puc_effective_date: "PUC Effective Date",
  expense_forms_puc_upto: "PUC up to",
  expense_forms_puc_seller_name: "PUC Seller Name",
  expense_forms_puc_seller_contact: "PUC Seller Contact",
  expense_forms_puc_amount: "PUC Amount (₹)",
  expense_forms_puc_upload_doc: "Upload PUC Doc ",
  expense_forms_repair_history: "Repair/Service History (If Applicable)",
  expense_forms_repair_for: "Repair Issue",
  expense_forms_repair_date: "Repair Date",
  expense_forms_repair_seller_name: "Repair Seller Name",
  expense_forms_repair_seller_contact: "Repair Seller Contact",
  expense_forms_repair_amount: "Repair Amount (₹)",
  expense_forms_repair_upload_repair: "Upload Repair/Service Bill",
  expense_forms_repair_warranty_upto: "Warranty up to",
  expense_forms_warranty_Warranty: "Warranty (If Applicable)",
  expense_forms_warranty_amount: "Amount (₹)",
  expense_forms_warranty_manufacturers: "Manufacturer Warranty (Optional)",
  expense_forms_warranty_applicable: "Warranty (If Applicable)",
  expense_forms_warranty_dual_warranty: "Dual Warranty (If Applicable)",
  expense_forms_warranty_third_party: "Third Party Extended Warranty",
  expense_forms_header_upload_add: "+ Add",
  expense_forms_header_upload_doc: "Upload Doc",
  expense_forms_header_upload_doc_successfully: "Doc Uploaded Successfully",
  expense_forms_product_list_address_not_available: "Address not available",
  expense_forms_product_list_phone_not_available: "Phone number not available",
  expense_forms_product_list_select_phone: "Select a phone number",
  expense_forms_product_list_phone_number_not_available:
    "Phone Number Not Available",

  //component items
  component_items_okey: "OKAY",
  component_items_no_internet: "No Internet Connection",
  component_items_try_again:
    "Please check if your phone is connected to the internet and try again",
  component_items_something_went_wrong: "Something Went Wrong",
  component_items_unable_to_conect:
    "Unable to connect to BinBill to get your information. Please try again in sometime.",
  component_items_retry: "RETRY",
  // component_items_total_spend: "Total Spend",
  component_items_no_data_chart: "No Data for Chart",
  component_items_all_amount: "All amounts are in Rupees",
  component_items_select_value: "Select a value",
  component_items_enter_value: "Enter the value",
  component_items_search: "Search",
  component_items_warranty_expiry: "Warranty expiring",
  component_items_insurance_expiry: "Insurance expiring",
  component_items_amc_expiry: "AMC expiring",
  component_items_puc_expiry: "PUC expiring",
  component_items_repair_warranty_expiry: "Repair Warranty expiring",
  component_items_view_more: "View More",
  component_items_view_less: "View Less",

  //language options
  language_options_change: "Change",
  language_options_dont_change: "Don't Change",
  language_options_confirm_msg_title: "Change language to {{languageName}}?",
  language_options_confirm_msg_desc: "App may restart to reflect the changes.",
  language_options_cancel: "Cancel",
  changing_text_please_wait: "changing.. please wait..",
  resend_button: "Resend",

  //27-03-2018
  love_using_binbill: "Love using BinBill app?",
  recommend_us: `If you are happy with your Home Manager, please rate us on ${
    Platform.OS == "ios" ? "App" : "Play"
  } store.`,
  app_pin: "App Pin",
  change: "Change",
  set_now: "Set Now",
  change_pin: "Change Pin",
  remove_pin: "Remove Pin",
  cancel: "Cancel",
  set_app_pin: "Set App Pin",
  reset_app_pin: "Reset App Pin",

  //29-03-2018
  are_you_sure: "Are you sure?",
  delete_calendar_item_confirm_msg:
    "All the information related to this service will be deleted.",
  yes_delete: "Yes, Delete",
  no_dont_delete: "No, don't Delete",

  //29-03-2018
  add_edit_expense_screen_title_select_travel:
    "Select Travel & Dining Expense Type",

  //29-03-2018
  review_quotes: "Someday-N-Someway you will find this Review useful",

  //04-04-2018
  daily: "Daily",
  monthly: "Monthly",
  save: "Save",
  add_edit_calendar_service_screen_form_finish_date: "End Date",
  calendar_service_finish_date_warning:
    "Service Details post this date will not be recorded"
};
