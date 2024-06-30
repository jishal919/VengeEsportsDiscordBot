const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'announce',
    description: 'Announce command',
    execute: async (interaction, getFlagsAndData, client) => {
        try {
            let { announceCmd, adminRoleIds } = getFlagsAndData();
            const hasAdminRole = interaction.member.roles.cache.some(role => adminRoleIds.includes(role.id));
            if (!announceCmd) {
                await interaction.reply({ content: '**This command is currently on hold.\nPlease attempt it again later.**', ephemeral: true });
                return;
            }

            if (!hasAdminRole) {
                await interaction.reply({ content: '**You must be an administrator to perform this action.**', ephemeral: true });
                return;
            }

            if (!interaction.guildId) {
                await interaction.reply({ content: 'This command does not work in DMs.', ephemeral: true });
                return;
            }

            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');
            const image = interaction.options.getString('thumbnail');
            const title = interaction.options.getString('title');

            const embed = new MessageEmbed()
                .setDescription(message)
                .setColor('#FBE331');

            if (image) {
                embed.setThumbnail(image);
            }

            if (title) {
                embed.setTitle(title.toUpperCase());
            }

            
                await channel.send({ embeds: [embed] });
                await interaction.reply({ content: `**Announcement sent to ${channel} successfully!**`, ephemeral: true });
        } catch (error) {
            console.error('Error handling interaction:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while sending the announcement.', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.editReply({ content: 'An error occurred while sending the announcement.', ephemeral: true });
            }
        }
    },
};

