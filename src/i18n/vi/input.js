import input from 'iztech-design-system-neo/dist/system/i18n/vi/input'

export default {
  ...input,
  RULES: {
    ...input.RULES,
    NO_WHITESPACES: "Không có khoảng trắng",
    PERCENTAGE: "Giá trị phải nhỏ hơn 100 và lớn hơn 0",
    AT_LEAST_ONE: "Có ít nhất 1 ký tự",
    MAX_LENGTH: "Độ dài tối đa là {0}",
    MIN_LENGTH: "Độ dài tối thiểu là {0}",
    URL: "Sai định dạng đường dẫn",
    NUMBER: "Sai định dạng số",
    VALID_PRICE: "Cổng Thanh toán điện tử không thể thực hiện giao dịch dưới 10.000VNĐ. Vui lòng đặt giá trị cao hơn.",
    NUMBER_GREATER_EQUAL: "Số lớn hơn hoặc bằng {0}",
    NUMBER_GREATER_THAN: "Số lớn hơn {0}",
    NUMBER_LESS_THAN: "Số nhỏ hơn {0}",
    NUMBER_CLAMP: "Số nằm giữa {0} và {1}",
    DATE_GREATER_THAN: "Ngày được chọn phải sau ngày {0}",
    DOMAIN: "Sai định dạng tên miền",
  }
}