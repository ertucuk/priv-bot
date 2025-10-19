const { PermissionsBitField: { Flags }, EmbedBuilder, bold, inlineCode } = require('discord.js');

module.exports = {
    name: 'say',
    aliases: [],
    category: 'Auth',

    execute: async (client, message, args, ertu) => {
        if (!message.member.permissions.has(Flags.Administrator) && !ertu.auth.some(x => message.member.roles.cache.has(x)))
            return message.reply({ content: 'Yetkin yok.' });

        const totalMember = message.guild.memberCount;
        const onlineMember = message.guild.members.cache.filter(m => m.presence && m.presence.status !== 'offline').size
        const voiceMember = message.guild.members.cache.filter(m => m.voice.channel).size

        const embed = new EmbedBuilder({
            description: [
                `${inlineCode(' > ')} Sunucuda toplam ${bold(voiceMember)} kullanıcı ses kanallarında bulunuyor.`,
                `${inlineCode(' > ')} Sunucumuz da ${bold(totalMember)} üye bulunmakta. (${bold(onlineMember)} Aktif)`,
                `${inlineCode(' > ')} Toplamda ${bold(message.guild.premiumSubscriptionCount)} adet boost basılmış.`
            ].join('\n'),
        });

        message.channel.send({ embeds: [embed] });
    }
}