import pkg from 'discord.js';
const { Client, GatewayIntentBits, MessageActionRow, MessageButton, MessageEmbed,EmbedBuilder} = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({
    path: path.resolve(__dirname, '.env')
});

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
    ]
});

function getFlagsAndData() {
    try {
        // Read the content of the file synchronously
        const data = fs.readFileSync('./config.json', 'utf8');
        const config = JSON.parse(data);

        return {
            announceCmd: config.announceCmd,
            sendImageCmd: config.sendImageCmd,
            applicationCmd: config.applicationCmd,
            applicationChannelId: config.applicationChannelId,
            suggestionCmd: config.suggestionCmd,
            suggestionChannelId: config.suggestionChannelId,
            sendDMCmd: config.sendDMCmd,
            adminRoleIds: config.adminRoleIds
        };
    } catch (error) {
        console.error('Error reading config file:', error);
        // Return default values or handle the error as needed
        return {
            announceCmd: true,
            sendImageCmd: true,
            applicationCmd: true,
            applicationChannelId:"",
            suggestionCmd: true,
            suggestionChannelId:"",
            sendDMCmd:true,
            adminRoleIds:[]
        };
    }
}

client.on("ready", () => {
    console.log(`${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        activities: [{
            name: "Tournaments loading...",
            type: "WATCHING"
        }]
    });
});



// commands start with +


client.on("messageCreate", async (message) => {
    let {announceCmd,sendImageCmd,applicationCmd, applicationChannelId ,suggestionCmd, suggestionChannelId, sendDMCmd, adminRoleIds} = getFlagsAndData();
    
    const prefix = "+";

    if (message.author.bot) return; 
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    
    const cmd = args[0].toLowerCase();
    
    if (cmd === "send-image") {
        if (message.deletable) await message.delete();
        if(sendImageCmd) {
            try {
                // Extract the image URL from the command arguments
                const imageUrl = args[1];

                // Check if an image URL was provided
                if (!imageUrl) {
                    await message.channel.send("Please provide a valid image URL.");
                    return;
                }
                try {
                    // Create the embedded message with the image
                    const embed = new EmbedBuilder()
                        .setColor('#FBE331')
                        .setImage(imageUrl);

                    // Send the embed with the image
                    await message.channel.send({ embeds: [embed] });
                } catch (error) {
                    console.error("An error occurred while sending the image embed:", error);
                    await message.channel.send("An error occurred while sending the image embed. Please try again later.");
                }
            } catch (error) {
                console.error('Error handling interaction:', error);
                }
            
        } else {
            await message.channel.send("**This command is currently on hold.\nPlease attempt it again later.**");
            return;
        }
    }

    if (cmd === "ping") {
        const msg = await message.channel.send(`Pinging...`);
        msg.edit(`Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`);
    }

});

//  Slash commands

client.on('interactionCreate', async (interaction) => {
    let { announceCmd, sendImageCmd, applicationCmd, applicationChannelId, suggestionCmd, suggestionChannelId, sendDMCmd, adminRoleIds} = getFlagsAndData();
    const hasAdminRole = interaction.member.roles.cache.some(role => adminRoleIds.includes(role.id));
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'announce') {
        if(announceCmd) {
        try {
            
                
            if (!hasAdminRole) {
                await interaction.reply({ content: '**You must be an administrator to perform this action.**', ephemeral: true });
                return;
            }
            
            
            // Check if the command was triggered in a DM
            if (!interaction.guildId) {
                await interaction.reply({ content: 'This command does not work in DMs.', ephemeral: true });
                return;
            }

            // Fetch parameters from the interaction
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');
            const image = interaction.options.getString('thumbnail');
            const title = interaction.options.getString('title');

            // Create the embedded message
            const embed = new EmbedBuilder()
                .setDescription(message)
                .setColor('#FBE331');

            if (image) {
                embed.setThumbnail(image);
            }

            if (title) {
                embed.setTitle(title.toUpperCase());
            }

            // Send the announcement message to the specified channel
            await channel.send({ embeds: [embed] });

            // Reply to the interaction indicating success
            await interaction.reply({ content: `**Announcement sent to ${channel} successfully!**`, ephemeral: true });
        } catch (error) {
            console.error('Error handling interaction:', error);

            // Ensure only one reply is sent even in case of errors
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while sending the announcement.', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.editReply({ content: 'An error occurred while sending the announcement.', ephemeral: true });
            }
        }
        } else {
            await interaction.reply({ content: '**This command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
            return
        }
    } else if (interaction.commandName === 'application') {
        if(applicationCmd) {
            try {
                if (!interaction.guildId) {
                    await interaction.reply({ content: 'This command does not work in DMs. Please use this command in https://discord.com/channels/1143904730939129956/1245255359199973446'});
                    return;
                }

                const name = interaction.options.getString('name');
                const age = interaction.options.getInteger('age');
                const applyingFor = interaction.options.getString('applying_for');
                const pastExperiences = interaction.options.getString('past_experiences');
                const aspects = interaction.options.getString('aspects');
                const whyYou = interaction.options.getString('why_you');
                await interaction.deferReply({ ephemeral: true });
                const embed = new EmbedBuilder()
                    .setTitle('Team Application')
                    .setDescription('Applications for Helper or Staff.')
                    .addFields(
                        { name: '**\nWhat is your name? (you can use your nickname, if you don\'t feel comfortable telling us)**', value: name, inline: false },
                        { name: '**\nWhat is your age?**', value: age.toString(), inline: false },
                        { name: '**\nWhat is your Discord username?**', value: interaction.member.user.username.toString(), inline: false },
                        { name: '**\nWhat type of moderation-area are you applying for?**', value: applyingFor, inline: false },
                        { name: '**\nHave you had past experience as Tournament Staff? (if yes, where?)**', value: pastExperiences, inline: false },
                        { name: '**\nName two good and two bad aspects about yourself.**', value: aspects, inline: false },
                        { name: '**\nWhy should we choose you?**', value: whyYou, inline: false }
                    )
                    .setThumbnail('https://media.discordapp.net/attachments/727233875679379547/727245557847949312/Venge_Esports.png?ex=66578334&is=665631b4&hm=60915decdb12c5b2f6c012587ae26e1b0ef8b2a541a09da045d1e336d3c6b47a&=&format=webp&quality=lossless&width=657&height=657') 
                    .setFooter({ text: new Date().toLocaleString() })
                    .setColor('#FBE331');

                // Fetch the channel using the client
                const channel = client.channels.cache.get(applicationChannelId);
                if (!channel) {
                    return interaction.editReply({ content: 'Channel not found!', ephemeral: true });
                }

                const sentMessage = await channel.send({ embeds: [embed] });
                
                // Add reactions to the message
                await sentMessage.react('✅'); // Add thumbs up reaction
                await sentMessage.react('❌'); // Add thumbs down reaction

                await interaction.editReply({ content: 'Your application has been submitted successfully!', ephemeral: true });
                
            } catch (error) {
                console.error('Error handling interaction:', error);
            }
        } else {
            await interaction.reply({ content: '**The command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
        }
    }
     else if(interaction.commandName === 'suggestion') {
        if(suggestionCmd) {
            try {
                const message = interaction.options.getString('message');
                
                if (interaction.member && interaction.member.user) {
                    
                } else {
                    
                    return interaction.reply({ content: 'This command does not work in DMs. Please use this command in https://discord.com/channels/1143904730939129956/1245255359199973446'});
                }

                // Defer the reply to give us more time to process
                await interaction.deferReply({ ephemeral: true });

                // Fetch the channel using the client
                const channel = client.channels.cache.get(suggestionChannelId);
                
                if (!channel) {
                    return interaction.editReply({ content: 'Channel not found!', ephemeral: true });
                }

                // Send the suggestion message to the specified channel
                
                const sentMessage = await channel.send("```Suggestion: "+ message + '\nBy: @' + interaction.member.user.username.toString() + "```\n");

                // Reply to the interaction
                await interaction.editReply({ content: 'Your suggestion has been sent, thank you for supporting us! ✅', ephemeral: true });
            } catch (error) {
                console.error('Error handling interaction:', error);
            }
        } else {
            await interaction.reply({ content: '**This command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
        }
    }
     else if (interaction.commandName === 'send-dm') {
            if(sendDMCmd) {
                try {
                
                    if (!hasAdminRole) {
                        await interaction.reply({ content: '**You must be an administrator to perform this action.**', ephemeral: true });
                        return;
                    }
                    const rawUsername = interaction.options.getString('username');
                    const userId = rawUsername.replace(/[<@!>]/g, ''); // Remove <@!> characters to get the user ID
                    const user = client.users.cache.get(userId);
                    const messageContent = interaction.options.getString('message');

                    if (!user) {
                        await interaction.reply({ content: 'User not found!', ephemeral: true });
                        return;
                    }

                    try {
                        // Create an embed message
                        const embed = new EmbedBuilder()
                            .setTitle('Message form Venge Esports Staff Team')
                            .setDescription(messageContent)
                            .setColor('#FBE331') // Yellow color
                            .setTimestamp(); // Current timestamp

                        // Send the embed as a direct message to the user
                        await user.send({ embeds: [embed] });

                        // Reply to the interaction indicating success
                        await interaction.reply({ content: `Message sent to ${user.username} successfully!`, ephemeral: true });
                    } catch (error) {
                        console.error('Failed to send message:', error);
                        await interaction.reply({ content: 'Failed to send message. Please try again later.', ephemeral: true });
                    }
                    
                } catch (error) {
                    console.error('Error handling interaction:', error);
                    }
                } else {
                    await interaction.reply({ content: '**This command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
                    return
                }
        }



});

client.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome')

    welcomeChannel.send(`Hey ${member}, welcome to Venge Esports! To start of, please read <#726527698083643482>. After that, get your roles in <#726528251563999234>.
Feel free to go threw the Discord-Server and use the different public channels, if wanted!`);
    member.roles.add("726515037853974528");
})

client.login(process.env.DISCORD_TOKEN);


