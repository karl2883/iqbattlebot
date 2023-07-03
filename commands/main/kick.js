const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick someone else out of the party (host only)!")
        .addUserOption(option => option.setName("user").setDescription("The input to echo back").setRequired(true)),

    async execute(interaction) {
        let party = interaction.client.parties.get(interaction.channelId);
        if (!party) {
            await interaction.reply("No party currently exists in this channel.");
            return;
        }
        if (interaction.user.id != party.getHost()) {
            await interaction.reply("You are not the host of the currently running party!");
            return;
        }

        let toBeKicked = interaction.options.getUser("user").id;

        if (!party.hasParticipant(toBeKicked)) {
            await interaction.reply("The user you want to kick is not a participant of the party.");
            return;
        }

        if (interaction.user.id == toBeKicked) {
            await interaction.reply("You can't kick yourself. Use /leave instead. You are the reason I have to handle all of these stupid edge cases.");
            return;
        }

        party.removeParticipant(toBeKicked);
        await interaction.reply(`Successfully kicked <@${toBeKicked}>.`);
    }
}
