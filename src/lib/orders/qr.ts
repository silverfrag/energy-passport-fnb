import type { BankAccount } from './types'

function field(id: string, value: string): string {
  if (!/^[\x20-\x7e]*$/.test(value) || value.length > 99) throw new Error('Invalid QR field')
  return id + String(value.length).padStart(2, '0') + value
}

/** EMVCo CRC-16/CCITT-FALSE, including the final 6304 tag, excluding checksum itself. */
export function crc16(value: string): string {
  let crc = 0xffff
  for (let i = 0; i < value.length; i++) {
    crc ^= value.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) crc = ((crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/** NAPAS QRIBFTTA transfer-to-account payload. This encodes instructions, never payment confirmation. */
export function createBankQr(bank: BankAccount, amount: number, transferContent: string): string {
  if (!/^\d{6}$/.test(bank.bankBin) || !/^\d{6,19}$/.test(bank.accountNumber) || !Number.isSafeInteger(amount) || amount <= 0 || !/^[A-Z0-9]{1,25}$/.test(transferContent)) throw new Error('Invalid payment instructions')
  const beneficiary = field('00', bank.bankBin) + field('01', bank.accountNumber)
  const merchant = field('00', 'A000000727') + field('01', beneficiary) + field('02', 'QRIBFTTA')
  const payload = field('00', '01') + field('01', '12') + field('38', merchant) + field('53', '704') + field('54', String(amount)) + field('58', 'VN') + field('62', field('08', transferContent)) + '6304'
  return payload + crc16(payload)
}
