const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'yardım',
    aliases: ['help', 'komutlar'],
    category: 'General',

    execute: async (client, message, args, ertu) => {
        const channel = message.guild.channels.cache.get(ertu.botCommandChannel);
        if (message.channel.name !== channel?.name && !message.member.permissions.has(PermissionsBitField.Flags.Administrator))
             return message.reply({ content: `Bu komut sadece ${channel} kanalında kullanılabilir.` });
            
        var command = args[0]
        if (client.commands.has(command)) {
            command = client.commands.get(command)
            const embed = new EmbedBuilder().setAuthor({
                name: `${client.user.username} | Komut Bilgisi`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            }).setDescription(`Belirttiğin komuta ait bilgiler aşağıda verilmiştir!
    
                **\` • \`** Komut Adı: **${command.Name}**
                **\` • \`** Komut Alternatifleri: **${command.aliases[0] ? command.aliases.listArray() : `Alternatif bulunmuyor!`}**,
                **\` • \`** Komut Kategorisi: **${command.category}**   
                }**`)
            return message.reply({ embeds: [embed] })
        }

        const embed = new EmbedBuilder({
            thumbnail: { url: message.guild.iconURL({ dynamic: true }) },
            author: { name: `${client.user.username} | Komut Bilgisi`, iconURL: client.user.displayAvatarURL({ dynamic: true }) },
            description: `Sunucuda kullanabileceğiniz komutlar aşağıda listelenmiştir. Toplamda **${client.commands.size}** adet komut bulunmaktadır. \n\nBir komut hakkında daha fazla bilgi almak için\n**.yardım <komut>** komutunu kullanabilirsiniz.`,
        })
        
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help')
                .setPlaceholder('Bir kategori seçin...')
                .addOptions([
                    {
                        label: 'Kullanıcı Komutları',
                        description: 'Sunucu içerisindeki kullanıcı komutlarını gösterir.',
                        value: 'General'
                    },
                    {
                        label: 'Yetkili Komutları',
                        description: 'Sunucu içerisindeki yetkili ve yönetim komutlarını gösterir.',
                        value: 'Auth'
                    },
                    {
                        label: 'Ekonomi Komutları',
                        description: 'Sunucu içerisindeki ekonomi komutlarını gösterir.',
                        value: 'Economy'
                    },
                    {
                        label: 'Kurucu Komutları',
                        description: 'Sunucu içerisindeki kurucu komutlarını gösterir.',
                        value: 'Root'
                    }
                ])
        )

        const question = await message.channel.send({ embeds: [embed], components: [row] })
        const filter = (i) => i.user.id === message.author.id
        const collector = question.createMessageComponentCollector({ filter, time: 30 * 1000 })

        collector.on('collect', async (i) => {
            i.deferUpdate();
            if (i.customId === 'help') {
                const category = i.values[0]
                const commands = client.commands.filter((x) => x.category === category)
                const embed = new EmbedBuilder({
                    thumbnail: { url: message.guild.iconURL({ dynamic: true }) },
                    author: { name: `${client.user.username} | ${category} Komutları`, iconURL: client.user.displayAvatarURL({ dynamic: true }) },
                    description: `**${category}** kategorisine ait komutlar aşağıda listelenmiştir.\n\n${commands.map((x) => `**\` • \`** ${x.name}`).join('\n')}`
                })

                await question.edit({ embeds: [embed], components: [row] })
            }
        });
    }
}