export class OrderError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message)
    this.name = 'OrderError'
  }
}

export function unavailable(): never {
  throw new OrderError(503, 'ORDERING_UNAVAILABLE', 'Hệ thống đặt món chưa sẵn sàng. Chưa có đơn hàng hoặc khoản thanh toán nào được xác nhận.')
}
