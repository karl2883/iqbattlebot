
const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../party.js");
const axios = require("axios").default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("trivia")
        .setDescription("Challenge another person with a trivia question when it's your turn.")
        .addUserOption( option => option
            .setName("target_user")
            .setDescription("The user you want to challenge")
            .setRequired(true))
        .addStringOption( option => option
            .setName("category")
            .setDescription("Category of the trivia question")
            .setRequired(true)
            .addChoices(
                { name: "General knowledge", value: "general_knowledge" },
                { name: "Society and culture", value: "society_and_culture" },
                { name: "Music", value: "music" },
                { name: "Sports and leisure", value: "sports_and_leisure" },
                { name: "Geography", value: "geography" },
                { name: "Science", value: "science" },
                { name: "Film and TV", value: "film_and_tv" },
                { name: "Arts and literature", value: "arts_and_literature" },
                { name: "History", value: "history" },
                { name: "Food and drinks", value: "food_and_drink" }
            ))
        .addStringOption( option => option
            .setName("difficulty")
            .setDescription("Difficulty of the trivia question")
            .setRequired(true)
            .addChoices(
                { name: "Easy", value: "easy" },
                { name: "Medium", value: "medium" },
                { name: "Hard", value: "hard" }
            )),
    async execute(interaction) {
        let party = interaction.client.parties.get(interaction.channelId);
        if (!party) {
            await interaction.reply("No party currently exists in this channel.");
            return;
        }

        if (!party.isRunning()) {
            await interaction.reply("The party has not been actually started yet! Do so with /begin.");
            return;
        }

        let target_user_id = interaction.options.getUser("target_user").id;


        if (!party.hasParticipant(interaction.user.id)) {
            await interaction.reply("You are not a participant of this party.");
            return;
        }
        if (party.getCurrentTurnPlayer() != interaction.user.id) {
            await interaction.reply("It's not your turn! Have some patience.");
            return;
        }
        if (!party.hasParticipant(target_user_id)) {
            await interaction.reply("The user you want to target with your question is not a participant of this party!");
            return;
        }

        if (party.isInTriviaQuestion()) {
            await interaction.reply("There is already a trivia question going on! Have some patience.");
            return;
        }

        party.setChallenged(target_user_id);

        let questionPromise = fetchQuestion(interaction.options.getString("category"), interaction.options.getString("difficulty"));

        // check if it's the users turn

        let msgtext = `<@${interaction.user.id}> challenges <@${target_user_id}> to a trivia battle! Answer with the correct letter first to win!\nThe question will be revealed in... 5`;

        await interaction.reply(msgtext); 

        let currentPromise = null;

        for (let i=4; i>=0; i--) {
            msgtext = msgtext.slice(0, -1) + `${i}`;
            if (i == 0) {
                msgtext += '!';
            }
            await delay(1000);
            currentPromise = interaction.editReply(msgtext);
        }
        await currentPromise;

        let question = await questionPromise;
        let question_data = question.data[0];

        let quiz_text = question_data.question.text + "\n";

        let correct_answer_position = Math.floor(Math.random() * 4);
        let correct_answer = question_data.correctAnswer;
        let incorrect_answers = shuffleArray(question_data.incorrectAnswers);
        
        let letters = ["A", "B", "C", "D"];

        for (let i=0; i<4; i++) {
            let answer;
            if (i == correct_answer_position) {
                answer = correct_answer;
            } else {
                answer = incorrect_answers.pop();
            }
            quiz_text += `${letters[i]}) ${answer}\n`;
        }

        party.setCorrectAnswer(letters[correct_answer_position]);

        await interaction.followUp(quiz_text);
        
        // timeout handling
    }
}


async function fetchQuestion(category, difficulty) {
    return axios({
        method: "get",
        url: "https://the-trivia-api.com/v2/questions",
        params: {
            limit: 1,
            difficulties: difficulty,
            categories: category
        }
    });
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
