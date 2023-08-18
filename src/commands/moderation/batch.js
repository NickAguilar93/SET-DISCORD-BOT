require("dotenv").config();
const { Client, Collection, Events, IntentsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-batch")
    .setDescription("batch change roles")
    .addRoleOption((option) =>
      option.setName("role1").setDescription("Role to change").setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role2")
        .setDescription("Role to change to")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getRole("role1");
    const selection = interaction.options.getRole("role2");

    client.on("messageCreate", async (msg) => {
      let memberList = msg.guild.roles.cache.get(target.id).members.map(m => m.user.id);
      for(let member in memberList) {
      const memberid = await msg.guild.members.fetch(memberList[member]);
      // memberid.roles.remove(target.id);
      memberid.roles.add(selection.id);
      }
    });
    await interaction.reply("Done!");
  },
};
client.login(process.env.TOKEN);
