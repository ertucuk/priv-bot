const { PermissionsBitField: { Flags } } = require('discord.js');

module.exports = {
    name: 'vip',
    aliases: [],
    category: 'Auth',

    execute: async (client, message, args, ertu) => {
        if (!message.member.permissions.has(Flags.Administrator) && !ertu.auth.some(x => message.member.roles.cache.has(x)))
            return message.reply({ content: 'Yetkin yok.' });

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member)
            return message.reply({ content: 'Bir kullanıcı belirtmelisin.' });
        if (member.id === message.author.id)
            return message.reply({ content: 'Kendine vip rolü veremezsin.' });

        if (member.roles.cache.has(ertu.vipRole)) {
            member.roles.remove(ertu.vipRole);
            message.channel.send({ content: `${member} adlı kullanıcıdan vip rolü alındı!` });
        } else {
            member.roles.add(ertu.vipRole);
            message.channel.send({ content: `${member} adlı kullanıcıya vip rolü verildi!` });
        }
    }
}