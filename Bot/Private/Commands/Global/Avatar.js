const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    category: 'General',

    execute: async (client, message, args, ertu, embed) => {
        const channel = message.guild.channels.cache.get(ertu.botCommandChannel);
        if (message.channel.name !== channel?.name && !message.member.permissions.has(PermissionsBitField.Flags.Administrator))
             return message.reply({ content: `Bu komut sadece ${channel} kanalında kullanılabilir.` });

        const member = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null) || message.author;
        if (!member) return message.channel.send({ content: 'Bir kullanıcı belirtmelisin.' });

        message.channel.send({
            embeds: [
                new EmbedBuilder({
                    author: { name: `${member.username}`, iconURL: member.displayAvatarURL({ dynamic: true }) },
                    image: { url: member.displayAvatarURL({ dynamic: true, size: 4096 }) },
                })
            ]
        });
    }
}