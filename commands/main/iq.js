const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("iq")
        .setDescription("See your current IQ."),
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

        let iq = party.getIQ(interaction.user.id);

        await interaction.reply(`The IQ you are estimated to have is currently **${iq}**.`);
    }
}
