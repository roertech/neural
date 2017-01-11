
//------------------------------------------------------------------------
//
//  constant training data
//------------------------------------------------------------------------
var config = {
	
	
	//-----------------------------------------------
//  used in main
//-----------------------------------------------


//define a custom msg we can use to send to the windproc
//to train the network



//-----------------------------------------------
//  used in CData/CMouse
//-----------------------------------------------

//total number of built in patterns
NUM_PATTERNS:11,//11种样品

//how many vectors each pattern contains
NUM_VECTORS:12,//12个点

//output has to be above this value for the program
//to agree on a pattern. Below this value and it
//will try to guess the pattern
MATCH_TOLERANCE:0.96,



//-----------------------------------------------
//  used in CNeuralNet
//-----------------------------------------------
ACTIVATION_RESPONSE:1.0,
BIAS: -1,

//the learning rate for the backprop.
LEARNING_RATE: 0.5,

//when the total error is below this value the 
//backprop stops training
ERROR_THRESHOLD: 0.003,

NUM_HIDDEN_NEURONS:6,
MOMENTUM :0.9  

  // 其他配置项...
};
module.exports = config;










