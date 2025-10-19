const { PermissionsBitField: { Flags } } = require('discord.js');

module.exports = {
    name: 'ban',
    aliases: ['yasakla', 'sg', 'yargı'],
    category: 'Auth',

    execute: async (client, message, args, ertu) => {
        const channel = message.guild.channels.cache.get(ertu.botCommandChannel);
        try {
            if (!message.member.permissions.has(Flags.Administrator) && !ertu?.banAuth?.some(x => message.member.roles.cache.has(x))) {
                return message.reply('Bu komutu kullanmak için yetkin yok.');
            }

            if (!args[0]) {
                return message.reply('Bir kullanıcı belirtmelisin.');
            }

            const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

            if (!member) {
                return message.reply('Geçerli bir kullanıcı belirtmelisin.');
            }

            if (member.id === message.author.id) {
                return message.reply('Kendini banlayamazsın.');
            }

            if (member.id === message.guild.ownerId) {
                return message.reply('Sunucu sahibini banlayamazsın.');
            }

            if (member.roles.highest.position >= message.member.roles.highest.position) {
                return message.reply('Bu kullanıcıyı banlayamazsın - yetkisi senden yüksek veya aynı seviyede.');
            }

            if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
                return message.reply('Bu kullanıcıyı banlayamam - yetkisi benden yüksek.');
            }

            const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';

            await member.ban({ reason });

            const logChannel = message.guild.channels.cache.find(x => x.name === 'ban-log');
            if (logChannel) {
                await logChannel.send({
                    embeds: new EmbedBuilder({
                        title: 'Kullanıcı Banlandı',
                        description: `${member} (${member.user.tag}) banlandı.`,
                        fields: [
                            { name: 'Banlayan', value: message.author.tag, inline: true },
                            { name: 'Sebep', value: reason, inline: true },
                            { name: 'Tarih', value: new Date().toLocaleString(), inline: true }
                        ],
                        color: 0xff0000,
                        footer: { text: 'Ertu was here ❤️' }
                    })
                });
            }

            return message.reply(`${member} (${member.user.tag}) başarıyla banlandı. Sebep: ${reason}`);

        } catch (error) {
            console.error('Ban error:', error);
            return message.reply('Kullanıcı banlanırken bir hata oluştu.');
        }
    }
};