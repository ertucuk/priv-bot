const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits, codeBlock, EmbedBuilder, bold } = require('discord.js');
const Settings = require('../../../Schema/Settings');

const systemLabels = {
    autoRole: "Otomatik Kayıt",
    genderSystem: "Cinsiyetli Kayıt",
    linkGuard: "Link Engel"
};

module.exports = {
    name: 'setup',
    aliases: ['kur'],
    category: 'Root',

    execute: async (client, message, args, ertu) => {
        if (!global.system.ownerID.includes(message.author.id)) return;

        const setupEmbed = new EmbedBuilder({
            author: { name: message.guild.name, iconURL: message.guild.iconURL() },
            footer: { text: 'ertu was here ❤️', iconURL: message.guild.iconURL() },
            description: [
                `${codeBlock('fix', '# Kurulum Seçenekleri')}`,
                `• Rol Kurulumu : Sunucu rollerini otomatik oluşturur`,
                `• Emoji Kurulumu : Gerekli emojileri yükler`,
                `• Log Kurulumu : Log kanallarını ayarlar`,
                '',
                `${codeBlock('fix', '# Sistem Durumu')}`,
                `${ertu.autoRole ? '✅' : '❌'} Otomatik Rol : ${ertu.autoRole ? 'Aktif' : 'Devre Dışı'}`,
                `${ertu.genderSystem ? '✅' : '❌'} Cinsiyet Sistemi : ${ertu.genderSystem ? 'Aktif' : 'Devre Dışı'}`,
                `${ertu.linkGuard ? '✅' : '❌'} Link Engel : ${ertu.linkGuard ? 'Aktif' : 'Devre Dışı'}`,
                '',
                `${codeBlock('fix', '# Sunucu İstatistikleri')}`,
                `• Toplam Üye : ${message.guild.memberCount}`,
                `• Toplam Rol : ${message.guild.roles.cache.size}`,
                `• Toplam Kanal : ${message.guild.channels.cache.size}`,
            ].join('\n'),
        });

        const mainRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('role-setup').setLabel('Rol Kurulumu').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('emoji-setup').setLabel('Emoji Kurulumu').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('log-setup').setLabel('Log Kurulumu').setStyle(ButtonStyle.Secondary),
        );

        const systemRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setPlaceholder('Sistemleri & Ayarları Güncellemek İçin Tıkla!')
                .setCustomId('systems')
                .addOptions([
                    { label: 'Otomatik Kayıt', value: 'autoRole', description: 'Sunucuya girene otomatik üye rolü verir.', emoji: ertu.autoRole ? '✅' : '❌' },
                    { label: 'Cinsiyetli Kayıt', value: 'genderSystem', description: 'Cinsiyetli kayıt sistemnini açar kapatır', emoji: ertu.genderSystem ? '✅' : '❌' },
                    { label: 'Link Engel', value: 'linkGuard', description: 'Link engel koruma açar kapatır.', emoji: ertu.linkGuard ? '✅' : '❌' },
                ]));

        const roleRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setPlaceholder('Rolleri Güncellemek İçin Tıkla!')
                .setCustomId('roles')
                .addOptions([
                    { label: 'Ban Yetkilileri', value: 'banAuth_array', description: '(Ban)', emoji: ertu.banAuth && ertu.banAuth.length > 0 ? '✅' : '❌' },
                    { label: 'Mute Yetkilileri', value: 'timeOutAuth_array', description: '(Timeout)', emoji: ertu.timeOutAuth && ertu.timeOutAuth.length > 0 ? '✅' : '❌' },
                    { label: 'Diğer Yetkililer', value: 'auth_array', description: '(Referans, Nuke, Sil, Vip, Kilit, Say, Rol)', emoji: ertu.auth && ertu.auth.length > 0 ? '✅' : '❌' },
                    { label: 'Vip Rolü', value: 'vipRole_string', description: 'Vip rolü.', emoji: ertu.vipRole ? '✅' : '❌' },
                    { label: 'Family Rolü', value: 'familyRole_string', description: 'Family rolü.', emoji: ertu.familyRole ? '✅' : '❌' },
                    { label: 'Erkek Rolü', value: 'manRole_string', description: 'Erkek rolü. (Cinsiyet Sistemini açman gerekir.)', emoji: ertu.manRole ? '✅' : '❌' },
                    { label: 'Kadın Rolü', value: 'womanRole_string', description: 'Kadın rolü. (Cinsiyet Sistemini açman gerekir.)', emoji: ertu.womanRole ? '✅' : '❌' },
                    { label: 'Kayıtlı Rolü', value: 'registeredRole_string', description: 'Kayıtlı rolü.', emoji: ertu.registeredRole ? '✅' : '❌' },
                    { label: 'Kayıtsız Rolü', value: 'unregisteredRole_string', description: 'Kayıtsız rolü.', emoji: ertu.unregisteredRole ? '✅' : '❌' },
                ]));

        const channelRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setPlaceholder('Kanalları Güncellemek İçin Tıkla!')
                .setCustomId('channels')
                .addOptions([
                    { label: 'Bot Komut Kanalı', value: 'botCommandChannel_text', description: 'Botun komut aldığı kanal.', emoji: ertu.botCommandChannel ? '✅' : '❌' },
                    { label: 'Coin Kanalı', value: 'coinChannel_text', description: 'Ship kanalı.', emoji: ertu.coinChannel ? '✅' : '❌' },
                    { label: 'Ship Kanalı', value: 'shipChannel_text', description: 'Ship kanalı.', emoji: ertu.shipChannel ? '✅' : '❌' },
                    { label: 'Tweet Kanalı', value: 'tweetChannel_text', description: 'Ship kanalı.', emoji: ertu.tweetChannel ? '✅' : '❌' },
                    { label: 'Özel Oda Kanalı', value: 'secretRoomChannel_voice', description: 'Özel oda kanalı.', emoji: ertu.secretRoomChannel ? '✅' : '❌' },
                    { label: 'Özel Oda Kategorisi', value: 'secretRoomParent_category', description: 'Özel oda kategorisi.', emoji: ertu.secretRoomParent ? '✅' : '❌' },
                ]));

        const question = await message.reply({
            embeds: [setupEmbed],
            components: [mainRow, systemRow, roleRow, channelRow],
        });

        const filter = (i) => i.user.id === message.author.id;
        const collector = question.createMessageComponentCollector({
            filter,
            time: 1000 * 60 * 10,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();

            if (i.customId === 'role-setup') {
                await roleSetup(message);
            }

            if (i.customId === 'emoji-setup') {
                await emojiSetup(message);
            }

            if (i.customId === 'log-setup') {
                await logSetup(message);
            }

            if (i.customId === 'roles') {
                await roles(message, ertu, i.values[0], question, i);
            }

            if (i.customId === 'channels') {
                await channels(message, ertu, i.values[0], question, i);
            }

            if (i.customId === 'systems') {
                await systems(message, ertu, i.values[0], question, i);
            }
        });
    },
};

