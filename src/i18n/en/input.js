import input from 'iztech-design-system-neo/dist/system/i18n/en/input'

export default {
  ...input,
  RULES: {
    ...input.RULES,
    NO_WHITESPACES: "No whitespace",
    PERCENTAGE: "Value must be less than 100 and greater than 0",
    AT_LEAST_ONE: "At least one",
    MAX_LENGTH: "Max length is {0}",
    MIN_LENGTH: "Min length is {0}",
    URL: "Invalid link",
    NUMBER: "Invalid number",
    VALID_PRICE: "Online payment gateway cannot transfer less than 10.000VND. Please set the value higher.",
    NUMBER_GREATER_EQUAL: "Value must be greater or equal {0}",
    NUMBER_GREATER_THAN: "Value must be greater than {0}",
    NUMBER_LESS_THAN: "Value must be less than {0}",
    NUMBER_CLAMP: "Value must be between {0} and {1}",
    DATE_GREATER_THAN: "Chosen date must be after {0}",
    DOMAIN: "Invalid domain",
  }
}