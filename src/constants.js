import config from './config';
import AMEX from './assets/amex.png';
import DISCOVER from './assets/discover-dark.png';
import MASTER_CARD from './assets/master-card.png';
import VISA from './assets/visa-dark.png';

export const API_BASE_URL = config.API_URL;
export const API_KEY = config.API_KEY;
export const LOCATION_API_URL = config.LOCATION_API_URL;
export const LOCAL_SAVED_USER = 'shopperApp.savedUser';
export const REGEX_PATTERNS = {
    NUM_KEY: /^[\d ]*$/,
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    LETTERS: /^[a-zA-Z- ]+$/,
    ZIP: /^[0-9]{5}/,
    TEL: /^[-()\d ]*$/,
    PHONE: /^(\d{3})(\d{3})(\d{4})$/,
    MMDD: /^[/\d ]*$/
};

export const CARD_PATTERNS = {
    AMEX: /^3[47]/,
    DISCOVER: /^65|^6011|^622|^64[4-9]/,
    MASTERCARD: /^(?:5[1-5])/,
    VISA: /^4/
};

export const CARD_ICONS = {
    AMEX: AMEX,
    DISCOVER: DISCOVER,
    MASTERCARD: MASTER_CARD,
    VISA: VISA
};

export const states = [ '',
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];