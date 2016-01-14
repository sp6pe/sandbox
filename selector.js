// //RECURSIVE VERSION
// var traverseDomAndCollectElements = function(matchFunc, currEl) {
//   var resultSet = [];

//   if (typeof currEl === "undefined") {
//     currEl = document.body;
//   }

//   if(matchFunc(currEl))
//     resultSet.push(currEl);

//   for(var childKey in currEl.childNodes){
//     resultSet = resultSet.concat(traverseDomAndCollectElements(matchFunc,currEl.childNodes[childKey]));
//   }

//   return resultSet;
// };


var traverseDomAndCollectElements = function(matchFunc, currEl) {
  var resultSet = [];
  
  if (typeof currEl === "undefined") {
    currEl = document.body;
  }

  var el = currEl;
  var q = [el];

  while(q.length){
    el = q.shift();

    if(matchFunc(el))
      resultSet.push(el);

    for(var child in el.childNodes){
      if(typeof el.childNodes[child] == "object" && el.childNodes[child].tagName)
        q.push(el.childNodes[child]);
    }
  };

  return resultSet;
};


// detect and return the type of selector
// return one of these types: id, class, tag.class, tag, 
//
var selectorTypeMatcher = function(selector) {
  if(selector.charAt(0)=="#")
    return "id";
  else if(selector.charAt(0)==".")
    return "class";
  else if(selector.indexOf(">")>-1)
    return "directchild";
  else if(selector.indexOf(" ")>-1)
    return "alllevelsubtags";
  else if(selector.indexOf(".")>-1)
      return "tag.class";
    else
      return "tag";
  };

// NOTE ABOUT THE MATCH FUNCTION
// remember, the returned matchFunction takes an *element* as a
// parameter and returns true/false depending on if that element
// matches the selector.


var matchFunctionMaker = function(selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;
  if (selectorType === "id") {
    matchFunction = function(element){
      // var indexofIDproperty = element.indexOf("id");
      // var whereToStart = indexofIDproperty+4;
      // var wheretoEnd = element.substr(whereToStart).indexOf("\"");

      if(selector.substr(1) == element.id)
        return true;

      return false; 
    };

  } else if (selectorType === "class") {
    //matchFunction
    matchFunction = function(element){
      var classArray =element.className.split(" ");

      for(var key in classArray){
        if(selector.substr(1) == classArray[key])
          return true
      }

      return false;
    }
    
  } else if (selectorType === "tag.class") {
    // define matchFunction for tag.class
    matchFunction = function(element){
      var idexOfperiod = selector.indexOf('.');
      if(selector.substr(idexOfperiod+1) == element.className){
        return true;
      }
      return false;

    }
    
  } else if (selectorType === "tag") {
    // define matchFunction for tag
    matchFunction = function(element){

        //console.log(element);
        if(selector == element.tagName.toLowerCase()){
          return true;
        }
        return false;
      }
    }
    else if (selectorType === "directchild") {
    // define matchFunction when searching for direct children
    matchFunction = function(element){

      var parentTagSelector = selector.substr(0,selector.indexOf(" "));
      var childTagSelector = selector.substr(selector.lastIndexOf(" ")+1, selector.length);
      // console.log(parentTagSelector);
      // console.log(childTagSelector);
      // console.log(element.tagName);      
      if(childTagSelector == element.tagName.toLowerCase())
        if(parentTagSelector== element.parentElement.tagName.toLowerCase())
          return true;          
        
      }
    }
    else if (selectorType === "alllevelsubtags") {
    // define matchFunction for some element which has some ancestor that match the selector "ancestor element"
    matchFunction = function(element){
        //todo ...
      }
    }

    return matchFunction;
  };

  var $ = function(selector) {
    var elements;
    var selectorMatchFunc = matchFunctionMaker(selector);
    elements = traverseDomAndCollectElements(selectorMatchFunc);
    return elements;
  };

