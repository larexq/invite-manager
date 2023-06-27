const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "sistem-sıfırla",
    description: 'Davet sistemini sıfırlarsın.',
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const yetkiyok = new EmbedBuilder()
        .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Sistemi ayarlayabilmem için \`Yönetici\` yetkisine sahip olman gerekiyor.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetkiyok] })

        const datayok = new EmbedBuilder()
            .setDescription(`Sistemi zaten sıfırlamışsın veya daha ayarlamamışsın.`)

        if (!db.get(`davetsistem_${interaction.guild.id}`)) return interaction.reply({ embeds: [datayok]})

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Davet sistemi başarıyla sıfırlandı.`)

        db.delete(`davetsistem_${interaction.guild.id}`)
        return interaction.reply({ embeds: [embed] })
    }
}