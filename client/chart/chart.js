Template.chart.helpers({
  colwidth: function() {
    var amount = Session.get('subset').length;
    var colwidth = 100/amount;

    return colwidth;
  },

  options: function(){ //array of options for the next question
  	return Session.get('subset');
  }

});

Template.chart.onCreated(function() {
  
});

Template.chart.events({
	'click .bar': function(e, instance) {
    e.stopPropagation();
    var obj = Blaze.getData(e.currentTarget);
    var values = Session.get("values");
    var $target = $(e.target).closest('.bar');
    if ($target.hasClass('progress--checked')){
      $target.removeClass('progress--checked');
      var index = values.indexOf(obj.var);
      if (index > -1) {
          values.splice(index, 1);
          Session.set("values", values);
      }
    } else {
      $target.addClass('progress--checked');
      values.push(obj.var);
      Session.set("values", values);
    }
    console.log(Session.get("values"));
	}
});
