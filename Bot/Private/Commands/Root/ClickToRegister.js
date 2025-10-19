const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Settings = require('../../../Schema/Settings')

module.exports = {
    name: 'kayıtpanel',
    aliases: [],
    category: 'Root',

    execute: async (client, message, args) => {
        if (!global.system.ownerID.includes(message.author.id)) return;

        const document = await Settings.findOne({ id: message.guild.id });
        if (!document) return;

        if (document.genderSystem) {
            const row = new ActionRowBuilder({
                components: [
                    new ButtonBuilder()
                        .setCustomId('man')
                        .setLabel(`- (${document?.manClickCount || 0})`)
                        .setEmoji('1420101314901311500')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('woman')
                        .setLabel(`- (${document?.womanClickCount || 0})`)
                        .setEmoji('1420101480039583794')
                        .setStyle(ButtonStyle.Danger)
                ]
            })

            message.channel.send({ content: 'Cinsiyetini seçmek için aşağıdaki butona tıkla!\n\n**Not:** Eğer cinsiyeti bilerek yanlış seçerseniz ban yersiniz.', components: [row] });
        } else {
            const row = new ActionRowBuilder({
                components: [
                    new ButtonBuilder()
                        .setCustomId('register')
                        .setLabel(`Kayıt Ol - ${document.clickCount || 0}`)
                        .setStyle(ButtonStyle.Secondary)
                ]
            })

            message.channel.send({ content: 'Kayıt olmak için aşağıdaki butona tıkla!', components: [row] });
        }
    }
}