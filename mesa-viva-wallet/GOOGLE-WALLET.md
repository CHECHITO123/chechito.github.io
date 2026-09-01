# Activar Google Wallet en Mesa Viva

La web y el QR ya están preparados. Falta una única credencial segura de Google para firmar el pase.

1. En Google Cloud, habilita **Google Wallet API** y crea una cuenta de servicio llamada `mesa-viva-wallet`.
2. Crea una clave JSON para esa cuenta de servicio.
3. En Google Pay & Wallet Console > **Usuarios**, invita el correo de la cuenta de servicio con el rol **Desarrollador**.
4. En este repositorio, abre **Settings > Secrets and variables > Actions** y crea el secreto `GOOGLE_WALLET_CREDENTIALS`. Pega como valor todo el contenido del JSON.
5. Abre **Actions > Generar pase de Google Wallet > Run workflow**.

El workflow firma el JWT, genera el QR y actualiza `wallet-config.js`. La clave privada nunca se guarda en el código público.

Mientras la cuenta emisora siga en modo de demostración, el pase solo podrá añadirse desde cuentas administradoras, desarrolladoras o cuentas de prueba y mostrará **[TEST ONLY]**.
