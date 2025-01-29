require("dotenv").config();
const { Client, IntentsBitField, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
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
    .setName("assign-role-all")
    .setDescription("Assign one role to all users")
    .addRoleOption((option) =>
      option.setName("role").setDescription("Role to set").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const clientID = interaction.guild.id;
    const targetRole = interaction.options.getRole("role");
    let errorCounter = 0;
    let errorList = [
      {
        username: "",
        description: "",
      },
    ];

    let list = client.guilds.cache.get(clientID);

    try {
      await list.members.fetch();

      let membersInRole = list.roles.cache
        .get(targetRole.id)
        .members.map((m) => m);

      membersInRole.forEach(async (element) => {
        await element.roles.add(targetRole.id);
      });
    } catch (err) {
      console.error(err);
    }

    if (errorCounter > 0) {
      errorList.forEach(async (element) => {
        await console.log(`User: ${element.name} ${description}`);
      });
    }

    await interaction.deferReply("Processing");
    await wait(1200);
    await interaction.editReply({
      content: `${errorCounter} errors occured`,
      ephemeral: true,
    });
  },
};

client.login(process.env.TOKEN);
