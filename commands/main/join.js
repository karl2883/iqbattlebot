const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join a party."),
    async execute(interaction) {
        let party = interaction.client.parties.get(interaction.channelId);
        if (!party) {
            await interaction.reply("No party currently exists in this channel. Create one with /start_party!");
            return;
        }
        if (party.hasParticipant(interaction.user.id)) {
            await interaction.reply("You already joined the currently running party!");
            return;
        }
        party.addParticipant(interaction.user.id);
        await interaction.reply("Successfully joined party.");
    }
}

