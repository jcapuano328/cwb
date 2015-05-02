angular.module('cwb.services')

.factory('Stragglers', function($log, Morale) {

	var lossResults = [
    	{
        	low: 0.5,
            high: 1,
            results: [
            	{
                	morale: 'A',
                    results: [0, 0, 0, 0, 0, 1, 1, 1]
                },
            	{
                	morale: 'B',
                    results: [0, 0, 0, 1, 1, 1, 1, 2]
                },
            	{
                	morale: 'C',
                    results: [0, 0, 1, 1, 1, 1, 2, 2]
                },
            	{
                	morale: 'D',
                    results: [1, 1, 1, 1, 1, 2, 2, 2]
                },
            	{
                	morale: 'E',
                    results: [1, 1, 1, 2, 2, 2, 3, 3]
                }
            ]
        },
        
    	{
        	low: 1.5,
            high: 999,
            results: [
            	{
                	morale: 'A',
                    results: [0, 0, 0, 1, 1, 1, 2, 2]
                },
            	{
                	morale: 'B',
                    results: [1, 1, 1, 1, 2, 2, 3, 3]
                },
            	{
                	morale: 'C',
                    results: [1, 1, 1, 2, 2, 3, 3, 3]
                },
            	{
                	morale: 'D',
                    results: [1, 2, 2, 3, 3, 3, 4, 4]
                },
            	{
                	morale: 'E',
                    results: [2, 2, 2, 3, 3, 3, 4, 4]
                }
            ]
        }
    ];
    
    var recoverResults = [
    	{
        	morale: 'A',
            levels: [1, 5, 6]
        },
    	{
        	morale: 'B',
            levels: [2, 5, 6]
        },
    	{
        	morale: 'C',
            levels: [3, 6, 0]
        },
    	{
        	morale: 'D',
            levels: [4, 6, 0]
        },
    	{
        	morale: 'E',
            levels: [4, 6, 0]
        }
    ];
    
    var Stragglers = {
    
    	losses: function(stragglerdie, casualty, moralelevel, moralestate, column, mounted, night, wrecked) {
			if (mounted || column || Morale.isDisorganized(moralestate)) {
				stragglerdie++;
			}                
			if (night || wrecked || Morale.isRouted(moralestate)) {
				stragglerdie += 2;
			}                
			
            var table = _.find(lossResults, function(sr) {
            	return (casualty >= sr.low && casualty <= sr.high);
            });
            if (table) {
            	var result = _.find(table.results, function(r) {
                	return r.morale == moralelevel;
                });
                if (result) {
					stragglerdie--; // index-ize
					if 		(stragglerdie < 0) {
                    	stragglerdie = 0;
					}                        
					else if (stragglerdie >= result.results.length) {
                    	stragglerdie = result.results.length - 1;
					}                        
					
                    return result.results[stragglerdie];
                }
            }
            return 0;
		},
        
		recover: function(recoverdie, moralelevel, night) {
			
			if (night) {
				recoverdie += 2;
			}                
			recoverdie = Math.min(recoverdie, 6);
			
            var r = _.find(recoverResults, function(rr) {
            	return moralelevel == rr.morale;
            });
            if (r) {
				return _.find(r.levels, function(l) {
                	return recoverdie <= l;
                }) || 0;
            }
            return 0;
		}
    };
    
    return Stragglers;
});
