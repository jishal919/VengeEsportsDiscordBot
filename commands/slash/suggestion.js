module.exports = {
    name: 'suggestion',
    description: 'Suggestion command',
    execute: async (interaction, getFlagsAndData, client) => {
        try {
            let { suggestionCmd, suggestionChannelId } = getFlagsAndData();
            if (!suggestionCmd) {
                await interaction.reply({ content: '**This command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
                return;
            }

            const message = interaction.options.getString('message');
            if (!interaction.guildId) {
                return interaction.reply({ content: 'This command does not work in DMs. Please use this command in https://discord.com/channels/1143904730939129956/1245255359199973446' });
            }

            await interaction.deferReply({ ephemeral: true });

            const channel = client.channels.cache.get(suggestionChannelId);
            if (!channel) {
                return interaction.editReply({ content: 'Channel not found!', ephemeral: true });
            }

            const sentMessage = await channel.send(`\`\`\`Suggestion: ${message}\nBy: @${interaction.member.user.username}\`\`\``);
            await interaction.editReply({ content: 'Your suggestion has been sent, thank you for supporting us! ✅', ephemeral: true });
        } catch (error) {
            console.error('An error occurred while processing the suggestion command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while processing your suggestion. Please try again later.', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.editReply({ content: 'An error occurred while processing your suggestion. Please try again later.', ephemeral: true });
            }
        }
    },
};
