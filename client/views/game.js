Template.game.events({
    'click a.finish-game': function(e, tpl) {
        e.preventDefault();
        Games.update({_id: this._id}, {$set: {completed:true}});
    },
    
    'click a.delete-game': function(e, tpl){
        e.preventDefault();
        const gameId = this._id;
        const teamIdA = this.teams[0]._id;
        const teamIdB = this.teams[1]._id;
        Games.remove(gameId, function(error) {
            if (!error) {
                Teams.update({_id: teamIdA},{$pull: {gameIds: gameId}});
                Teams.update({_id: teamIdB},{$pull: {gameIds: gameId}});
            }
        });
    },

    'click a.score': function(e, tpl) {
        e.preventDefault();
        const data = $(e.currentTarget).data();
        const update = {$inc: {}};
        const selector = 'teams.' + data.index + '.score';
        update.$inc[selector] = data.inc;
        Games.update({_id: this._id},update);
    }
});
