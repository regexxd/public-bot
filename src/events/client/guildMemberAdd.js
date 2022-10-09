const moment = require("moment");
moment.locale("tr");
const { BOT, REGISTER } = require("../../Settings/Config");

const client = global.client
module.exports = {
  name: 'guildMemberAdd',
  async execute (member) {
    const registerChannel = client.channels.cache.get(REGISTER.registerChannel);
    member.setNickname(`${REGISTER.tag} İsim ${REGISTER.nickMid} Yaş`)
    member.roles.add(REGISTER.unRegisterRoles)
    registerChannel.send({
      content: `Merhabalar <@${member.id}> aramıza hoş geldin. Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı. 
Hesabın ${moment(member.user.createdAt).format("**DD MMMM YYYY hh:mm:ss**")} tarihinde oluşturulmuş.

Sunucumuza kayıt olduğunda kurallar kanalına göz atmayı unutmayınız. Kayıt olduktan sonra kuralları okuduğunuzu 

kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız. 🎉`,
    });
  }
}
