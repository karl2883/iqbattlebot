const { Collection } = require("discord.js");

class Party {

    constructor(hostID) {
        this.hostID = hostID;
        this.participants = new Collection([[hostID, 100]]);
        this.gameHasStarted = false;

    }

    getHost() {
        return this.hostID;
    }

    selectNewHost() {
        for (var [p, _] of this.participants) {
            if (p == this.hostID) continue;
            else {
                this.hostID = p;
                return true;
            }
        }
        return false;
    }
    
    addParticipant(participant) {
        this.participants.set(participant, 100);
    }

    removeParticipant(participant) {
        this.participants.delete(participant);
    }

    hasParticipant(participant) {
        return this.participants.has(participant);
    }
}

module.exports = { Party };
