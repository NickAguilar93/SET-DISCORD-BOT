require("dotenv").config();
const { Client, IntentsBitField, PermissionFlagsBits } = require("discord.js");
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const target = interaction.options.getRole("role1");
    const selection = interaction.options.getRole("role2");

    client.on("messageCreate", async (msg) => {
      let memberList = msg.guild.roles.cache
        .get(target.id)
        .members.map((m) => m.user.id);
      for (let member in memberList) {
        // const memberid = await msg.guild.members.fetch(memberList[member]);
        // //Make sure bot role has permission
        // console.log(`\nWorking on User ${memberid.displayName}`);
        // await memberid.roles.remove(target.id).then(memberid.roles.add(selection.id));
        // const user = await msg.guild.members.fetch({user:memberid, force:true});
        // console.log(user);
        // if (user.role) {
        //   console.log(
        //     `Role ${selection.name} was successfully added to user ${user.displayName}`
        //   );
        // } else {
        //   console.log(
        //     `Role ${selection.name} was not added to user ${user.displayName}`
        //   );
        // }

        // if (!user.roles.cache.has(target.id)) {
        //   console.log(
        //     `Role ${target.name} was successfully removed from user ${user.displayName}`
        //   );
        // } else {
        //   console.log(
        //     `Role ${target.name} was not removed from user ${user.displayName}`
        //   );
        // }
        let currentUser = await msg.guild.members.fetch(memberList[member]);
        if (currentUser.roles.cache.has(target.id)) {
          await currentUser.roles.remove(target.id);
        }
        if (!currentUser.roles.cache.has(target.id)) {
          console.log(
            `${target.name} role was removed from ${currentUser.displayName}`
          );
          currentUser.roles.add(selection.id);
          currentUser = await msg.guild.members.fetch(memberList[member]);
          if (currentUser.roles.cache.has(selection.id)) {
            console.log(
              `${selection.name} role was added to ${currentUser.displayName}`
            );
          } else {
            console.log(
              `${selection.name} role was not added to ${currentUser.displayName}`
            );
          }
        } else {
          console.log(
            `${target.name} role was not removed from ${currentUser.displayName}`
          );
        }
      }
    });
    await interaction.reply("Done!");
  },
};
client.login(process.env.TOKEN);
