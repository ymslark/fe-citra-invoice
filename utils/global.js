export function getDate(){
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = date.getDate()
  const year = date.getFullYear()
  
  return `${year}-${month}-${day}`
}
