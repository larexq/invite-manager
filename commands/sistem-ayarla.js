const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "sistem-ayarla",
    description: 'Davet sistemini ayarlarsın.',
    type: 1,
    options: [
        {
            name: "log-kanalı",
            description: "Davet sisteminin log kanalını ayarlarsın.",
            type: 7,
            required: true,
            channel_types: [0]
        }
    ],
    run: async (client, interaction) => {

        const yetkiyok = new EmbedBuilder()
        .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Sistemi ayarlayabilmem için \`Yönetici\` yetkisine sahip olman gerekiyor.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetkiyok] })

        const channel = interaction.options.getChannel("log-kanalı")

        const embed = new EmbedBuilder()
         .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
         .setDescription(`Davet log kanalı ${channel} olarak ayarlandı.`)

            db.set(`davetsistem_${interaction.guild.id}`, { channel: channel.id })
            return interaction.reply({ embeds: [embed] })
    }
}