Template.team.helpers({
    isEditingTeam: function() {
        return Session.get('editedTeamId') === this._id;
    }
});

Template.team.events({
    'click a.edit': function(e, tpl) {
        e.preventDefault();
        Session.set('editedTeamId', this._id);
    },

    'submit form.form-edit': function(e,tpl) {
        e.preventDefault();

        const teamName = tpl.$("input[name='name']").val();
        const self = this;

        if(teamName.length) {
            Meteor.call("teamUpdate", this._id, teamName, function(error) {
                if (error) {
                    alert(error.reason);
                    Session.set('editedTeamId', self._id);
                    Tracker.afterFlush(function() {
                        tpl.$("input[name='name']").val(teamName);
                        tpl.$("input[name='name']").focus();
                    });
                }
            });

            Session.set('isEditingTeam', null);
            /*
            Teams.update(this._id, {$set: {name:teamName}}, function(error) {

                if (!error) {

                    // Update games this team is a part of
                    const games = Games.find({_id: {$in: self.gameIds}});
                    if (games.count()) {
                        _(games.fetch()).each(function(game) {
                            const team = _(game.teams).findWhere({_id: self._id});
                            if(team !== null ) {
                                team.name = teamName;
                                Games.update({_id:game._id}, {$set: {teams:game.teams}})
                            }
                        });
                    }
                }
            });
            Session.set('editedTeamId',null); */
        }
    },

    'click a.cancel': function(e, tpl) {
        e.preventDefault();
        Session.set('editedTeamId', null);
    },

    'click a.remove': function(e, tpl) {
        e.preventDefault();
        Teams.remove(this._id);
    }
});
