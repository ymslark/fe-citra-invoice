

import { isNan } from '@sindresorhus/is'
import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'


// 👉 Required Validator
export const requiredValidator = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Field ini harus diisi'
  
  return !!String(value).trim().length || 'Field ini harus diisi'
}

// 👉 Email Validator
export const emailValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i
  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'Email Tidak Valid!'
  
  return re.test(String(value)) || 'Email Tidak Valid!'
}

// 👉 Password Validator
export const passwordValidator = password => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
  const validPassword = regExp.test(password)
  
  return validPassword || 'Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars'
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value, target) => value === target || 'isi tidak match'

// 👉 Between Validator
export const betweenValidator = (value, min, max) => {
  const valueAsNumber = Number(value)
  
  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Enter number between ${min} and ${max}`
}

// 👉 Integer Validator
export const integerValidator = value => {
  if (isEmpty(value))
    return true
  if (Array.isArray(value))
    return value.every(val => /^-?\d+$/.test(String(val))) || 'Field ini harus berupa angka!'
  
  return /^-?\d+$/.test(String(value)) || 'Field ini harus berupa angka!'
}

// 👉 Regex Validator
export const regexValidator = (value, regex) => {
  if (isEmpty(value))
    return true
  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)
  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))
  
  return regeX.test(String(value)) || 'The Regex field format is invalid'
}

// 👉 Alpha Validator
export const alphaValidator = value => {
  if (isEmpty(value))
    return true
  
  return /^[A-Z]*$/i.test(String(value)) || 'The Alpha field may only contain alphabetic characters'
}

// 👉 URL Validator
export const urlValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^https?:\/\/[^\s$.?#].\S*$/
  
  return re.test(String(value)) || 'URL tidak Valid'
}

export const minimumNumberValidator = (value, min) => {
  if (isEmpty(value))
    return true
  
  return Number(value) >= min || `field ini harus berisi angka minimal ${min}`
}

export const minimumFormattedNumberValidator = (value, min = 1) => {
  if (!value || value.toString().trim() === '') {
    return `field ini wajib diisi dan harus berupa angka minimal ${min}`
  }

  // Hapus titik dan koma sebagai pemisah ribuan
  const cleaned = value.toString().replace(/[.,]/g, '')

  const num = Number(cleaned)

  if (isNaN(num) || num < min) {
    // console.log.log(num)
    // console.log.log(num > min, isNan(num))
    
    return `field ini harus berisi angka minimal ${min}`
    
  }

  return true
}

// 👉 Length Validator
export const lengthValidator = (value, length) => {
  if (isEmpty(value))
    return true
  
  return String(value).length === length || `"field ini harus berisi minimal ${length} karakter."`
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = value => {
  if (isEmpty(value))
    return true
  const valueAsString = String(value)
  
  return /^[\w-]*$/.test(valueAsString) || 'semua karakter tidak valid'
}