async function roles(message, ertu, option, botMessage, i) {
    const [key, type] = option.split('_');
    const row = new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
            .setCustomId('roleSelect')
            .setMaxValues(type === 'array' ? 20 : 1)
    );

    const msg = await message.channel.send({
        content: `Güncellemek için tıklayın.`,
        components: [row],
    });

    const roleCollector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 1000 * 60 * 10,
    });

    roleCollector.on('collect', async (i) => {
        await i.deferUpdate();
        if (i.customId === 'roleSelect') {
            ertu[key] = type === 'string' ? i.values[0] : i.values;
            await Settings.updateOne({ id: message.guild.id }, { [key]: ertu[key] }, { upsert: true });
            msg.edit({ content: `Başarıyla güncellendi!`, components: [] }).then((m) => setTimeout(() => m.delete(), 5000));

            refreshSetup(message, ertu, botMessage);
        }
    });
}

async function channels(message, ertu, option, botMessage, i) {
    const [key, type] = option.split('_');
    const row = new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
            .setCustomId('channelSelect')
            .setChannelTypes(type === 'voice' ? ChannelType.GuildVoice : type === 'text' ? [ChannelType.GuildText] : [ChannelType.GuildCategory])
    );

    const msg = await message.channel.send({
        content: `Güncellemek için tıklayın.`,
        components: [row],
    });

    const channelCollector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 1000 * 60 * 10,
    });

    channelCollector.on('collect', async (i) => {
        await i.deferUpdate();
        if (i.customId === 'channelSelect') {
            await Settings.updateOne({ id: message.guild.id }, { [key]: i.values[0] }, { upsert: true });
            msg.edit({ content: `Başarıyla güncellendi!`, components: [] }).then((m) => setTimeout(() => m.delete(), 5000));

            refreshSetup(message, ertu, botMessage);
        }
    });
}

async function systems(message, ertu, option, botMessage, i) {
    ertu[option] = !ertu[option];
    await Settings.updateOne({ id: message.guild.id }, { [option]: ertu[option] }, { upsert: true });
    message.reply({ content: `${bold(systemLabels[option])} başarıyla ${ertu[option] ? 'açıldı' : 'kapatıldı'}.`, ephemeral: true });
    refreshSetup(message, ertu, botMessage);
}

