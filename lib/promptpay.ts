export function generatePromptPayPayload(phoneOrId: string, amount: number, type: "mobile" | "nationalId" = "mobile"): string {
  let idValue: string;
  let idType: string;
  if (type === "mobile") {
    const cleaned = phoneOrId.replace(/^0+/, "");
    idValue = `66${cleaned}`;
    idType = "01";
  } else {
    idValue = phoneOrId;
    idType = "02";
  }

  const idLen = String(idValue.length).padStart(2, "0");
  const merchantAccountInfo = `0016A0000006770101120102${idType}02${idLen}${idValue}`;
  const merchantLen = String(merchantAccountInfo.length).padStart(2, "0");

  const amountStr = amount.toFixed(2);
  const amountLen = String(amountStr.length).padStart(2, "0");

  const payloadWithoutCrc = `00020101021129${merchantLen}${merchantAccountInfo}530376454${amountLen}${amountStr}5802TH6304`;
  const crc = crc16(payloadWithoutCrc).toString(16).toUpperCase().padStart(4, "0");
  return `${payloadWithoutCrc}${crc}`;
}

function crc16(data: string): number {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc;
}
