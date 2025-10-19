const { PermissionsBitField: { Flags }, userMention, roleMention, ComponentType } = require('discord.js');
const UserModel = require('../../../Schema/User');

module.exports = {
    name: 'rollog',
    aliases: ['rl', 'rlog', 'rol-log', 'rolelog'],
    category: 'Auth',

    execute: async (client, message, args, ertu, embed) => {
        if (!message.member.permissions.has(Flags.Administrator) && !ertu.auth.some(x => message.member.roles.cache.has(x)))
            return message.reply({ content: 'Yetkin yok.' });

        const types = {
            'add': findEmoji(client, 'ertuUp') || '➕',
            'remove': findEmoji(client, 'ertuDown') || '➖',
        };

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!member) return client.embed(message, 'Geçerli bir üye belirtmelisiniz.');

        const document = await UserModel.findOne({ id: member.id });
        if (!document || !document.roleLogs.length) return message.reply({ content: 'Bu üyenin rol geçmişi bulunmamakta.' });

        let page = 1;
        const totalPages = Math.ceil(document.roleLogs.length / 10);
        const datas = document.roleLogs.reverse().map(d =>
            `${d.staff ? userMention(d.staff) : 'Bulunamadı.'} (${types[d.type]} | ${global.functions.date(d.date)}): ${d.roles.map(r => roleMention(r)).join(', ')}`
        );

        const question = await message.channel.send({
            embeds: [
                embed.setDescription(datas.slice(0, 10).join('\n')).setFooter({
                    text: `${document.roleLogs.length} rol değişim kaydı bulundu.`
                })
            ],
            components: [global.functions.getButton(page, totalPages)],
        });

        if (10 >= document.roleLogs.length) return;

        const filter = (i) => i.user.id === message.author.id && i.isButton();
        const collector = question.createMessageComponentCollector({
            filter,
            time: 1000 * 60 * 5,
            componentType: ComponentType.Button,
        });

        collector.on('collect', async (i) => {
            i.deferUpdate();

            if (i.customId === 'first') page = 1;
            if (i.customId === 'previous') page -= 1;
            if (i.customId === 'next') page += 1;
            if (i.customId === 'last') page = totalPages;

            question.edit({
                embeds: [
                    embed.setDescription(datas.slice(page === 1 ? 0 : page * 10 - 10, page * 10).join('\n')),
                ],
                components: [global.functions.getButton(page, totalPages)],
            });
        });
    }
}

function findEmoji(client, name) {
    return client.emojis.cache.find(emoji => emoji.name === name);
}