const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const ModSchema = require("../../src/database/Schemas/registerModerator")
const { REGISTER } = require(`../../src/Settings/Config`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register-info")
    .setDescription("Register Info Command.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Bilgisine Bakılcak Yetkili.")
    ),
  async execute(interaction) {
    var user = interaction.options.getMember("user");
    if(!user) user = interaction.user;
    try {
            if(!interaction.member.roles.cache.has(REGISTER.registerModsRole)) return interaction.reply({ content: `Bu komutu kullanabilmek için <@&${REGISTER.registerModsRole}> rolüne ihtiyacınız var.`,  ephemeral: true })
      const userData = await ModSchema.findOne({ userID: user.id });
      if(!userData) return interaction.reply({ content: `Bu kullanıcı veri tabanında bulunmuyor.`, ephemeral: true })

    let users = userData.registeredUsers.sort((a, b) => b.index - a.index)
      let liste = users.map(x => `<@${x}>`)
      const embed = new EmbedBuilder()
        .addFields(
          { name: `Kayıt Sayısı`, value: `${userData.registeredUserSize}` },
          { name: `Kayıt Etdikleri`, value: `${liste.slice().join("\n")}` }
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
