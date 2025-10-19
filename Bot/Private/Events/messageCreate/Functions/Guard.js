const { PermissionsBitField } = require('discord.js');

const usersMap = new Map();
const warnedUsersMap = new Map();

const spamLimit = 5;
const timeWindow = 3000;
const messageDiff = 750;
const warningExpire = 30000;

module.exports = async function Guard(message) {
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
        message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
        message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    ) return;

    if (!usersMap.has(message.author.id)) {
        const userData = {
            msgCount: 1,
            lastMessage: message,
            timer: setTimeout(() => {
                usersMap.delete(message.author.id);
            }, timeWindow)
        };
        usersMap.set(message.author.id, userData);
        return;
    }

    const userData = usersMap.get(message.author.id);
    const timeDiff = message.createdTimestamp - userData.lastMessage.createdTimestamp;

    if (timeDiff > timeWindow) {
        clearTimeout(userData.timer);
        userData.msgCount = 1;
        userData.lastMessage = message;
        userData.timer = setTimeout(() => {
            usersMap.delete(message.author.id);
        }, timeWindow);
        usersMap.set(message.author.id, userData);
        return;
    }

    if (timeDiff < messageDiff) {
        userData.msgCount++;
        userData.lastMessage = message;
        usersMap.set(message.author.id, userData);

        if (userData.msgCount >= spamLimit) {
            const warnCount = warnedUsersMap.has(message.author.id) ? warnedUsersMap.get(message.author.id).count : 0;

            const messages = await message.channel.messages.fetch({ limit: 15 });
            const userMessages = messages.filter(msg => msg.author.id === message.author.id);
            if (userMessages.size > 0) await message.channel.bulkDelete(userMessages, true).catch(() => null);

            if (warnCount >= 2) {
                message.member.timeout(300000);

                const msg = await message.channel.send({ content: `${message.author}, metin kanallarında spam yaptığım için 5 dakika süreyle susturuldun.` }).catch(() => null);

                setTimeout(() => {
                    msg.delete().catch(() => { });
                }, 5000);

                warnedUsersMap.delete(message.author.id);
                usersMap.delete(message.author.id);

            } else {
                const newWarnCount = warnCount + 1;

                const msg = await message.channel.send({
                    content: `${message.author}, metin kanallarında spam yapma! ${newWarnCount}/3`
                }).catch(() => null);

                setTimeout(() => {
                    msg.delete().catch(() => { });
                }, 5000);

                warnedUsersMap.set(message.author.id, {
                    count: newWarnCount,
                    timer: setTimeout(() => {
                        warnedUsersMap.delete(message.author.id);
                    }, warningExpire)
                });

                userData.msgCount = 0;
                usersMap.set(message.author.id, userData);
            }
        }
    } else {
        userData.msgCount++;
        userData.lastMessage = message;
        usersMap.set(message.author.id, userData);
    }
}