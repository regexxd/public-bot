const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const UserSchema = require("../../src/database/Schemas/registeredUser");
const { REGISTER } = require(`../../src/Settings/Config`);
const moment = require("moment");
moment.locale("tr");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register-userinfo")
    .setDescription("Register User Command.")
     .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Bilgisine Bakılcak Kullanıcı.")
        .setRequired(true)
    ),
  async execute(interaction) {
    var user = interaction.options.getMember("user");
    try {
    if(!interaction.member.roles.cache.has(REGISTER.registerModsRole)) return interaction.reply({ content: `Bu komutu kullanabilmek için <@&${REGISTER.registerModsRole}> rolüne ihtiyacınız var.`,  ephemeral: true })
    const userData = await UserSchema.findOne({ userID: user.id });

          if(!userData) return interaction.reply({ content: `Bu kullanıcı veri tabanında bulunmuyor.`, ephemeral: true })


      let registers = userData.registersInfo.sort((a, b) => b.date - a.date);

      let liste = registers.map(x => `<@${user.id}> - İsim: ${x.name} Yaş: ${x.age} Cinsiyyet: ${x.type == "boy" ? "Erkek" : "Kız" } Tarih: ${moment(x.date).format("LLL")}`)

      const embed = new EmbedBuilder()
        .addFields(
          { name: `Kayıt Olma Sayısı`, value: `${userData.registeredSize}` },
          { name: `Kayıt Bilgileri`, value: `${liste.slice().join("\n")}` }
        )
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setFooter({
          text: `${interaction.user.tag}  💖`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });
        await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.log(error);
    }
  },
};
