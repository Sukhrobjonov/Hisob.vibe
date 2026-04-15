export function parseExpenseInput(input) {
  // Matndan (Masalan: "Kofe 15000" yoki "15000 kofe") raqam va matnni ajratish
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Raqamlarni topamiz (bo'shliqlar bilan yozilgan bo'lishi mumkin: 15 000)
  const numberMatches = trimmed.match(/\d[\d\s]*/g);
  
  if (!numberMatches) return null;

  // Eng uzun raqamni summa deb olamiz yoki birinchisini. 
  // Odatda bitta summa bo'ladi
  let amountStr = '';
  let maxLen = 0;
  for (const match of numberMatches) {
    const cleanMatch = match.replace(/\s/g, '');
    if (cleanMatch.length > maxLen) {
      maxLen = cleanMatch.length;
      amountStr = cleanMatch;
    }
  }

  const amount = parseInt(amountStr, 10);
  if (isNaN(amount)) return null;

  // Nomini ajratib olamiz (faqat topilgan birinchi raqamni olib tashlash orqali)
  // Ammo raqam har xil joyda bo'lishi mumkin. Eng oddiy yo'l - hamma raqamlarni olib tashlash.
  let name = trimmed.replace(new RegExp(amountStr.split('').join('\\s*')), '').replace(/\s+/g, ' ').trim();

  // Agar ism bo'sh bo'lsa (faqat raqam kiritgan bo'lsa), Xarajat deb nomlaymiz
  if (!name) {
    name = "Xarajat";
  } else {
    // Birinchi harfni katta qilish
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }

  return {
    name,
    amount,
    date: Date.now()
  };
}
