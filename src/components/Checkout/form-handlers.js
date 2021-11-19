import {
    CARD_ICONS,
    CARD_PATTERNS,
    REGEX_PATTERNS
} from '../../constants';

export const formatPhoneNumber = number => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(REGEX_PATTERNS.PHONE);
    if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
    return number;
}

export const validateShippingFields = ({
    firstname, lastname, street, zip, city, state, phone
}) => {
    let errors = {};
    if (firstname.length < 2) errors = {
        ...errors, firstname: 'First Name is required'
    };
    if (lastname.length < 2) errors = {
        ...errors, lastname: 'Last Name is required'
    };
    if (street.length < 2) errors = {
        ...errors, street: 'Street Address is required'
    };
    if (zip.length < 5) errors = {
        ...errors, zip: 'Required'
    };
    if (city.length < 2) errors = {
        ...errors, city: 'Required'
    };
    if (state.length < 2) errors = {
        ...errors, state: 'Required'
    };
    if (phone.length < 10) errors = {
        ...errors, phone: 'Valid Phone is required'
    };
    return errors;
}

export const validateCheckoutForm = state => {
    const { cardholder, cardnumber, expmonth, expyear, cvc } = state.fields;
    const { cvcMax, cardMax, cardType } = state;
    let errors = {};
    if (cardholder.length < 2) errors = { ...errors, cardholder: 'Enter Cardholder\'s Name' };
    if (cardnumber < cardMax  || !cardType) errors = { ...errors, cardnumber: 'Enter a valid Card Number' };
    if (expmonth.length < 2) errors = { ...errors, expmonth: 'Required' };
    if (expyear.length < 2) errors = { ...errors, expyear: 'Required' };
    if (cvc.length < cvcMax) errors = { ...errors, cvc: 'Not Valid' };
    if (!checkExpDate(expmonth, expyear)) errors = {
        ...errors, expmonth: 'Not Valid', expyear: 'Not Valid'
    };
    return errors;
}

export const formatCardData = number => {
    const cleanedNum = ('' + number).replace(/\D/g, '');
    let data = {
        mask: cleanedNum,
        cardMax: 19, cvcMax: 4, cardType: null, cardIcon: null
    };
    if (!cleanedNum) return data;
    if (cleanedNum.match(CARD_PATTERNS.AMEX)) {
        data = {
            mask: cleanedNum.replace(/\b(\d{4})(\d{6})(\d{5})\b/, '$1 $2 $3'),
            cardMax: 17, cvcMax: 4, cardType: 'AMEX', cardIcon: CARD_ICONS['AMEX']
        };
        return data;
    };
    for (const card in CARD_PATTERNS) {
        if (cleanedNum.match(CARD_PATTERNS[card])) data = {
            mask: cleanedNum.match(new RegExp('.{1,4}', 'g')).join(' '),
            cardMax: 19, cvcMax: 3, cardType: card, cardIcon: CARD_ICONS[card]
        };
        else data.mask = cleanedNum.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    return data;
}

function checkExpDate(month, year) {
    const fullYear = '20' + year.toString();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const compareDate = new Date(currentYear, currentMonth, 1);
    const expDate = new Date(fullYear, month - 1, 1);
    if(expDate < compareDate) return false;
    return true;
}
