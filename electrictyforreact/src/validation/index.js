export const validatePhoneNumber = (phoneNumber) => {
    const isValid = /^\d{10}$/.test(phoneNumber);
    return isValid;
};

export const validateAdharNumber = (adharNumber) => {
    const isValid = /^\d{4}\s\d{4}\s\d{4}$/.test(adharNumber);
    return isValid;
};

export const validateDate = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const isValid = selectedDate >= currentDate;
    return isValid;
};

export const validateTextString = (string) => {
    const isValid = /^[a-zA-Z ]+$/.test(string);
    return isValid;
};

export const validateNumberString = (string) => {
    const isValid = /[0-9]/.test(string);
    return isValid;
};