export function parseExpenseInput(input) {
  // Matndan (Masalan: "Kofe 15000" yoki "15000 kofe") raqam va matnni ajratish
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Raqamlarni topamiz (faqat so'z sifatida kelsa: "taxi 2" to'g'ri, "tax2i" noto'g'ri)
  // Bu regex raqamlarni qidiradi va ular harf bilan yopishib qolmaganini tekshiradi
  // \b (word boundary) orqali raqamlar harfga yopishib qolmaganligini ta'minlaymiz
  const amountPattern = /\b\d+(?:[\s,.]\d+)*\b/g;
  const matches = [...trimmed.matchAll(amountPattern)];
  
  if (matches.length === 0) return null;

  // Bir nechta raqam bo'lsa, eng ko'p raqamli bo'lganini (eng katta ehtimolli summa) tanlaymiz
  let bestMatch = null;
  let maxDigits = 0;

  for (const match of matches) {
    const raw = match[0];
    const clean = raw.replace(/[^\d]/g, '');
    if (clean.length > 0 && clean.length >= maxDigits) {
      maxDigits = clean.length;
      bestMatch = {
        raw,
        amount: parseInt(clean, 10),
        index: match.index
      };
    }
  }

  if (!bestMatch) return null;

  const { raw, amount, index } = bestMatch;

  // Nomini ajratib olamiz (topilgan summani matndan aniq o'rnidan qirqib tashlash orqali)
  const prefix = trimmed.substring(0, index);
  const suffix = trimmed.substring(index + raw.length);
  let name = (prefix + " " + suffix).trim().replace(/\s+/g, ' ');

  // Agar ism bo'sh bo'lsa (faqat raqam kiritgan bo'lsa), "Xarajat" deb nomlaymiz
  if (!name || /^[\s,.]+$/.test(name)) {
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
