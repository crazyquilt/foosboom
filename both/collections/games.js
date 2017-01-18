Games = new Mongo.Collection('games');

Games.allow({
    insert: function(userId, doc) {
        return (userId && doc.ownerId === userId);
    },
    update: function(userId, doc,fields, modifier) {
        return doc.ownerId === userId;
    },
    remove: function(userId,doc) {
        return doc.ownerId === userId;
    },
    fetch: ['ownerId']
});

Meteor.methods({
    gamesInsert: function(teamOneId, teamTwoId) {

        check(Meteor.userId(), String);
        check(teamOneId, String);
        check(teamTwoId, String);
        
        const teamOne = Teams.findOne({_id: teamOneId, ownerId: Meteor.userId()});
        const teamTwo = Teams.findOne({_id: teamTwoId, ownerId: Meteor.userId()});

        if (!teamOne || !teamTwo) {
            throw new Meteor.Error("invalid-parameters","One of the teams doesn't exist in the database");
        }

        const teamOneData = {
            _id: teamOne._id,
            name: teamOne.name,
            score: 0
        };

        const teamTwoData = {
            _id: teamTwo._id,
            name: teamTwo.name,
            score: 0
        };

        const game = {
            ownerId: Meteor.userId(),
            createdAt: new Date(),
            teams: [teamOneData, teamTwoData],
            completed: false
        };

        const gameId = Games.insert(game);

        // Update each tesm's cached array of game ids
        Teams.update({_id: teamOneData._id}, {$addToSet: {gameIds: gameId}});
        Teams.update({_id: teamTwoData._id}, {$addToSet: {gameIds: gameId}});

        // Copy Meteor.insert(), which just returns the _id
        return gameId;
    }
});
