const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs")

const client = new Client({
    intents: Object.values(Discord.IntentsBitField.Flags),
    partials: Object.values(Partials)
});

const PARTIALS = Object.values(Partials);
const db = require("croxydb");
const config = require("./config.json");
const chalk = require("chalk");

global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs");
const interactionCreate = require("./events/interactionCreate");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(chalk.red`[COMMAND]` + ` ${props.name} komutu yüklendi.`)

});

readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(chalk.blue`[EVENT]` + ` ${name} eventi yüklendi.`)
});

client.login(config.token)

const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

tracker.on('guildMemberAdd', (member, type, invite) => {

    const data = db.get(`davetsistem_${member.guild.id}`)
    if (!data) return;
    const welcomeChannel = member.guild.channels.cache.get(data.channel)
    if (!welcomeChannel) return db.delete(`davetsistem_${member.guild.id}`);

    const invited = db.get(`invited_${member.id}_${member.guild.id}`)
    if (invited) {
  
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${member.user.username} sunucuya katıldı!`, iconURL: member.displayAvatarURL() })
                .setDescription(`${member} Sunucuya katıldı. Daha önce <@${invited.davetci}> tarafından davet edilmişsin.\n\n\`${invited.davetkodu}\` davet kodunu kullanarak giriş yapmıştın.`)
                .setFooter({ text: `${invite.inviter.username} tarafından davet edildi`, iconURL: invite.inviter.displayAvatarURL() })
                .setTimestamp()

            db.add(`fakeinvite_${invited.davetci}_${member.guild.id}`, 1)
            return welcomeChannel.send({ embeds: [embed] })
    }

      if (type === 'normal') {

        const xd = db.get(`realinvite_${invite.inviter.id}_${member.guild.id}`) || "1"

            const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} sunucuya katıldı!`, iconURL: member.user.displayAvatarURL() })
            .setDescription(`${member} Sunucuya katıldı. **${invite.inviter.username}** tarafından davet edildi, Davet Sayısı (**${xd}**)\n\nKullanıcı \`${invite.code}\` davet kodunu kullanarak giriş yaptı.`)
                .setFooter({ text: `${invite.inviter.username} tarafından davet edildi`, iconURL: invite.inviter.displayAvatarURL() })
                .setTimestamp()

            db.set(`invited_${member.id}_${member.guild.id}`, { davetci: invite.inviter.id, davetkodu: invite.code })
            db.add(`realinvite_${invite.inviter.id}_${member.guild.id}`, 1)
            return welcomeChannel.send({ embeds: [embed] })
    }

      if (type === 'permissions') {
       
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} sunucuya katıldı!`, iconURL: member.user.displayAvatarURL() })
            .setDescription(`${member} Sunucuya katıldı. Yetkim olmadığı için kimin tarafından davet edildiğini bulamadım.`)
                .setFooter({ text: `Yetki vermezsen böyle olur işte` })
                .setTimestamp()

            return welcomeChannel.send({ embeds: [embed] })
    }

    if (type === 'unknown') {
  
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.username} sunucuya katıldı!`, iconURL: member.user.displayAvatarURL() })
        .setDescription(`${member} Sunucuya katıldı. Kim tarafından davet edildiğini bulamadım.`)
            .setFooter({ text: `Kim tarafından geldiğini bilmiyorum.` })
            .setTimestamp()

        return welcomeChannel.send({ embeds: [embed] })
}
//larex
 if (type === 'vanity') {
  
    const embed = new EmbedBuilder()
    .setAuthor({ name: `${member.user.username} sunucuya katıldı!`, iconURL: member.user.displayAvatarURL() })
    .setDescription(`${member} Sunucuya katıldı. Özel URL kullanarak giriş yapmış.`)
        .setFooter({ text: `Özel URL kullanmış.` })
        .setTimestamp()

        db.set(`invited_${member.id}_${member.guild.id}`, { davetci: "Özel URL" })
    return welcomeChannel.send({ embeds: [embed] })
}
})

client.on('guildMemberRemove', (member) => {

    const data = db.get(`davetsistem_${member.guild.id}`)
    if (!data) return;
    const welcomeChannel = member.guild.channels.cache.get(data.channel);
    if (!welcomeChannel) return db.delete(`davetsistem_${member.guild.id}`);

    const invited = db.get(`invited_${member.id}_${member.guild.id}`)
    if (invited) {

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.username} sunucudan ayrıldı!`, iconURL: member.user.displayAvatarURL() })
            .setDescription(`${member} Sunucudan ayrıldı, (<@${invited.davetci}>) Tarafından davet edilmişti.\n\nKullanıcı \`${invited.davetkodu}\` davet kodunu kullanarak giriş yapmıştı.`)
            .setFooter({ text: `Kullanıcı sunucudan ayrıldı.` })
            .setTimestamp()

       db.add(`realinvite_${invited.davetci}_${member.guild.id}`, -1)
         welcomeChannel.send({ embeds: [embed] })

            if (invited.davetci === "Özel URL") {

                const embed = new EmbedBuilder()
                .setAuthor({ name: `${member.user.username} sunucudan ayrıldı!`, iconURL: member.user.displayAvatarURL() })
                    .setDescription(`${member} Sunucudan ayrıldı, Özel URL kullanarak sunucuya giriş yapmıştı.`)
                    .setFooter({ text: `Kullanıcı sunucudan ayrıldı.` })
                    .setTimestamp()
    
                 return welcomeChannel.send({ embeds: [embed] })
            }
    }
    
     else {

            const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} sunucudan ayrıldı!`, iconURL: member.user.displayAvatarURL() })
                .setDescription(`${member} Sunucudan ayrıldı, kim tarafından davet edildiğini bulamadım.`)
                .setFooter({ text: `${invited.davetci} tarafından davet edilmişti`, iconURL: invited.davetci.displayAvatarURL() })
                .setTimestamp()

            return welcomeChannel.send({ embeds: [embed] })
    }
})