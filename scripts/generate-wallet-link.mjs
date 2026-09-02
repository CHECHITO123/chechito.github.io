import fs from "node:fs";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";

const raw = process.env.GOOGLE_WALLET_CREDENTIALS;
if (!raw) throw new Error("Falta el secreto GOOGLE_WALLET_CREDENTIALS");

let credentials;
try {
  credentials = JSON.parse(raw);
} catch {
  throw new Error("GOOGLE_WALLET_CREDENTIALS no contiene un JSON válido");
}
if (!credentials.client_email || !credentials.private_key) {
  throw new Error("El JSON no es una clave válida de cuenta de servicio");
}

const issuerId = "3388000000023181264";
const classId = issuerId + ".mesa_viva_club";
const objectId = issuerId + ".mesa_viva_cliente_0001";
const cardUrl =
  "https://chechito123.github.io/chechito.github.io/mesa-viva-wallet/tarjeta/";

const claims = {
  iss: credentials.client_email,
  aud: "google",
  typ: "savetowallet",
  iat: Math.floor(Date.now() / 1000),
  origins: ["https://chechito123.github.io"],
  payload: {
    loyaltyObjects: [
      {
        id: objectId,
        classId,
        state: "active",
        accountName: "Cliente Mesa Viva",
        accountId: "MV-0001",
        loyaltyPoints: { label: "Visitas", balance: { string: "0" } },
        barcode: { type: "qrCode", value: "MV-0001", alternateText: "MV-0001" },
        linksModuleData: {
          uris: [
            {
              kind: "walletobjects#uri",
              uri: cardUrl,
              description: "Abrir tarjeta interactiva",
            },
          ],
        },
        textModulesData: [
          {
            header: "Club Mesa Viva",
            body: "Suma visitas y desbloquea recompensas en Mesa Viva.",
          },
        ],
      },
    ],
  },
};

const signedJwt = jwt.sign(claims, credentials.private_key, {
  algorithm: "RS256",
  keyid: credentials.private_key_id,
});
const walletUrl = "https://pay.google.com/gp/v/save/" + signedJwt;
const qr = await QRCode.toDataURL(walletUrl, {
  width: 900,
  margin: 2,
  errorCorrectionLevel: "M",
  color: { dark: "#19231d", light: "#ffffff" },
});

const js = [
  "// Generado automáticamente. No contiene la clave privada.",
  "window.MESA_VIVA_WALLET_URL = " + JSON.stringify(walletUrl) + ";",
  "window.MESA_VIVA_WALLET_QR = " + JSON.stringify(qr) + ";",
  "",
].join("\n");
fs.writeFileSync("mesa-viva-wallet/wallet-config.js", js, "utf8");
process.stdout.write("Enlace y QR de Google Wallet generados.\n");
