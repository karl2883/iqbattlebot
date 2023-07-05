const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("begin")
        .setDescription("Begin the game within a party!"),
    async execute(interaction) {
        let party = interaction.client.parties.get(interaction.channelId);
        if (!party) {
            await interaction.reply("There is no party running in this channel! Create one with /start_party.");
            return;
        }

        if (!party.hasParticipant(interaction.user.id)) {
            await interaction.reply("You are not a member of the current party.");
            return;
        }

        if (party.isRunning()) {
            await interaction.reply("The game has already begun!");
            return;
        }
        party.startGame();
        await interaction.reply("The game has begun! Good luck.");
        party.announceNewTurn(interaction, false);
    }
}
