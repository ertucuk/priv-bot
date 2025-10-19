const { PermissionsBitField: { Flags }, Events, ChannelType, bold } = require('discord.js');
const Settings = require('../../../../Schema/Settings');

module.exports = async function Room(client, oldState, newState) {
    const document = await Settings.findOne({ id: oldState.guild.id });
    if (!document) return;

    const guild = client.guilds.cache.get(oldState.guild.id);
    if (!guild) return;

    const member = newState.guild.members.cache.get(newState.id);
    const roomControl = (document?.privateRooms || []).find(x => x.owner === member?.id);

    if (newState.channelId === document?.secretRoomChannel) {
        if (roomControl) {
            const rooms = Array.isArray(roomControl) ? roomControl : [roomControl];
            for (const room of rooms) {
                const channel = guild.channels.cache.get(room?.channel);
                if (!channel) {
                    await Settings.updateOne({ id: member.guild.id }, { $pull: { privateRooms: { owner: member.id } } });
                    return;
                } else {
                    if (channel.members.size === 0) {
                        await channel.delete().catch(e => console.log("Kanal silinemedi:", e));
                        await Settings.updateOne({ id: member.guild.id }, { $pull: { privateRooms: { owner: member.id } } });
                    }
                }
            }
        }

        const parentCategory = newState.channel.parent;
        const categoryPerms = parentCategory ? Array.from(parentCategory.permissionOverwrites.cache.values()) : [];
        
        const perms = categoryPerms.map(overwrite => ({
            id: overwrite.id,
            allow: overwrite.allow.toArray(),
            deny: overwrite.deny.toArray()
        }));


        const xRole = newState.guild.roles.cache.find(r => r.name.toLowerCase().includes('giriş çıkış'));
        if (xRole) {
            perms.push({
                id: xRole.id,
                allow: [
                    Flags.Connect,
                    Flags.Stream,
                    Flags.Speak,
                    Flags.ViewChannel,
                ],
                deny: [
                    Flags.SendMessages
                ]
            });
        }

        perms.push({
            id: member.id,
            allow: [
                Flags.Connect,
                Flags.Stream,
                Flags.Speak,
                Flags.ViewChannel,
            ],
            deny: [
                Flags.SendMessages
            ]
        });

        const newChannel = await newState.guild.channels.create({
            name: `${member.user?.displayName}`,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parentId,
            permissionOverwrites: perms
        }).catch(e => console.log(e));

        newState.setChannel(newChannel);
        await Settings.updateOne({ id: member.guild.id }, { $push: { privateRooms: { owner: member.id, channel: newChannel.id } } });
    }

    if (!oldState.channel && newState.channel) {
        const channel = guild.channels.cache.get(newState.channelId);
        const control = document?.privateRooms.find(x => x.channel === channel.id);
        if (!control) return;

        const member = guild.members.cache.get(newState.id);

        const overwrite = channel.permissionOverwrites.cache.find(o => o.id === newState.member.id || o.id === newState.member.roles.highest.id);
        const isAllow = overwrite ? overwrite.allow.has(Flags.Connect) : false;
        const isLock = channel.permissionOverwrites.cache.some(o => o.id === channel.guild.roles.everyone.id && o.deny.has(Flags.Connect));
        const isAdmin = newState.member.permissions.has(Flags.Administrator);
        const hasSlashRole = newState.member.roles.cache.some(role => role.name.toLowerCase().includes('/'));
        const hasXRole = newState.member.roles.cache.some(role => role.name.toLowerCase().includes('giriş çıkış'));

        if (isAdmin && !isAllow && isLock && !hasSlashRole && !hasXRole) {
            if (member?.voice.channel) {
                member.send({ content: `${bold(channel.name)} adlı özel oda için yetkiniz bulunmamaktadır.` }).catch();
                channel?.send({ content: `${member} kullanıcısı kanala katıldı fakat kanalda izni olmadığı için bağlantısı kesildi...` }).then((e) => setTimeout(() => { e.delete(); }, 20000));
                member.voice.disconnect();
            }
            return;
        }
    }

    if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        const channel = guild.channels.cache.get(newState?.channelId);
        const control = document?.privateRooms.find(x => x.channel === channel.id);
        if (!control) return;

        const member = guild.members.cache.get(newState.member.id);

        const overwrite = channel.permissionOverwrites.cache.find(o => o.id === newState.member.id || o.id === newState.member.roles.highest.id);
        const isAllow = overwrite ? overwrite.allow.has(Flags.Connect) : false;
        const isLock = channel.permissionOverwrites.cache.some(o => o.id === channel.guild.roles.everyone.id && o.deny.has(Flags.Connect));
        const isAdmin = newState.member.permissions.has(Flags.Administrator);
        const hasSlashRole = newState.member.roles.cache.some(role => role.name.toLowerCase().includes('/'));
        const hasXRole = newState.member.roles.cache.some(role => role.name.toLowerCase().includes('giriş çıkış'));

        if (isAdmin && !isAllow && isLock && !hasSlashRole && !hasXRole) {
            if (member?.voice.channel) {
                member.send({ content: `${bold(channel.name)} adlı özel oda için yetkiniz bulunmamaktadır.` }).catch(console.log(member.user.username));
                channel.send({ content: `${member} kullanıcısı kanala katıldı fakat kanalda izni olmadığı için bağlantısı kesildi...` }).then((e) => setTimeout(() => { e.delete(); }, 20000));
                member.voice.disconnect();
            }
            return;
        }
    }

    if (oldState.channel && !newState.channel) {
        const channel = guild.channels.cache.get(oldState.channelId);
        const control = document?.privateRooms.find(x => x.channel === channel.id);
        if (!control) return;
        if (channel?.members.size === 0) {
            await channel.delete().catch(e => console.log("Kanal silinemedi:", e));
            await Settings.updateOne({ id: member.guild.id }, { $pull: { privateRooms: { owner: member.id } } });
        }
    }
}