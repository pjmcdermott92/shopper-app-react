import { REGEX_PATTERNS } from "../constants";

const checkFieldInput = e => {
    const { name } = e.target;
    const keyPressed = e.nativeEvent.data;
    if (!keyPressed) return true;
    switch (name) {
        case 'telephone':
            if (!keyPressed.match(REGEX_PATTERNS.TEL)) return false;
            return true;
        case 'zip':
        case 'cvc':
        case 'cardnumber':
            if (!keyPressed.match(REGEX_PATTERNS.NUM_KEY)) return false;
            return true;
        case 'firstname':
        case 'lastname':
        case 'city':
        case 'cardholder':
            if (!keyPressed.match(REGEX_PATTERNS.LETTERS)) return false;
            return true;
        default: return true;
    }
}

export default checkFieldInput;
