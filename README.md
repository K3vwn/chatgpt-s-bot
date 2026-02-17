# Bot de Discord multifuncional (JavaScript)

Este proyecto es una base **lista para usar** de un bot de Discord hecho en **JavaScript** con `discord.js`, pensado para que puedas correrlo en:

- GitHub + tu PC (Visual Studio Code)
- Replit

## ✅ Qué incluye

Comandos variados para empezar fuerte:

- **Utilidad:** `/ping`, `/help`, `/server`, `/user`, `/avatar`
- **Diversión:** `/dice`, `/coin`, `/8ball`, `/choose`
- **Moderación:** `/clear`, `/kick`, `/ban`

> Puedes agregar más comandos fácilmente editando `src/commands.js`.

---

## 1) Requisitos

- Node.js 18 o superior
- Una aplicación de Discord con bot creado en el [Discord Developer Portal](https://discord.com/developers/applications)

Activa en tu bot:
- **MESSAGE CONTENT INTENT**
- **SERVER MEMBERS INTENT**

---

## 2) Instalación local (VS Code)

```bash
git clone <tu-repo>
cd chatgpt-s-bot
npm install
cp .env.example .env
```

Completa `.env`:

```env
DISCORD_TOKEN=tu_token_del_bot
CLIENT_ID=tu_client_id
GUILD_ID=opcional_para_registro_rapido_en_un_servidor
```

Inicia el bot:

```bash
npm run dev
```

---

## 3) Invitar el bot a tu servidor

Crea la URL con:

- `client_id`: tu `CLIENT_ID`
- `scope`: `bot applications.commands`
- permisos según necesites (por ejemplo moderación)

Ejemplo base:

```txt
https://discord.com/oauth2/authorize?client_id=TU_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

---

## 4) Uso en Replit

1. Crea un Repl de Node.js.
2. Sube estos archivos o conéctalo a tu repo de GitHub.
3. En **Secrets** agrega `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID` (opcional).
4. Ejecuta `npm install` y luego `npm start`.

---

## 5) Personalización rápida

- Los comandos están en `src/commands.js`.
- El arranque y registro de comandos está en `src/index.js`.
- Si pones `GUILD_ID`, los slash commands se registran al instante en ese servidor (ideal para pruebas).
- Si no pones `GUILD_ID`, se registran globalmente (puede tardar más en verse).

---

## 6) Siguiente nivel (ideas)

- Sistema de tickets
- Música
- Economía/monedas
- Niveles XP
- Logs avanzados
- IA/chat con memoria
- Dashboard web

Si quieres, en el siguiente paso te puedo generar una versión **aún más grande** con estructura por carpetas (`commands/`, `events/`, `services/`) y base de datos.
