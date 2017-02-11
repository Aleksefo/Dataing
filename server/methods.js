var headers = {
    "x-api-key": "306510XA694E003F8BF3627EFF10CF5CEF3BC497A971AD0",
    "Content-Type": "application/json"
};
var analyticsUrl = "https://api-test.bisnode.fi/people/analytics/v2/query";
var gender_type = {
    "M": "Men", 
    "F": "Women"
};
var age = {
    "18-25": "18-25",
    "26-30": "26-30",
    "31-35": "31-35",
    "36-40": "36-40",
    "41-45": "41-45",
    "46-50": "46-50",
    "51-55": "51-55",
    "56-60": "56-60",
    "61-65": "61-65",
    "66-70": "66-70",
    "71-75": "71-75",
    //"76-80": "76-80",
    //"81-": "81 and more"
}
var valuegraphics = {   
    "1":"Homebodies",        
    "2":"Traditionalists",       
    "3":"Role-model seeking nonconformist",      
    "4":"Fact-centrics",     
    "5":"Open explorers",        
    "6":"Influencers",       
    "7":"Exprience seekers",     
    "8":"Daredevils",        
    "9":"People in the value center"
};
var education = {
    "4": "School of Life",
    "8": "Educated street smarts",
    "10": "Rocket scientists"
};
var money = {
    "3": "Living for the moment",
    "6": "Money is for spending",
    "8": "It's alright",
    "10": "Very, very rich"
};

var post_coord = require('./post_coords.json');


Meteor.methods({

	analyticsQuery: function(variables, filters){

        console.log("\n\n===RECEIVED JOB FROM THE CLIENT===")
        console.log("Variable: " + variables);
        console.log("Filters: " + JSON.stringify(filters));

        _.each(filters, function(filter){
            if (filter.variable.indexOf('age') !== -1) {
                console.log("Age filter detected");
                range = filter.value[0];
                range = range.split(/\-/);
                filter.min = range[0];
                filter.max = range[1] || 100;
                delete filter.value;
            }
            if ((filter.variable.indexOf('pred_person_education') !== -1) || (filter.variable.indexOf('pred_person_income')) !== -1) {
                console.log("Education/money filter detected");
                range = filter.value;
                if (range.length > 1) {
                    filter.min = range[0];
                    filter.max = range[range.length - 1];
                    delete filter.value;
                } else {
                    filter.min = range[0];
                    filter.max = range[0];
                    delete filter.value;
                }
            }
            if (filter.variable.indexOf('pred_person_income') !== -1) {
                console.log("Money filter detected");
            }
        });
        console.log("Filters now: " + JSON.stringify(filters));        

		var data = {
			variables,
			filters
		};

		try {
            var apiCall = Meteor.http.post(analyticsUrl, {
                data, 
                headers
            });
        } catch (error) {
            console.log(error);
            throw new Meteor.Error('Request failed', 'Could not use Analytics API');
        }

        var result = JSON.parse(apiCall.content);
        console.log("Got response: " + apiCall.content);
        var requested = variables[0];
        var toRet = {
            subset: [result.analytics[variables[0]]],
            count: result.count
        };
        var mapping;


        // checking type of API request
        if (requested == "gender") {
            mapping = gender_type;
        } else if (requested == "valuegraphics_9_classes") {
            mapping = valuegraphics;
        } else if (requested == "pred_person_education") {
            var new_edu = {
                4: 0,
                8: 0,
                10: 0
            }
            for (var key in toRet.subset[0]) {
                if (key < 5) {
                    new_edu[4] += toRet.subset[0][key]

                } else if (key < 9) {
                    new_edu[8] += toRet.subset[0][key]
                } else {
                    new_edu[10] += toRet.subset[0][key]
                }
            }
            toRet.subset[0] = new_edu;
            mapping = education;
        } else if (requested == "age") {
            mapping = age;
        } else if (requested == "pred_person_income") {
            var new_income = {
                3: 0, 
                6: 0, 
                8: 0,
                10: 0
            }
            for (var key in toRet.subset[0]) {
                if (key < 4) {
                    new_income[3] += toRet.subset[0][key]

                } else if (key < 7) {
                    new_income[6] += toRet.subset[0][key]
                } else if (key < 9) {
                    new_income[8] += toRet.subset[0][key]
                } else {
                    new_income[10] += toRet.subset[0][key]
                }
            }
            toRet.subset[0] = new_income;
            mapping = money;
        } else if (requested == "postal_code") {
            coords = [];
            for (key in toRet.subset[0]) {
                final = post_coord[parseInt(key)]
                final['index'] = key
                final['density'] = Math.round(toRet.subset[0][key] * 10)
                coords.push(final)
            }
            toRet.subset = coords

        }
        
        // Remapping keys to sensible strings
        var max = 0;
        if (mapping) {
            for (var key in mapping) {
                val = toRet.subset[0][key];
                if (val > max) {
                    max = val;
                }
                topush  = {
                    'var': key,
                    'label': mapping[key],
                    'value': val
                }
                toRet.subset.push(topush);
            }    
            toRet.subset.shift()
        }
        
        if (toRet.subset[0].value) {
            for (var obj in toRet.subset) {
                toRet.subset[obj].value = toRet.subset[obj].value * 100 / max;
            }    
        }
        
        


        console.log("Job done. Returning: \n" + JSON.stringify(toRet));

        return toRet;

	}

});