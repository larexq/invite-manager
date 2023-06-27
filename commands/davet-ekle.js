const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "davet-ekle",
    description: 'Belirtilen kullanıcıya belirttiğin sayıda davet eklersin.',
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kime davet sayısı eklemek istiyorsun?",
            type: 6,
            required: true
        },
        {
            name: "davet-sayısı",
            description: "Kaç tane davet eklemek istiyorsun?",
            type: 10,
            required: true
        },
        {
            name: "davet-türü",
            description: "Gerçek davet mi yoksa fake davet mi eklemek istersin?",
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
        .setDescription(`Vermek istediğin davet sayısı 0 veya 0'dan küçük olamaz.`)

        if(deger <= 0) return interaction.reply({ embeds: [hata] })

        const choice = interaction.options.getString("davet-türü")

        if(choice === "gerçek") {
            const nice = new EmbedBuilder()
            .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${kullanıcı} kullanıcısına \`${deger}\` tane \`gerçek\` davet sayısı eklendi.`)
    
            db.add(`realinvite_${kullanıcı.id}_${interaction.guild.id}`, deger)
    
            return interaction.reply({ embeds: [nice] })
        }

        if(choice === "fake") {
            const nice = new EmbedBuilder()
            .setAuthor({ name: `Davet Sistemi`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${kullanıcı} kullanıcısına \`${deger}\` tane \`fake\` davet sayısı eklendi.`)
    
            db.add(`fakeinvite_${kullanıcı.id}_${interaction.guild.id}`, deger)
    
            return interaction.reply({ embeds: [nice] })
        }
    }
}