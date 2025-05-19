# Telegram Rotation Monitoring Bot — Setup Guide

This bot monitors rotation announcements from [podval-arma.ru](https://podval-arma.ru) and sends a password once it's available.

## Requirements

- Node.js v16+
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- Your `REMEMBER_ME` cookie from `podval-arma.ru` (authenticated session)

## Installation

1. **Clone the repository** and install dependencies:

    ```bash
    npm install
    ```

2. **Create a `.env` file** in the project root:

    ```ini
    TG_BOT_TOKEN=<token>
    REMEMBER_WEB_COOKIE=<cookie_name>=<value>
    ```

3. **Run the bot**:

    ```bash
    node index.js
    ```

## Commands

- `/rotation <number>` — Start monitoring for a specific rotation number.
- `/stop` — Stop monitoring.
- `/ping` — Check if the bot is online.
- `/help` — Show command help.

## Example

```text
/rotation 13
