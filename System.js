const { ActivityType } = require('discord.js');

module.exports = {
    serverID: '', // sunucu idsi
    channelID: '', // bot kanalı idsi
    serverName: '', // sunucu ismi
    ownerID: [], // bot owner idsi
    database: '', // mongo url

    Presence: {
        Status: 'online', // online, idle, dnd, invisible
        Type: ActivityType.Playing, // Playing, Streaming, Listening, Watching, Competing
        Message: [
            'made by ertu ❤️', 
        ] 
    },

    Private: {
        Token: '', // private bot tokeni
        Prefix: ['.'],
    },

    Security: {
        Logger: '', // guard 1
        Punish: '', // guard 2
        Backup: '', // guard 3
        Prefix: ['.'],
        Dists: [ ], // dağıtıcı tokenleri
        BotsIDs: [], // tüm botların idsi güvenli icin
    },
};