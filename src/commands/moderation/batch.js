require("dotenv").config();
const {
  Client,
  IntentsBitField,
  PermissionFlagsBits,
  GatewayIntentBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.GuildMembers,
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const targetRole = interaction.options.getRole("role1");
    const desiredRole = interaction.options.getRole("role2");
    let list = client.guilds.cache.get(process.env.GUILD_ID);

    try {
      await list.members.fetch();

      let membersInRole = list.roles.cache
        .get(targetRole.id)
        .members.map((m) => m);

      membersInRole.forEach(async (element) => {
        await element.roles.remove(targetRole.id);
        await element.roles.add(desiredRole.id);
      });
      // console.log(role1);
    } catch (err) {
      console.error(err);
    }
    await interaction.reply("Done!");
  },
};
client.login(process.env.TOKEN);
