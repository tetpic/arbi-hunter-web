export default function copyToClipboard(text: string):boolean {
  const el = document.createElement('textarea')  // Создаем элемент textarea
  el.value = text  // Присваиваем указанный текст элементу textarea
  document.body.appendChild(el)  // Добавляем элемент в DOM
  el.select()  // Выделяем текст в элементе
  el.setSelectionRange(0, 9999)  // Выделяем текст в элементе
  document.execCommand('copy')  // Копируем выделенный текст в буфер обмена
  navigator.clipboard?.writeText(el.value)
  document.body.removeChild(el) 
  return true // Убираем элемент из DOM
}