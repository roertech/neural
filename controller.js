var config=require('./ini.js');
var Mode = require('./mode.js');
var CData = require('./data.js'); 
var CNeuralNet = require('./cneuralNet.js'); 
  
   /****************************************** */
  //***控制器 * */  
 /****************************************** */
   var Ccontroller= (function ccontroller() {           
  function constructor() {
    //the neural network

  
  //the user mouse gesture paths - raw and smoothed
  this.m_vecPath=new Array();
  this.m_vecSmoothPath=new Array();

  //the smoothed path transformed into vectors
 this.m_vecVectors=new Array();

  //true if user is gesturing
  this.m_bDrawing=false;

  //the highest output the net produces. This is the most
  //likely candidate for a matched gesture.
  this.m_dHighestOutput=0;

  //the best match for a gesture based on m_dHighestOutput
 this.m_iBestMatch=0;

  //if the network has found a pattern this is the match
 this.m_iMatch=0;

  //the raw mouse data is smoothed to this number of points
  this.m_iNumSmoothPoints=0;

  //the number of patterns in the database;
  this.m_iNumValidPatterns=config.NUM_PATTERNS;

  //the current state of the program
  this.m_Mode=new Mode();
 this.m_pNet=new CNeuralNet(config.NUM_VECTORS*2,        //inputs
                         this.m_iNumValidPatterns,  //outputs
                          1,    //1个隐藏层
                          config.NUM_HIDDEN_NEURONS,   //hidden
                          config.LEARNING_RATE);//
                         //4,10,1,10);
  //this class holds all the training data
 this.m_pData=new CData(this.m_iNumValidPatterns, config.NUM_VECTORS);
  //local copy of the application handle
//  HWND    m_hwnd;
   
    
  }
  constructor.prototype ={
       constructor :constructor,
         Clear:function(){ 
         this.m_vecPath=[];
         this.m_vecSmoothPath=[];
         this.m_vecVectors=[]
            },
        Drawing:function(val){
              if (val==true){
                this.Clear();
              }else{

    if (this.Smooth())
    {
      //create the vectors
      this.CreateVectors();

      if (m_Mode.get() == 'ACTIVE')
      {

        if (!this.TestForMatch())
        {
          return false;
        }
      }

      else
      {
        //add the data set if user is happy with it
        if(alert("Happy with this gesture?"))
        {
           //grab a name for this pattern
          //DialogBox(hInstance,
                   // MAKEINTRESOURCE(IDD_DIALOG1),
                  //  m_hwnd,
                  //  DialogProc);

          
           //add the data
           this.m_pData.AddData(this.m_vecVectors, this.m_sPatternName);

           //delete the old network
           delete this.m_pNet;

           this.m_iNumValidPatterns++;

           //create a new network
           this.m_pNet = new CNeuralNet(NUM_VECTORS*2,
                                   m_iNumValidPatterns,
                                   NUM_VECTORS*2,
                                   LEARNING_RATE);

           //train the network
           this.TrainNetwork();

           this.m_Mode.set('ACTIVE')  ;
         }

         else
         {
           //clear dismissed gesture
           this.m_vecPath=[];
         }
      }
    }
  }
    
  this.m_bDrawing = val;

  return true;


        },

        TrainNetwork:function(){

           this.m_Mode.set('TRAINING') ;//训练状态

  if(!this.m_pNet.Train(this.m_pData))
  {
    return false;
  }
 this.m_Mode.set('ACTIVE') ;


  return true;

        },
        CreateVectors:function(){
            for (var p=1; p<this.m_vecSmoothPath.length; p++)
  {    

    var x = this.m_vecSmoothPath[p].x - this.m_vecSmoothPath[p-1].x;
    var  y = this.m_vecSmoothPath[p].y - this.m_vecSmoothPath[p-1].y;

   // SVector2D v1(1, 0);
   // SVector2D v2(x, y);
    
  var v2=new SVector2D({x:x,y:y}); 
    v2.Normalize();
    this.m_vecVectors.push(v2.x);
    this.m_vecVectors.push(v2.y);
  }


        },

        Smooth:function(){
             //make sure it contains enough points for us to work with
  if (this.m_vecPath.length < this.m_iNumSmoothPoints)
  {
    //return
    return false;
  }

  //copy the raw mouse data
  this.m_vecSmoothPath = this.m_vecPath;

  //while there are excess points iterate through the points
  //finding the shortest spans, creating a new point in its place
  //and deleting the adjacent points.
  while (this.m_vecSmoothPath.length > this.m_iNumSmoothPoints)
  {
    var ShortestSoFar = 99999999;

    var PointMarker = 0;

    //calculate the shortest span
    for (var SpanFront=2; SpanFront<this.m_vecSmoothPath.length-1; SpanFront++)
    {
      //calculate the distance between these points
      var length = 
      Math.sqrt( (this.m_vecSmoothPath[SpanFront-1].x - this.m_vecSmoothPath[SpanFront].x) *
            (this.m_vecSmoothPath[SpanFront-1].x - this.m_vecSmoothPath[SpanFront].x) +

            (this.m_vecSmoothPath[SpanFront-1].y - this.m_vecSmoothPath[SpanFront].y)*
            (this.m_vecSmoothPath[SpanFront-1].y - this.m_vecSmoothPath[SpanFront].y));

      if (length < ShortestSoFar)
      {
        ShortestSoFar = length;

        PointMarker = SpanFront;
      }      
    }

    //now the shortest span has been found calculate a new point in the 
    //middle of the span and delete the two end points of the span
    var newPoint={};

    newPoint.x = (this.m_vecSmoothPath[PointMarker-1].x + 
                  this.m_vecSmoothPath[PointMarker].x)/2;

    newPoint.y = (this.m_vecSmoothPath[PointMarker-1].y +
                  this.m_vecSmoothPath[PointMarker].y)/2;

    this.m_vecSmoothPath[PointMarker-1] = newPoint;

    this.m_vecSmoothPath.erase(this.m_vecSmoothPath.begin() + PointMarker);
  }

  return true;

        },
        TestForMatch:function(){
          //input the smoothed mouse vectors into the net and see if we get a match
 var outputs = this.m_pNet.Update(this.m_vecVectors);

  if (outputs.length== 0)
  {
    alert( "Error in with ANN output");

    return false;
  }

  //run through the outputs and see which is highest
  this.m_dHighestOutput = 0;
  this.m_iBestMatch = 0;
  this.m_iMatch = -1;
  
  for (var i=0; i<outputs.length; i++)
  {
    if (outputs[i] > this.m_dHighestOutput)
    {
      //make a note of the most likely candidate
      this.m_dHighestOutput = outputs[i];

      this.m_iBestMatch = i;
 

      //if the candidates output exceeds the threshold we 
      //have a match! ...so make a note of it.
      if (this.m_dHighestOutput > MATCH_TOLERANCE)
      {
        this.m_iMatch = this.m_iBestMatch;                  
      }
    }
  }

  return true;


        }

     
     };
  return constructor;
})(); 


module.exports=Ccontroller;