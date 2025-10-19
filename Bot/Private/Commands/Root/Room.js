const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } = require('discord.js');

module.exports = {
    name: 'özeloda',
    aliases: ['ozeloda'],
    category: 'Root',

    execute: async (client, message, args) => {
        if (!global.system.ownerID.includes(message.author.id)) return;

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('changeName')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1279921117838184529'),
                new ButtonBuilder()
                    .setCustomId('changeLimit')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1279920708117331998'),
                new ButtonBuilder()
                    .setCustomId('lockOrUnlock')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1279921052872609864'),
                new ButtonBuilder()
                    .setCustomId('visibleOrInvisible')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1279921134040645694'),
                new ButtonBuilder()
                    .setCustomId('addOrRemove')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1279922837758545931'),
            );

        const embed = new EmbedBuilder({
            title: 'Oda Yönetim Paneli',
            description: [
                `Özel odanızı yönetmek için aşağıdaki butonları kullanabilirsiniz.\n`,
                `${inlineCode('Odanın İsmini Değiştir   :')} ${findEmoji(client, 'ertuChange')}`,
                `${inlineCode('Odanın Limitini Değiştir :')} ${findEmoji(client, 'ertuLimit')}`,
                `${inlineCode('Odayı Kilitle/Kilidi Aç  :')} ${findEmoji(client, 'ertuLock')}`,
                `${inlineCode('Odayı Gizle/Gizliyi Aç   :')} ${findEmoji(client, 'ertuVisible')}`,
                `${inlineCode('Odaya Kişi Ekle/Çıkar    :')} ${findEmoji(client, 'ertuMember')}`
            ].join('\n'),
            footer: { text: 'made by ertu ❤️', iconURL: message.guild.iconURL({ dynamic: true }) }
        })

        message.channel.send({
            embeds: [embed],
            components: [buttonRow]
        });

    }
}

function findEmoji(client, name) {
    return client.emojis.cache.find(emoji => emoji.name === name);
}