angular.module('cwb.services')

.factory('Orders', function() {
	var acceptances = [
    	{
        	acceptance: -3,
            statuses: [4,4,3,3,3,3,2,3,4,4,4]
        },
    	{
        	acceptance: -1,
            statuses: [4,4,3,3,3,2,2,3,3,4,4]
        },
    	{
        	acceptance: 1,
            statuses: [4,4,3,3,3,2,2,2,3,3,4]
        },
    	{
        	acceptance: 3,
            statuses: [4,4,3,3,1,2,2,2,3,3,3]
        },
    	{
        	acceptance: 5,
            statuses: [4,3,2,1,2,2,3,1,2,2,3]
        },
    	{
        	acceptance: 7,
            statuses: [4,3,1,1,2,2,2,1,1,3,3]
        },
    	{
        	acceptance: 999,
            statuses: [4,3,1,1,1,2,2,1,2,3,3]
        }
    ];

	var stoppage = [
    	{
        	leader: 0,
            stoppage: [4, 7, 10, 12]
		},
    	{
        	leader: 2,
            stoppage: [3, 6, 9, 11]
		},
    	{
        	leader: 4,
            stoppage: [3, 5, 8, 10]
		}
    ];
    var stoppagePoints = [
    	{
        	totdivs: 1,
            pts: [1,3,4]
        },
    	{
        	totdivs: 2,
            pts: [1,2,3,4]
        },
    	{
        	totdivs: 3,
            pts: [1, 2, 2, 3, 4]
        },
    	{
        	totdivs: 4,
            pts: [1, 2, 2, 2, 3, 4]
        },
    	{
        	totdivs: 5,
            pts: [1, 1, 2, 2, 3, 3, 4]
        },
    	{
        	totdivs: 6,
            pts: [1, 1, 2, 2, 2, 3, 3, 4]
        },
    	{
        	totdivs: 7,
            pts: [1, 1, 2, 2, 2, 2, 3, 3, 4]
        },
    	{
        	totdivs: 8,
            pts: [1, 1, 2, 2, 2, 2, 2, 3, 3, 4]
        },
    	{
        	totdivs: 9,
            pts: [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4]
        },
    	{
        	totdivs: 10,
            pts: [1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4]
        }
    ];
    
        
	function getInitiative(init) {
		if (init <= 0) {
			return 12;
		}
		else if (init <= 2) {
			return 11;
		}
		else if (init <= 3) {
			return 10;
		}
		else if (init <= 4) {
			return 9;
		}
		return 12;
	}
    
	function getAcceptance(acceptance) {
    	return _.find(acceptances, function(oa) {
        	return acceptance <= oa.acceptance;
        });
	}
        
    
	return {
        methods: [
	        {
	          method: "AO",
              desc: 'Aide Oral', 
	          acceptance: -1,
              cost: 2
	        },
	        {
	          method: "AW", 
              desc: 'Aide Written', 
	          acceptance: 0,
              cost: 5
	        },
	        {
	          method: "IPV", 
              desc: 'In Person Verbal', 
	          acceptance: 2,
              cost: 2
	        },
	        {
	          method: "Init", 
              desc: 'Initiative', 
	          acceptance: 0,
              cost: 0
	        }
        ],
        getMethod: function(method) {
        	return _.find(this.methods, function(m) {return m.method == method;});
        },
		
		types: [
        	{
              type: "Simple",
              desc: "Simple",
              acceptance: 0, 
              cost: 1
			},
        	{
              type: "Complex",
              desc: "Complex",
              acceptance: -2, 
              cost: 3
			}
        ],
        getType: function(type) {
        	return _.find(this.types, function(t) {return t.type == type;});
        },
		
		statuses: [
        	{
              type: "InTransit",
              desc: "In Transit",
              delayreduction: 0
			},
        	{
              type: "Accepted",
              desc: "Accepted",
              delayreduction: 0
			},
        	{
              type: "Delay1",
              desc: "Delay 1",
              delayreduction: 2
			},
        	{
              type: "Delay2",
              desc: "Delay 2",
              delayreduction: 1
			},
        	{
              type: "Distorted",
              desc: "Distorted",
              delayreduction: 0
			},
        	{
              type: "Stopped",
              desc: "Stopped",
              delayreduction: 0
			}
        ],
        getStatus: function(status) {
        	return _.find(this.statuses, function(s) {return s.type == status;});
        },
        
		cost: function(order) {
        	var cost = 0;
            var method = _.find(this.methods, function(method) {
            	return order.method === method.method;
            });
            var type = _.find(this.types, function(type) {
            	return type.type == order.type;
            });
            
            cost = (method ? method.cost : 0) + 
            		(type ? type.cost : 0);
			return cost;                   
		},
        
        
		initiative: function(dice, initiative, antiinitiative) {
			if (dice == 2) {
				return "Loose Cannon";
			}                
			
			var initpts = initiative - antiinitiative; 
            var init = getInitiative(initpts);
			if (dice >= init) {
				return "Initiative";
			}                
			return "Indecision";
		},
        
        accept: function(dice, sender, receiver, currentorders, method, type) {
        	var method = _.find(this.methods, function(om) {
            	return om.method == method;
            });
        	var type = _.find(this.types, function(ot) {
            	return ot.type == type;
            });
        
        	var accept = sender + receiver + method.acceptance + type.acceptance + (currentorders ? -1 : 0);
            
            var oa = getAcceptance(accept);
			
            // turn into an index
            dice -= 2;
            
            return this.statuses[oa.statuses[dice]];
        },
        
        delayReduction: function(die, status) {
        	var os = _.find(this.statuses, function(s) {
            	return s.type == status;
            });
            
            if (os && die <= os.delayreduction) {
            	return this.statuses[1];	// accepted
            }
            return os;	// original status
        },
        
        stop: function(dice, totaldiv, wreckeddiv, leader, leaderlost, defensiveorder, night) {
        	
			if (leaderlost) { wreckeddiv++; }
			if (night) { dice -= 3; }
			if (defensiveorder) { dice++; }
			
			var osp = _.find(stoppagePoints, function(osp) {
            	return osp.totdivs <= totaldiv;
            });
            if (wreckeddiv >= osp.pts.length) {
            	wreckeddiv = osp.pts.length - 1;
            }
            var stop = osp.pts[wreckeddiv] - 1;	// index-ify
            var os = _.find(stoppage, function(os) {
            	return os.leader <= leader;
            });
            
			if (dice < os.stoppage[stop])
            	return this.statuses[5];	// stopped
			return this.statuses[1];	// still accepted
        }
        
        
	};
});