async function roleSetup(message) {

    const roles = [
        { name: 'Gri', color: '#7a7a7a' },
        { name: 'Siyah', color: '#090909' },
        { name: 'Beyaz', color: '#f9f8f8' },
        { name: 'Kırmızı', color: '#f50606' },
        { name: 'Mavi', color: '#2a9dff' },
        { name: 'Sarı', color: '#dfdb6a' },
        { name: 'Yeşil', color: '#37be66' },
        { name: 'Mor', color: '#a47dff' },
        { name: 'Turuncu', color: '#e98c00' },
        { name: 'Pembe', color: '#e996ff' },
    ]

    roles.forEach(async (role) => {
        const guildRole = message.guild.roles.cache.find(r => r.name === role.name);
        if (guildRole) return;
        await message.guild.roles.create({ name: role.name, color: role.color });
    });

    message.reply({ content: 'Roller başarıyla oluşturuldu.' });
}

async function emojiSetup(message) {

    const emojis = [
        { name: 'ertuChange', url: 'https://cdn.discordapp.com/emojis/1280996856343826554.webp?size=80&quality=lossless' },
        { name: 'ertuLimit', url: 'https://cdn.discordapp.com/emojis/1280996757773222042.webp?size=80&quality=lossless' },
        { name: 'ertuLock', url: 'https://cdn.discordapp.com/emojis/1280996771169828944.webp?size=80&quality=lossless' },
        { name: 'ertuVisible', url: 'https://cdn.discordapp.com/emojis/1280996886119055462.webp?size=80&quality=lossless' },
        { name: 'ertuMember', url: 'https://cdn.discordapp.com/emojis/1280996814190809140.webp?size=80&quality=lossless' },
        { name: 'ertuUp', url: 'https://cdn.discordapp.com/emojis/947134506488459274.gif?size=80&quality=lossless' },
        { name: 'ertuDown', url: 'https://cdn.discordapp.com/emojis/947134506672996382.gif?size=80&quality=lossless' },
        { name: 'point', url: 'https://cdn.discordapp.com/emojis/1057358625972178974.webp?size=40&quality=lossless' },
    ]

    emojis.forEach(async (e) => {
        const emoji = message.guild.emojis.cache.find(emoji => emoji.name === e.name);
        if (emoji) return;
        await message.guild.emojis.create({ attachment: e.url, name: e.name });
    });

    message.reply({ content: 'Emojiler başarıyla yüklendi.' });
}


async function logSetup(message) {
    const channels = [
        { name: 'guard-log' },
        { name: 'ban-log' },
        { name: 'mute-log' },
        { name: 'mesaj-log' },
        { name: 'giriş-çıkış-log' },
        { name: 'rol-log' },
    ];

    const logsCategory = await message.guild.channels.create({
        name: `${message.guild.name} | Logs`,
        type: ChannelType.GuildCategory,
        position: 99,
        permissionOverwrites: [
            {
                id: message.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel]
            }
        ]
    });

    for (const channel of channels) {
        const logChannel = message.guild.channels.cache.find(c => c.name === channel.name);
        if (logChannel) continue;

        await message.guild.channels.create({
            name: channel.name,
            type: ChannelType.GuildText,
            parent: logsCategory.id,
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel]
                }
            ]
        });
    }

    message.reply({ content: 'Log kanalları başarıyla oluşturuldu.' });
}

