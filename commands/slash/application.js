const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'application',
    description: 'Application command',
    execute: async (interaction, getFlagsAndData, client) => {
        let { applicationCmd, applicationChannelId } = getFlagsAndData();
        
        if (!applicationCmd) {
            await interaction.reply({ content: '**The command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
            return;
        }

        if (!interaction.guildId) {
            await interaction.reply({ content: 'This command does not work in DMs. Please use this command in https://discord.com/channels/1143904730939129956/1245255359199973446' });
            return;
        }

        const name = interaction.options.getString('name');
        const age = interaction.options.getInteger('age');
        const applyingFor = interaction.options.getString('applying_for');
        const pastExperiences = interaction.options.getString('past_experiences');
        const aspects = interaction.options.getString('aspects');
        const whyYou = interaction.options.getString('why_you');

        await interaction.deferReply({ ephemeral: true });

        const embed = new MessageEmbed()
            .setTitle('Team Application')
            .setDescription('Applications for Helper or Staff.')
            .addFields(
                { name: '**\nWhat is your name? (you can use your nickname, if you don\'t feel comfortable telling us)**', value: name, inline: false },
                { name: '**\nWhat is your age?**', value: age.toString(), inline: false },
                { name: '**\nWhat is your Discord username?**', value: interaction.member.user.username, inline: false },
                { name: '**\nWhat type of moderation-area are you applying for?**', value: applyingFor, inline: false },
                { name: '**\nHave you had past experience as Tournament Staff? (if yes, where?)**', value: pastExperiences, inline: false },
                { name: '**\nName two good and two bad aspects about yourself.**', value: aspects, inline: false },
                { name: '**\nWhy should we choose you?**', value: whyYou, inline: false }
            )
            .setThumbnail('https://media.discordapp.net/attachments/727233875679379547/727245557847949312/Venge_Esports.png?ex=66578334&is=665631b4&hm=60915decdb12c5b2f6c012587ae26e1b0ef8b2a541a09da045d1e336d3c6b47a&=&format=webp&quality=lossless&width=657&height=657') 
            .setFooter(new Date().toLocaleString()) // Ensure footer text is a string
            .setColor('#FBE331');

        try {
            const channel = client.channels.cache.get(applicationChannelId);
            if (!channel) {
                await interaction.editReply({ content: 'Channel not found!', ephemeral: true });
                return;
            }

            const sentMessage = await channel.send({ embeds: [embed] });
            await sentMessage.react('✅');
            await sentMessage.react('❌');

            await interaction.editReply({ content: 'Your application has been submitted successfully!', ephemeral: true });
        } catch (error) {
            console.error('Error handling interaction:', error);

            // Ensure only one reply is sent even in case of errors
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while submitting the application.', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.editReply({ content: 'An error occurred while submitting the application.', ephemeral: true });
            }
        }
    },
};

