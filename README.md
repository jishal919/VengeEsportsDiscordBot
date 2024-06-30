# Venge Esports Discord Bot

Welcome to the Venge Esports Discord Bot repository! This bot is designed to manage and enhance your Discord server with various commands and functionalities, such as handling applications, suggestions, and more.

## Features

- **Application Handling**: Users can apply for roles within the server.
- **Suggestions**: Users can submit suggestions.
- **Announcement Management**: Send announcements to a specified channel.

## Available Commands

### Regular Commands

- `+ping` - Check the bot's ping status.
- `+send-image` - Send an embed message with an image.

### Slash Commands

- `/announce` - Send announcements to a specified channel.
- `/application` - Handle user applications for roles within the server.
- `/send-dm` - Send a direct message to a user.
- `/suggestion` - Submit a suggestion to a specified channel.



1. Create a `.env` file in the root directory and add your Discord bot token:
    ```
    DISCORD_TOKEN=your-discord-bot-token
    ```

4. Create a `config.json` file in the root directory and add your configuration settings. **Warning: Ensure you add the correct data in the `config.json` file as per your server's requirements.**
    ```json
    {
        "announceCmd": true,
        "sendImageCmd": false,
        "applicationCmd": true,
        "applicationChannelId": "1245281405324365875",
        "suggestionCmd": true,
        "suggestionChannelId": "1244722664958984315",
        "sendDMCmd": true,
        "adminRoleIds": ["1197890254586261534", "1187039660019556452", "1187370848114450522"]
    }
    ```

### config.json

```
announceCmd: Enables or disables the announcement command. (true or false)
sendImageCmd: Enables or disables the send image command. (true or false)
applicationCmd: Enables or disables the application command. (true or false)
applicationChannelId: The ID of the channel where applications should be sent.
suggestionCmd: Enables or disables the suggestion command. (true or false)
suggestionChannelId: The ID of the channel where suggestions should be sent.
sendDMCmd: Enables or disables the send direct message command. (true or false)
adminRoleIds: A list of role IDs that are considered administrators or users who need to use commands like /announce and /send-dm. (list datatype) 
```

