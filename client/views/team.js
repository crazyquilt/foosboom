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

        const teamName = tpl.$('input[name=name]').val();
        if(teamName.length) {
            Teams.update(this._id, {$set: {name:teamName}});
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
