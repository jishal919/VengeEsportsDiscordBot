const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'send-dm',
    description: 'Send a direct message',
    execute: async (interaction, getFlagsAndData, client) => {
        let { sendDMCmd, adminRoleIds } = getFlagsAndData();
        const hasAdminRole = interaction.member.roles.cache.some(role => adminRoleIds.includes(role.id));

        if (!sendDMCmd) {
            await interaction.reply({ content: '**This command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
            return;
        }

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
            const embed = new MessageEmbed()
                .setTitle('Message from Venge Esports Staff Team')
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
    },
};

