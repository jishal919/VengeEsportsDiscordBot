const Discord = require("discord.js");
const { Client, Collection , Intents} = require("discord.js");
const { config } = require("dotenv");
const path = require('path');
const fs = require('fs');

config({
    path: __dirname + "/.env"
});

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        // Add other necessary intents as per your bot's functionality
    ],
});

client.commands = new Collection();

// Load regular command files
const regularCommandFiles = fs.readdirSync('./commands/regular').filter(file => file.endsWith('.js'));

for (const file of regularCommandFiles) {
    const command = require(`./commands/regular/${file}`);
    client.commands.set(command.name, command);
}

// Load slash command files
const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
    const command = require(`./commands/slash/${file}`);
    client.commands.set(command.name, command);
}

config({
    path: path.join(__dirname, '/.env'),
});

client.once('ready', () => {
    console.log(`${client.user.username} is now online!`);

    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'Tournaments',
            type: 'WATCHING',
        },
    });
});

client.on('messageCreate', async message => {
    const prefix = '+';
    console.log(`Received message: ${message.content}`);
    if (message.author.bot) return; 
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    
    const cmd = args[0].toLowerCase();

    const command = client.commands.get(cmd);
    if (!command) return;
    console.log(args);
    try {
        await command.execute(message, args, getFlagsAndData, client);
    } catch (error) {
        console.error('Error executing command:', error);
        await message.reply('There was an error while executing this command.');
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, getFlagsAndData, client);
    } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
    }
});

function getFlagsAndData() {
    try {
        const configPath = path.resolve(__dirname, './config.json');
        const data = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(data);

        return {
            announceCmd: config.announceCmd,
            sendImageCmd: config.sendImageCmd,
            applicationCmd: config.applicationCmd,
            applicationChannelId: config.applicationChannelId,
            suggestionCmd: config.suggestionCmd,
            suggestionChannelId: config.suggestionChannelId,
            sendDMCmd: config.sendDMCmd,
            adminRoleIds: config.adminRoleIds,
        };
    } catch (error) {
        console.error('Error reading config file:', error);
        return {
            announceCmd: true,
            sendImageCmd: true,
            applicationCmd: true,
            applicationChannelId: '',
            suggestionCmd: true,
            suggestionChannelId: '',
            sendDMCmd: true,
            adminRoleIds: [],
        };
    }
}

client.login(process.env.TOKEN);