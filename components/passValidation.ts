const isUpperCase = new RegExp(/(?=.*[A-Z])/g)
const isLowerCase = new RegExp(/(?=.*[a-z])/g)
const isSpecialChars = new RegExp(/(?=.*[!@#$%^&*])/g)
const isLong = new RegExp(/(?=.{7,})/g)
const isNumeric = new RegExp(/(?=.[0-9])/g)
const checkIsWhiteSpaceFromBegAndEnd = new RegExp(/^[^ ][\w\W ]*[^ ]/g)

export const passValidation = (password: string) => {
    return !!(password.match(isUpperCase) &&
        password.match(isLowerCase) &&
        password.match(isSpecialChars) &&
        password.match(isLong) &&
        password.match(isNumeric) &&
        password.match(checkIsWhiteSpaceFromBegAndEnd));
}