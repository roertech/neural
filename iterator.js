   /****************************************** */
  //***迭代   * */  
 /****************************************** */
   var Iterator = (function iterator() {           
  function constructor(arr) {
    this.arr=arr;
   this.length=arr.length;
   this.index=0; 
  }
  constructor.prototype ={
       constructor :constructor,
         hasNext:function(x){ 
           if (x==undefined){
                x=0;
              } 
                return this.index<this.length+x;  
            },  
            next:function(){  
                var data=this.arr[this.index];  
                this.index=this.index+1;  
               // return data;  
            },  
            reset:function(){  
                this.index=0;  
            },
            set:function(x){

            this.arr[this.index]=x;
            },
            getall:function(){
               return  this.arr;
         },
         get:function(index){
            var v= this.arr;
            return v[index]
         }
     };
  return constructor;
})(); 

module.exports=Iterator;
   