async function refreshSetup(message, ertu, botMessage) {

    const mainRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('role-setup').setLabel('Rol Kurulumu').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('emoji-setup').setLabel('Emoji Kurulumu').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('log-setup').setLabel('Log Kurulumu').setStyle(ButtonStyle.Secondary),
    );

    const systemRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setPlaceholder('Sistemleri & Ayarları Güncellemek İçin Tıkla!')
            .setCustomId('systems')
            .addOptions([
                { label: 'Otomatik Kayıt', value: 'autoRole', description: 'Sunucuya girene otomatik üye rolü verir.', emoji: ertu.autoRole ? '✅' : '❌' },
                { label: 'Cinsiyetli Kayıt', value: 'genderSystem', description: 'Cinsiyetli kayıt sistemnini açar kapatır', emoji: ertu.genderSystem ? '✅' : '❌' },
                { label: 'Link Engel', value: 'linkGuard', description: 'Link engel koruma açar kapatır.', emoji: ertu.linkGuard ? '✅' : '❌' },
            ]));

    const roleRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setPlaceholder('Rolleri Güncellemek İçin Tıkla!')
            .setCustomId('roles')
            .addOptions([
                { label: 'Ban Yetkilileri', value: 'banAuth_array', description: '(Ban)', emoji: ertu.banAuth && ertu.banAuth.length > 0 ? '✅' : '❌' },
                { label: 'Mute Yetkilileri', value: 'timeOutAuth_array', description: '(Timeout)', emoji: ertu.timeOutAuth && ertu.timeOutAuth.length > 0 ? '✅' : '❌' },
                { label: 'Diğer Yetkililer', value: 'auth_array', description: '(Referans, Nuke, Sil, Vip, Kilit, Say, Rol)', emoji: ertu.auth && ertu.auth.length > 0 ? '✅' : '❌' },
                { label: 'Vip Rolü', value: 'vipRole_string', description: 'Vip rolü.', emoji: ertu.vipRole ? '✅' : '❌' },
                { label: 'Family Rolü', value: 'familyRole_string', description: 'Family rolü.', emoji: ertu.familyRole ? '✅' : '❌' },
                { label: 'Erkek Rolü', value: 'manRole_string', description: 'Erkek rolü. (Cinsiyet Sistemini açman gerekir.)', emoji: ertu.manRole ? '✅' : '❌' },
                { label: 'Kadın Rolü', value: 'womanRole_string', description: 'Kadın rolü. (Cinsiyet Sistemini açman gerekir.)', emoji: ertu.womanRole ? '✅' : '❌' },
                { label: 'Kayıtlı Rolü', value: 'registeredRole_string', description: 'Kayıtlı rolü.', emoji: ertu.registeredRole ? '✅' : '❌' },
                { label: 'Kayıtsız Rolü', value: 'unregisteredRole_string', description: 'Kayıtsız rolü.', emoji: ertu.unregisteredRole ? '✅' : '❌' },
            ]));

    const channelRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setPlaceholder('Kanalları Güncellemek İçin Tıkla!')
            .setCustomId('channels')
            .addOptions([
                { label: 'Bot Komut Kanalı', value: 'botCommandChannel_text', description: 'Botun komut aldığı kanal.', emoji: ertu.botCommandChannel ? '✅' : '❌' },
                { label: 'Coin Kanalı', value: 'coinChannel_text', description: 'Ship kanalı.', emoji: ertu.coinChannel ? '✅' : '❌' },
                { label: 'Ship Kanalı', value: 'shipChannel_text', description: 'Ship kanalı.', emoji: ertu.shipChannel ? '✅' : '❌' },
                { label: 'Tweet Kanalı', value: 'tweetChannel_text', description: 'Ship kanalı.', emoji: ertu.tweetChannel ? '✅' : '❌' },
                { label: 'Özel Oda Kanalı', value: 'secretRoomChannel_voice', description: 'Özel oda kanalı.', emoji: ertu.secretRoomChannel ? '✅' : '❌' },
                { label: 'Özel Oda Kategorisi', value: 'secretRoomParent_category', description: 'Özel oda kategorisi.', emoji: ertu.secretRoomParent ? '✅' : '❌' },
            ]));

    const embed = new EmbedBuilder({
        author: { name: message.guild.name, iconURL: message.guild.iconURL() },
        footer: { text: 'ertu was here ❤️', iconURL: message.guild.iconURL() },
        description: [
            `${codeBlock('fix', '# Kurulum Seçenekleri')}`,
            `• Rol Kurulumu : Sunucu rollerini otomatik oluşturur`,
            `• Emoji Kurulumu : Gerekli emojileri yükler`,
            `• Log Kurulumu : Log kanallarını ayarlar`,
            '',
            `${codeBlock('fix', '# Sistem Durumu')}`,
            `${ertu.autoRole ? '✅' : '❌'} Otomatik Rol : ${ertu.autoRole ? 'Aktif' : 'Devre Dışı'}`,
            `${ertu.genderSystem ? '✅' : '❌'} Cinsiyet Sistemi : ${ertu.genderSystem ? 'Aktif' : 'Devre Dışı'}`,
            `${ertu.linkGuard ? '✅' : '❌'} Link Engel : ${ertu.linkGuard ? 'Aktif' : 'Devre Dışı'}`,
            '',
            `${codeBlock('fix', '# Sunucu İstatistikleri')}`,
            `• Toplam Üye : ${message.guild.memberCount}`,
            `• Toplam Rol : ${message.guild.roles.cache.size}`,
            `• Toplam Kanal : ${message.guild.channels.cache.size}`,
        ].join('\n'),
    });

    await botMessage.edit({ 
        embeds: [embed],
        components: [mainRow, systemRow, roleRow, channelRow],
    });
}