Template.main.onCreated(function() {

  Session.set('q', 0);
  Session.set("values", []);
  Session.set('filters', []);
  Session.set('matches', false);
  Session.set('dismiss', false);
  this.scenario = [
  	{
  		variable: ["gender"],
  		text: "Does love know gender? I‘m looking for...",
  		color: "#4bc1e5",
  	},
  	{
  		variable: ["age"],
  		text: "They say age is just a number...",
  		color: "#8990FF",
  	},
  	{
  		variable: ["valuegraphics_9_classes"],
  		text: "Apperance may grab attention, but personlity captures the heart.",
  		color: "#48BC4B",
  	},
  	{
  		variable: ["pred_person_education"],
  		text: "Street smarts or science facts?",
  		color: "#42c18b",
  	},
  	{
  		variable: ["pred_person_income"],
  		text: "There are people who have money and people who are rich.",
  		color: "#dd58c4",
  	},
  	{
  		variable: ["postal_code"],
  		text: "",
  		color: "#a554d3"
  	}
  ],
  this.filerObj = [];
});

Template.main.helpers({
  text() {
  	var i = Session.get('q');
  	return Template.instance().scenario[i].text;
  },
  moreQuestions() {
  	return !Session.equals('q',5);
  },
  first() {
  	return Session.equals('q',0);
  },
  matches() {
  	return Session.get('matches');
  },
  dismiss(){
  	return Session.get('dismiss');
  }
});

Template.main.onRendered(function() {
	var i = Session.get('q');
	
	var variables = Template.instance().scenario[i].variable;

   Meteor.call('analyticsQuery', variables, [], function(error, result){
   	if(error){
      console.log(error.reason);
    } else {
    	console.log(result);
    	Session.set('count', result.count);
    	Session.set('subset', result.subset);
    }

  });
});

Template.main.events({

  'click .button-next-js': function(event, instance) {
  	event.preventDefault();
  	if (Session.equals('q', 5)){
  		return;
  	}
  	var i = Session.get('q');
  	console.log(i);
  	var values = Session.get('values'); //array
  	if (values.length < 1) return;
  	var filters = Session.get('filters'); //array
  	var filterObj = {
  		"variable": Template.instance().scenario[i].variable,
  		"value": values
  	}

  	filters.push(filterObj);

  	Session.set('filters', filters);
  	
  	var variables = Template.instance().scenario[i+1].variable;
  	$('body').css('background-color', Template.instance().scenario[i].color);
     Meteor.call('analyticsQuery', variables, filters, function(error, result){
     	if(error){
        console.log(error.reason);
      } else {
      	console.log(result);
      	Session.set('count', result.count);
      	Session.set('subset', result.subset);
      	Session.set('q', Session.get('q') + 1);
      	Session.set('values', []); //empty
      	$('.progress--checked').removeClass('progress--checked');
      }

    });
  },

  'click .button-prev-js': function(event, instance) {
  	event.preventDefault();
  	if (Session.equals('q', 0)){
  		return;
  	}

  	var i = Session.get('q');
  	console.log(i);
  	var filters = Session.get('filters'); //array

  	filters.pop();

  	Session.set('filters', filters);

  	Session.set('q', Session.get('q') - 1);
  	var i = Session.get('q');
  	
  	var variables = Template.instance().scenario[i].variable;
  	console.log(i);
  	if (i===0){
  		$('body').css('background-color', '#ff7f66');
  	} else {
  		$('body').css('background-color', Template.instance().scenario[i-1].color);
  	}
     Meteor.call('analyticsQuery', variables, filters, function(error, result){
     	if(error){
        console.log(error.reason);
      } else {
      	console.log(result);
      	Session.set('count', result.count);
      	Session.set('subset', result.subset);
      	Session.set('values', []); //empty
      	$('.progress--checked').removeClass('progress--checked');
      }

    });
  },

  'click .button-dismiss-js': function(event, instance) {
  	Session.set('dismiss', true);
  }
});
