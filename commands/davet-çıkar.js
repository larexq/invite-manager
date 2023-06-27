const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "davet-çıkar",
    description: 'Belirtilen kullanıcıdan belirttiğin sayıda davet çıkarırsın.',
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kimden davet sayısı çıkarmak istiyorsun?",
            type: 6,
            required: true
        },
        {
            name: "davet-sayısı",
            description: "Kaç tane davet çıkarmak istiyorsun?",
            type: 10,
            required: true
        },
        {
            name: "davet-türü",
            description: "Gerçek davet mi yoksa fake davet mi çıkarmak istersin?",
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Gerçek Davet',
                    value: "gerçek"
                },
                {
                    name: 'Fake Davet',
                    value: "fake"
                },
            ]
        }
    ],

    run: async (client, interaction) => {

        const yetkiyok = new EmbedBuilder()
        .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Davet ekleyebilmem için \`Yönetici\` yetkisine sahip olman gerekiyor.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetkiyok] })

        const kullanıcı = interaction.options.getUser("kullanıcı")
        const deger = interaction.options.getNumber("davet-sayısı")

        const hata = new EmbedBuilder()
        .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Silmek istediğin davet sayısı 0 veya 0'dan küçük olamaz.`)

        if(deger <= 0) return interaction.reply({ embeds: [hata] })

        const deger2 = `-${deger}`
        const choice = interaction.options.getString("davet-türü")

        if(choice === "gerçek") {
            const nice = new EmbedBuilder()
            .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${kullanıcı} kullanıcısından \`${deger}\` tane \`gerçek\` davet sayısı silindi.`)
    
            db.add(`realinvite_${kullanıcı.id}_${interaction.guild.id}`, deger2)
    
            return interaction.reply({ embeds: [nice] })
        }

        if(choice === "fake") {
            const nice = new EmbedBuilder()
            .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${kullanıcı} kullanıcısından \`${deger}\` tane \`fake\` davet sayısı silindi.`)
    
            db.add(`fakeinvite_${kullanıcı.id}_${interaction.guild.id}`, deger2)
    
            return interaction.reply({ embeds: [nice] })
        }
    }
}