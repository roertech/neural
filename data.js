var InputVectors=
[
  [1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0],                                 //right

  [-1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0],                     //left

  [0,1, 0,1, 0,1, 0,1, 0,1, 0,1, 0,1, 0,1, 0,1, 0,1, 0,1, 0,1],                                 //down

  [0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1],                     //up

  [1,0, 1,0, 1,0, 0,1, 0,1, 0,1, -1,0, -1,0, -1,0, 0,-1, 0,-1, 0,-1],                           //clockwise square

  [-1,0, -1,0, -1,0, 0,1, 0,1, 0,1, 1,0, 1,0, 1,0, 0,-1, 0,-1, 0,-1],                           //anticlockwise square

  [1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, 1,0, -0.45,0.9, -0.9, 0.45, -0.9,0.45],              //Right Arrow 
  
  [-1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, -1,0, 0.45,0.9, 0.9, 0.45, 0.9,0.45],        //Left Arrow

  [-0.7,0.7, -0.7,0.7, -0.7,0.7, -0.7,0.7, -0.7,0.7, -0.7,0.7, -0.7,0.7, -0.7,0.7,             //south west
  -0.7,0.7, -0.7,0.7, -0.7,0.7, -0.7,0.7],

  [0.7,0.7, 0.7,0.7, 0.7,0.7, 0.7,0.7, 0.7,0.7, 0.7,0.7, 0.7,0.7, 0.7,0.7, 0.7,0.7,            //south east
  0.7,0.7, 0.7,0.7, 0.7,0.7],    
  
  [1,0, 1,0, 1,0, 1,0, -0.72,0.69,-0.7,0.72,0.59,0.81, 1,0, 1,0, 1,0, 1,0, 1,0]              //zorro
]; 

var Names=
[
  "Right",
  "Left",
  "Down",
  "Up",
  "Clockwise Square",
  "Anti-Clockwise Square",
  "Right Arrow",
  "Left Arrow",
  "South West",
  "South East",
  "Zorro"

];
//--------------------------------- Init ---------------------------------
//
//  初始化训练数据
//------------------------------------------------------------------------

var CData = (function cdata() {           
  function constructor(m_NumInputs,NUM_VECTORS) {
    
    //these will contain the training set when created.
 this.m_SetIn=new Array();//输入的训练数据
 this.m_SetOut=new Array();//输出的训练数据

  //the names of the gestures
 this.m_vecNames=new Array();//训练模式的名称

  //the vectors which make up the gestures
  this.m_vecPatterns=new Array();//重新构建的训练数据集

  //number of patterns loaded into database
  this.m_iNumPatterns=m_NumInputs;//11种模式

  //size of the pattern vector
  this.m_iVectorSize=NUM_VECTORS;//每种12个输入，24个输入
    this.init();//数据初始化
    this.CreateTrainingSetFromData();
  }
  constructor.prototype ={
       constructor :constructor,
       init :function(){//把数据重新输入到 类变量中，好处是让数据无限延展

          console.log('数据初始化');
            for (var ptn=0; ptn<this.m_iNumPatterns; ptn++)  //11
  {
    //add it to the vector of patterns
    var temp=new Array();

    for (var v=0; v<this.m_iVectorSize*2; v++)
    {
      temp.push(InputVectors[ptn][v]);
    }
    
    this.m_vecPatterns.push(temp);

    //add the name of the pattern
   this.m_vecNames.push(Names[ptn]);
  }
 console.log('需要训练的数据：'+this.m_vecPatterns);//需要训练的数据
       },


       GetInputSet:function(){return this.m_SetIn},
       GetOutputSet:function(){return this.m_SetOut},
  // --------------------------- CreateTrainingSetFromData -----------------
//
//  this function creates a training set from the data defined as constants
//  in CData.h. 
//------------------------------------------------------------------------

  CreateTrainingSetFromData:function(){

   //清空
 this.m_SetIn=new Array();
 this.m_SetOut=new Array();

 //add each pattern
  for (var ptn=0; ptn<this.m_iNumPatterns; ptn++)
  {    
    //把训练数据增加到输入输入数据中
    this.m_SetIn.push(this.m_vecPatterns[ptn]);

    //创建当前模式的输出向量，输出向量的模式的个数就是需要识别的模式的个数
    //
    //
    var outputs=new Array(this.m_iNumPatterns);
      for (var i=0;i<this.m_iNumPatterns;i++){//初始值位0
   outputs[i]=0;
   }
    //对this.m_SetIn 的模式进行关联
    outputs[ptn] = 1;

    //设置期望设置的数据
    this.m_SetOut.push(outputs);
  }
 console.log('输入值：'+this.m_SetIn);
 console.log('输出值：'+this.m_SetOut);

  },

  
 
  //------------------------- PatternName ----------------------------------
//
//  returns the pattern name at the given value
//------------------------------------------------------------------------
PatternName:function(val)
{
  if (this.m_vecNames.length > 0)
  {
    return this.m_vecNames[val];
  }
  else
  {
    return "";
  }
},

//------------------------- AddData -------------------------------------
//
//  adds a new pattern to data
//-----------------------------------------------------------------------
AddData:function(data,NewName)
{
  //check that the size is correct
  if (data.length != this.m_iVectorSize*2)
  {
    alert("Incorrect Data Size,Error");
    return false;
  }

  //add the name
  this.m_vecNames.push(NewName);

  //add the data
  this.m_vecPatterns.push(data);

  //keep a track of number of patterns
  this.m_iNumPatterns++;
  
  //create the new training set
  this.CreateTrainingSetFromData();

  return true; 
}

       }
        return constructor;
     }
 
)();

module.exports=CData;











