require("dotenv").config();
const {
  Client,
  IntentsBitField,
  PermissionFlagsBits,
  GatewayIntentBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
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
    const clientID = interaction.guild.id;
    const targetRole = interaction.options.getRole("role1");
    const desiredRole = interaction.options.getRole("role2");
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
        await element.roles.remove(targetRole.id);

        await element.roles.add(desiredRole.id);

        if (await element.roles.cache.has(targetRole.id)) {
          errorList.push({
            name: element.displayName,
            description: "role was not removed",
          });
          errorCounter++;
        } else if (await !element.roles.cache.has(desiredRole.id)) {
          errorList.push({
            name: element.displayName,
            description: "role was not added",
          });
          errorCounter++;
        }
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
    await wait(60000);
    await interaction.editReply({
      content: `${errorCounter} errors occured`,
      ephemeral: true,
    })
  },
};
client.login(process.env.TOKEN);
