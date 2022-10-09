const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const ModSchema = require("../../src/database/Schemas/registerModerator")
const { REGISTER } = require(`../../src/Settings/Config`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register-top")
    .setDescription("Register Top Command."),
  async execute(interaction) {
    try {
    if(!interaction.member.roles.cache.has(REGISTER.registerModsRole)) return interaction.reply({ content: `Bu komutu kullanabilmek için <@&${REGISTER.registerModsRole}> rolüne ihtiyacınız var.`,  ephemeral: true })
    const userData = await ModSchema.find({  });
    let users = userData.sort((a, b) => b.registeredUserSize - a.registeredUserSize);
      let liste = users.map(x => `<@${x.userID}> - ${x.registeredUserSize}`)
      const embed = new EmbedBuilder()
        .setDescription(`${liste.slice().join("\n")}`)
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
