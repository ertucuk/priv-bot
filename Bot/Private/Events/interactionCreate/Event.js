const { Events, ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, EmbedBuilder, BaseInteraction, PermissionFlagsBits, bold, ButtonBuilder, ButtonStyle } = require('discord.js');
const Settings = require('../../../Schema/Settings');

const inviteRegex = /\b(?:https?:\/\/)?(?:www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-zA-Z0-9\-]{2,32})\b/;
const adsRegex = /([^a-zA-ZIıİiÜüĞğŞşÖöÇç\s])+/gi;
const roles = {
    gri: 'Gri',
    siyah: 'Siyah',
    beyaz: 'Beyaz',
    kırmızı: 'Kırmızı',
    mavi: 'Mavi',
    sarı: 'Sarı',
    yeşil: 'Yeşil',
    mor: 'Mor',
    turuncu: 'Turuncu',
    pembe: 'Pembe'
};

client.on(Events.InteractionCreate, async (i = BaseInteraction.prototype) => {

    const document = await Settings.findOne({ id: i.guild.id });
    if (!document) return;

    if (i.isButton()) {

        for (const [id, name] of Object.entries(roles)) {
            if (i.customId === id) {
                const role = i.guild.roles.cache.find(x => x.name === name);
                if (i.member.roles.cache.find(x => x.name === name)) {
                    i.member.roles.remove(role);
                    await i.reply({ content: `${role.name} rolü üzerinden alındı.`, ephemeral: true });
                } else {
                    i.member.roles.add(role);
                    await i.reply({ content: `${role.name} rolü üzerine verildi.`, ephemeral: true });
                }
            }
        }

        if (i.customId === 'register') {
            if (!i.member.roles.cache.has(document.registeredRole)) {
                i.member.roles.add(document.registeredRole);
                i.member.roles.remove(document.unregisteredRole);

                const counter = await Settings.findOneAndUpdate({ id: i.guild.id }, { $inc: { clickCount: 1 } });

                const row = new ActionRowBuilder({
                    components: [
                        new ButtonBuilder()
                            .setCustomId('register')
                            .setLabel(`Kayıt Ol - ${counter.clickCount}`)
                            .setStyle(ButtonStyle.Secondary)
                    ]
                })

                await i.reply({ content: 'Kayıt oldunuz!', ephemeral: true });
                await i.message.edit({ components: [row] });
            } else {
                await i.reply({ content: 'Zaten kayıtlısınız.', ephemeral: true });
            }
        }

        if (i.customId === 'man') {
            if (!i.member.roles.cache.has(document.manRole)) {
                i.member.roles.add(document.manRole);
                i.member.roles.remove(document.unregisteredRole);

                const counter = await Settings.findOneAndUpdate({ id: i.guild.id }, { $inc: { manClickCount: 1 } });

                const row = new ActionRowBuilder({
                    components: [
                        new ButtonBuilder()
                            .setCustomId('man')
                            .setLabel(`- (${counter.manClickCount})`)
                            .setEmoji('1420101314901311500')
                            .setStyle(ButtonStyle.Primary),
    
                        new ButtonBuilder()
                            .setCustomId('woman')
                            .setLabel(`- (${document?.womanClickCount || 0})`)
                            .setEmoji('1420101480039583794')
                            .setStyle(ButtonStyle.Danger)
                    ]
                })

                await i.reply({ content: 'Erkek olarak kayıt oldunuz!', ephemeral: true });
                await i.message.edit({ components: [row] });

            } else {
                await i.reply({ content: 'Zaten erkek olarak kayıtlısınız.', ephemeral: true });
            }
        }

        if (i.customId === 'woman') {   
            if (!i.member.roles.cache.has(document.womanRole)) {
                i.member.roles.add(document.womanRole);
                i.member.roles.remove(document.unregisteredRole);

                const counter = await Settings.findOneAndUpdate({ id: i.guild.id }, { $inc: { womanClickCount: 1 } });

                const row = new ActionRowBuilder({
                    components: [
                        new ButtonBuilder()
                            .setCustomId('man')
                            .setLabel(`- (${document?.manClickCount || 0})`)
                            .setEmoji('1420101314901311500')
                            .setStyle(ButtonStyle.Primary),
    
                        new ButtonBuilder()
                            .setCustomId('woman')
                            .setLabel(`- (${counter.womanClickCount})`)
                            .setEmoji('1420101480039583794')
                            .setStyle(ButtonStyle.Danger)
                    ]
                })

                await i.reply({ content: 'Kız olarak kayıt oldunuz!', ephemeral: true });
                await i.message.edit({ components: [row] });

            } else {
                await i.reply({ content: 'Zaten kız olarak kayıtlısınız.', ephemeral: true });
            }
        }

        const member = i.guild.members.cache.get(i.user.id);
        const channel = i.guild.channels.cache.get(member.voice.channelId);
        const existingRoom = (document.privateRooms || []).find(x => x.channel === channel?.id);
        const owner = i.guild.members.cache.get(existingRoom?.owner);
        const isOwnerVoice = owner?.voice?.channel?.id === channel?.id;
        const isOwner = owner?.id === i.user.id;

        if (i.customId === 'changeName') {
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${document.secretRoomChannel}>`,
                    })
                ], ephemeral: true
            });

            if (channel?.parentId === document.secretRoomParent && !isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. Oda sahibi odada olmadığı için aşağıdaki butonu kullanabilir.' 
                        })
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder({
                                customId: 'claimOwnership',
                                label: 'Odayı Sahiplen',
                                style: ButtonStyle.Primary
                            })
                        )
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId === document.secretRoomParent && isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. ' 
                        })
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId !== document.secretRoomParent) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Hata!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: `Özel oda kategorisinde olmayan bir kanalda bu işlemi gerçekleştiremezsiniz. Lütfen bir özel oda kanalında deneyin:\n\n <#${document.secretRoomChannel}>`
                        })
                    ], 
                    ephemeral: true
                });
            }

            const row = new ModalBuilder()
                .setTitle('İsim Değiştir')
                .setCustomId('changingName')
                .setComponents(
                    new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId('channelName').setLabel('Oda ismini giriniz.').setStyle(TextInputStyle.Short)),
                );

            i.showModal(row)

            const modalCollected = await i.awaitModalSubmit({ time: 1000 * 60 * 2 });
            const channelName = modalCollected.fields.getTextInputValue('channelName');

            if (modalCollected) {
                if (channelName.match(inviteRegex)) return modalCollected.reply({ content: 'Özel oda isminde link kullanamazsınız.', ephemeral: true });
                if (channelName.match(adsRegex)) return modalCollected.reply({ content: 'Özel oda isminde reklam yapamazsınız.', ephemeral: true });

                await channel.setName(channelName).catch((err) => console.error())

                modalCollected.reply({
                    content: `Oda ismi başarıyla değiştirildi: ${bold(channelName)}`,
                    ephemeral: true
                });
            };
        }

        if (i.customId === 'changeLimit') {
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${document.secretRoomChannel}>`,
                    })
                ], ephemeral: true
            });

            if (channel?.parentId === document.secretRoomParent && !isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. Oda sahibi odada olmadığı için aşağıdaki butonu kullanabilir.' 
                        })
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder({
                                customId: 'claimOwnership',
                                label: 'Odayı Sahiplen',
                                style: ButtonStyle.Primary
                            })
                        )
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId === document.secretRoomParent && isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. ' 
                        })
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId !== document.secretRoomParent) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Hata!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: `Özel oda kategorisinde olmayan bir kanalda bu işlemi gerçekleştiremezsiniz. Lütfen bir özel oda kanalında deneyin:\n\n <#${document.secretRoomChannel}>`
                        })
                    ], 
                    ephemeral: true
                });
            }

            const row = new ModalBuilder()
                .setTitle('Limit Değiştir')
                .setCustomId('changingLimit')
                .setComponents(
                    new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId('channelLimit').setLabel('Oda limitini giriniz.').setStyle(TextInputStyle.Short)),
                );

            i.showModal(row)

            const modalCollected = await i.awaitModalSubmit({ time: 1000 * 60 * 2 });
            const channelLimit = modalCollected.fields.getTextInputValue('channelLimit');

            if (modalCollected) {
                if (isNaN(channelLimit)) return modalCollected.reply({ content: 'Geçerli bir limit belirtmelisiniz.', ephemeral: true });

                await channel.setUserLimit(channelLimit).catch((err) => console.error())

                modalCollected.reply({
                    content: `Oda limiti başarıyla değiştirildi: ${bold(channelLimit)}`,
                    ephemeral: true
                });
            }
        }

        if (i.customId === 'lockOrUnlock') {
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${document.secretRoomChannel}>`,
                    })
                ], ephemeral: true
            });

            if (channel?.parentId === document.secretRoomParent && !isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. Oda sahibi odada olmadığı için aşağıdaki butonu kullanabilir.' 
                        })
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder({
                                customId: 'claimOwnership',
                                label: 'Odayı Sahiplen',
                                style: ButtonStyle.Primary
                            })
                        )
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId === document.secretRoomParent && isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. ' 
                        })
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId !== document.secretRoomParent) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Hata!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: `Özel oda kategorisinde olmayan bir kanalda bu işlemi gerçekleştiremezsiniz. Lütfen bir özel oda kanalında deneyin:\n\n <#${document.secretRoomChannel}>`
                        })
                    ], 
                    ephemeral: true
                });
            }

            const permissions = channel.permissionOverwrites.cache.get(i.guild.id);

            if (permissions && permissions.deny.has(PermissionFlagsBits.Connect)) {
                await channel.permissionOverwrites.edit(i.guild.id, { 1048576: true });
                i.reply({ content: 'Kanal herkese açıldı.', ephemeral: true });
            } else {
                await channel.permissionOverwrites.edit(i.guild.id, { 1048576: false });
                i.reply({ content: 'Kanal herkese kapatıldı.', ephemeral: true });
            }
        }

        if (i.customId === 'visibleOrInvisible') {
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${document.secretRoomChannel}>`,
                    })
                ], ephemeral: true
            });

            if (channel?.parentId === document.secretRoomParent && !isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. Oda sahibi odada olmadığı için aşağıdaki butonu kullanabilir.' 
                        })
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder({
                                customId: 'claimOwnership',
                                label: 'Odayı Sahiplen',
                                style: ButtonStyle.Primary
                            })
                        )
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId === document.secretRoomParent && isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. ' 
                        })
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId !== document.secretRoomParent) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Hata!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: `Özel oda kategorisinde olmayan bir kanalda bu işlemi gerçekleştiremezsiniz. Lütfen bir özel oda kanalında deneyin:\n\n <#${document.secretRoomChannel}>`
                        })
                    ], 
                    ephemeral: true
                });
            }

            const permissions = channel.permissionOverwrites.cache.get(i.guild.id);

            if (permissions && permissions.deny.has(PermissionFlagsBits.ViewChannel)) {
                await channel.permissionOverwrites.edit(i.guild.id, { 1024: true });
                i.reply({ content: 'Kanal herkese görünür yapıldı.', ephemeral: true });
            } else {
                await channel.permissionOverwrites.edit(i.guild.id, { 1024: false });
                i.reply({ content: 'Kanal herkese gizlendi.', ephemeral: true });
            }
        }

        if (i.customId === 'addOrRemove') {
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${document.secretRoomChannel}>`,
                    })
                ], ephemeral: true
            });

            if (channel?.parentId === document.secretRoomParent && !isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. Oda sahibi odada olmadığı için aşağıdaki butonu kullanabilir.' 
                        })
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder({
                                customId: 'claimOwnership',
                                label: 'Odayı Sahiplen',
                                style: ButtonStyle.Primary
                            })
                        )
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId === document.secretRoomParent && isOwnerVoice && !isOwner) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Mümkün değil!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: 'Bu komutu, yalnızca ses kanalının sahibi kullanabilir. ' 
                        })
                    ],
                    ephemeral: true
                });
            } else if (channel?.parentId !== document.secretRoomParent) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder({
                            title: 'Hata!',
                            image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                            description: `Özel oda kategorisinde olmayan bir kanalda bu işlemi gerçekleştiremezsiniz. Lütfen bir özel oda kanalında deneyin:\n\n <#${document.secretRoomChannel}>`
                        })
                    ], 
                    ephemeral: true
                });
            }

            const allowedUsers = channel.permissionOverwrites.cache.filter(overwrite =>
                overwrite.allow.has(PermissionFlagsBits.Connect) && overwrite.type === 1
            );

            const allowedOptions = allowedUsers
                .filter(x => x.id !== i.user.id)
                .map(user => ({
                    label: i.guild.members.cache.get(user.id)?.displayName || `Kullanıcı: ${user.id}`,
                    value: user.id
                }));

            const stringSelectMenu = new StringSelectMenuBuilder({
                customId: 'remove_permission',
                placeholder: 'Özel odaya izinli kullanıcılar',
                options: allowedOptions.slice(0, 25).length > 0 ? allowedOptions.slice(0, 25) : [{
                    label: 'Kimse mevcut değil',
                    value: 'none',
                    description: 'Odaya izinli kullanıcı yok.'
                }],
                disabled: allowedOptions.length === 0
            });

            const userSelectMenu = new UserSelectMenuBuilder({
                customId: 'add_permission',
                placeholder: 'Üye seç.',
                maxValues: 1
            });

            const stringSelectRow = new ActionRowBuilder().addComponents(stringSelectMenu);
            const userSelectRow = new ActionRowBuilder().addComponents(userSelectMenu);

            await i.reply({
                content: 'Aşağıdaki menüleri kullanarak kullanıcı izinlerini düzenleyin:',
                components: [stringSelectRow, userSelectRow],
                ephemeral: true
            });

            const collector = i.channel.createMessageComponentCollector({
                filter: i => i.user.id === i.user.id,
                time: 60000
            });

            collector.on('collect', async i => {
                if (i.customId === 'remove_permission') {
                    const userId = i.values[0];
                    await channel.permissionOverwrites.edit(userId, {
                        [PermissionFlagsBits.Connect]: false
                    });
                    await i.update({
                        content: `<@${userId}> kullanıcısının özel oda izni kaldırıldı.`,
                        components: [],
                        ephemeral: true
                    });
                } else if (i.customId === 'add_permission') {
                    const userId = i.values[0];
                    await channel.permissionOverwrites.edit(userId, {
                        [PermissionFlagsBits.Connect]: true
                    });
                    await i.update({
                        content: `<@${userId}> kullanıcısına özel odaya bağlanma izni verildi.`,
                        components: [],
                        ephemeral: true
                    });
                }
            });
        }

        if (i.customId === 'claimOwnership') {
            if (!member.voice.channel) return i.update({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${document.secretRoomChannel}>`,
                    })
                ],
                components: [], 
                ephemeral: true
            });

            await Settings.updateOne(
                { 
                    id: member.guild.id,
                    'privateRooms.channel': channel.id 
                },
                { 
                    $set: { 'privateRooms.$.owner': member.id }
                }
            );

            i.update({ embeds: [], content: 'Oda artık size ait.', components: [], ephemeral: true });
        }
    }
})