const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "davetler",
    description: 'Belirtilen kişinin davet sayısına bakarsın.',
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kimin davet sayısına bakmak istersin?",
            type: 6,
            required: false
        },
    ],
    run: async (client, interaction) => {

        const kullanıcı = interaction.options.getUser("kullanıcı")

        if (!kullanıcı) {
            const real = db.get(`realinvite_${interaction.user.id}_${interaction.guild.id}`) || `0`
            const fake = db.get(`fakeinvite_${interaction.user.id}_${interaction.guild.id}`) || `0`

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username} davet sayısı`, iconURL: interaction.user.avatarURL() })
                .addFields(
                    { name: "Toplam Davet:", value: `\`\`\`fix\n${Number(real) + -Number(fake)}\`\`\``, inline: true },
                    { name: "Toplam Gerçek Davet:", value: `\`\`\`fix\n${real}\`\`\``, inline: true },
                    { name: "Toplam Fake Davet:", value: `\`\`\`fix\n${fake}\`\`\``, inline: true },
                )

            return interaction.reply({ embeds: [embed] })
        } else {
            const real = db.get(`realinvite_${kullanıcı.id}_${interaction.guild.id}`) || `0`
            const fake = db.get(`fakeinvite_${kullanıcı.id}_${interaction.guild.id}`) || `0`

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${kullanıcı.username} davet sayısı`, iconURL: kullanıcı.avatarURL() })
                .addFields(
                    { name: "Toplam Davet:", value: `\`\`\`fix\n${Number(real) + -Number(fake)}\`\`\``, inline: true },
                    { name: "Toplam Gerçek Davet:", value: `\`\`\`fix\n${real}\`\`\``, inline: true },
                    { name: "Toplam Fake Davet:", value: `\`\`\`fix\n${fake}\`\`\``, inline: true },
                )
                .setFooter({ text: `${interaction.user.username} tarafından istendi`, iconURL: interaction.user.avatarURL() })

            return interaction.reply({ embeds: [embed] })
        }
    }
}