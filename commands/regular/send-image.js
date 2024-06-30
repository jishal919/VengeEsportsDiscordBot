const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'send-image',
    description: 'Send an image embed',
    execute: async (message, args, getFlagsAndData, client) => {
        try {
            let { adminRoleIds } = getFlagsAndData();
            const hasAdminRole = message.member.roles.cache.some(role => adminRoleIds.includes(role.id));
            
            if (!hasAdminRole) {
                await message.author.send("You do not have permission to use this command.");
                return;
            }
            
            const imageUrl = args[1];
            if (!imageUrl) {
                await message.channel.send("Please provide a valid image URL.");
                return;
            }

            
            const embed = new MessageEmbed()
                .setColor('#FBE331')
                .setImage(imageUrl);

            await message.channel.send({ embeds: [embed] });

            if (message.deletable) await message.delete();  // Delete the message after sending the reply
        } catch (error) {
            console.error("An error occurred while sending the image embed:", error);
            await message.channel.send("An error occurred while sending the image. Please try again later.");
        }
    },
};

