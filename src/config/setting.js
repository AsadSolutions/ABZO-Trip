/**
 * Basic Setting Variables Define
 */
export const BaseSetting = {
  name: 'AbzoTrip',
  displayName: 'AbzoTrip',
  "REACT_APP_NODE_ENV" : "production",
  "REACT_APP_GOOGLE_KEY" : "AIzaSyDOhFuWaRL2dTpLA_R7eFsz__s2JFbJ01o",
  "REACT_APP_JAAZ_MERCHANT"  :  "MC18719",
  "REACT_APP_JAAZ_PASSWORD"  :  "y1254gvf3v",
  "REACT_APP_JAAZ_SALT"  :  "62028x8u1s",
  "REACT_APP_FACEBOOK_ID"  :  "597916444301736",
  "REACT_APP_YOUTUBE_KEY"  :  "AIzaSyB3lJ193zfUZ8eKdZMGcVPCbcq4_jMqtt8",
  "REACT_APP_PAID_PERCENT"  :  "0.4",
  
  "REACT_APP_SELF_PATH" : "https://www.abzotrip.com/",
  "REACT_APP_FILE_PATH"  :  "https://admin.abzotrip.com/assets/",
  "REACT_APP_BASE_PATH" : "https://api.abzotrip.com/",
  "REACT_APP_PAYMENT_SUCCESS" : "https://admin.abzotrip.com/register/jazz_return",
  "REACT_APP_EASY_PAISA"  :  "https://admin.abzotrip.com/register/easypaisa_payment_process",
  "REACT_APP_JAZZ_CASH" : "https://admin.abzotrip.com/register/jazzcash_payment_process",
  "REACT_APP_WALLET_CASH" : "https://admin.abzotrip.com/register/wallet_payment_process",
  "REACT_APP_URL_PAYMENT_SUCCESS" : "payment_success",
  "production" : {
      "REACT_APP_SELF_PATH" : "https://www.abzotrip.com/",
      "REACT_APP_FILE_PATH"  :  "https://admin.abzotrip.com/assets/",
      "REACT_APP_BASE_PATH" : "https://api.abzotrip.com/",
      "REACT_APP_PAYMENT_SUCCESS" : "https://admin.abzotrip.com/register/jazz_return",
      "REACT_APP_EASY_PAISA"  :  "https://admin.abzotrip.com/register/easypaisa_payment_process"
  }, 
  "local" : {
      "REACT_APP_SELF_PATH" : "http://localhost:3000/",
      "REACT_APP_FILE_PATH"  :  "http://localhost:1337/",
      "REACT_APP_BASE_PATH" : "http://localhost:1337/",
      "REACT_APP_PAYMENT_SUCCESS" : "http://localhost/abzo/admin/register/jazz_return",
      "REACT_APP_EASY_PAISA"  : "http://localhost/abzo/admin/register/easypaisa_payment_process",
  },
  appVersion: '1.1.2',
  defaultLanguage: 'en',
  languageSupport: [
    'en',
    'vi',
    'ar',
    'da',
    'de',
    'el',
    'fr',
    'he',
    'id',
    'ja',
    'ko',
    'lo',
    'nl',
    'zh',
    'fa',
    'km',
  ],
  resourcesLanguage: {
    en: {
      translation: require('../lang/en.json'),
    },
    vi: {
      translation: require('../lang/vi.json'),
    },
    ar: {
      translation: require('../lang/ar.json'),
    },
    da: {
      translation: require('../lang/da.json'),
    },
    de: {
      translation: require('../lang/de.json'),
    },
    el: {
      translation: require('../lang/el.json'),
    },
    fr: {
      translation: require('../lang/fr.json'),
    },
    he: {
      translation: require('../lang/he.json'),
    },
    id: {
      translation: require('../lang/id.json'),
    },
    ja: {
      translation: require('../lang/ja.json'),
    },
    ko: {
      translation: require('../lang/ko.json'),
    },
    lo: {
      translation: require('../lang/lo.json'),
    },
    nl: {
      translation: require('../lang/nl.json'),
    },
    zh: {
      translation: require('../lang/zh.json'),
    },
    fa: {
      translation: require('../lang/fa.json'),
    },
    km: {
      translation: require('../lang/km.json'),
    },
  },
};
