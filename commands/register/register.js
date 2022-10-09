const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { REGISTER } = require(`../../src/Settings/Config`)
const ModSchema = require("../../src/database/Schemas/registerModerator")
const UserSchema = require("../../src/database/Schemas/registeredUser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register Command.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Kayıt Edilcek Kullanıcı.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Kayıt Edilcek Kullanıcı Tipi.")
        .setRequired(true)
        .addChoices(
          { name: "Erkek", value: "boy" },
          { name: "Kız", value: "girl" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Kayıt Edilcek Kullanıcı İsim.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("age")
        .setDescription("Kayıt Edilcek Kullanıcı Yaş.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getMember("user");
    const type = interaction.options.getString("type");
    const name = interaction.options.getString("name");
    const age = interaction.options.getNumber("age");
    const moderator = interaction.user;

    try {
      if(!interaction.member.roles.cache.has(REGISTER.registerModsRole)) return interaction.reply({ content: `Bu komutu kullanabilmek için <@&${REGISTER.registerModsRole}> rolüne ihtiyacınız var.`,  ephemeral: true })
      if(interaction.channel.id !== REGISTER.registerChannel) return interaction.reply({ content: `Burası kayıt kanalı değil! lütfen komutu <#${REGISTER.registerChannel}> -da kullanınız.`,  ephemeral: true })
      
      const registerMod = await ModSchema.findOne({ guildID: interaction.guild.id, userID: moderator.id });
      const registeredUserSize = registerMod.registeredUserSize + 1;
      const LogEmbed = new EmbedBuilder()
        .addFields(
          { name: `Kayıt Edilen`, value: `${user}` },
          { name: `Kayıt Eden`, value: `${moderator}` },
          { name: `Kayıt Edilen Bilgiler`, value: `İsim: ${name} Yaş: ${age}` },
          { name: `Kayıtçı Kayıt Sayısı`, value: `${registeredUserSize}` }
        )
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setFooter({
          text: `${interaction.user.tag}  💖`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });
      await interaction.reply({ embeds: [ LogEmbed ] })
      await interaction.client.channels.cache.get(REGISTER.logChannel).send({ embeds: [ LogEmbed ] })
      
      if(type === 'boy') {
        await user.roles.set(REGISTER.boyRoles);
      } 
      if(type === 'girl') {
       await user.roles.set(REGISTER.girlRoles);
      }
      
      await user.setNickname(`${REGISTER.tag} ${name} ${REGISTER.nickMid} ${age}`);
      
      var registeredUserData = { name: name, age: age, type: type, date: Date.now() };
      
      await UserSchema.findOneAndUpdate({ guildID: interaction.guild.id, userID: user.id }, { $push: {registersInfo: registeredUserData } }, { upsert: true })
      await ModSchema.findOneAndUpdate({ guildID: interaction.guild.id, userID: moderator.id }, { $push: { registeredUsers: user.id } }, { upsert: true });
      await UserSchema.findOneAndUpdate({ guildID: interaction.guild.id, userID: user.id }, { $inc: { registeredSize: 1 } }, { upsert: true });
      await ModSchema.findOneAndUpdate({ guildID: interaction.guild.id, userID: moderator.id }, { $inc: { registeredUserSize: 1 } }, { upsert: true });
    } catch (error) {
      console.log(error);
    }
  },
};
