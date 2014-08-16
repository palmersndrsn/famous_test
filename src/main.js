define(function(require, exports, module) {
  // import dependencies
  var Engine = require('famous/core/Engine');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  var MouseSync     = require("famous/inputs/MouseSync");
  var TouchSync     = require("famous/inputs/TouchSync");
  var ScrollSync    = require("famous/inputs/ScrollSync");
  var GenericSync   = require("famous/inputs/GenericSync");
  // // create the main context
  // var mainContext = Engine.createContext();


//   // your app here
//   var logo = new ImageSurface({
//       size: [1000, 700],
//       content: 'http://lifeblasters.com/awesome/wp-content/uploads/2013/11/juliansmasho-42-4.jpg',
//       classes: ['double-sided']
//   });
// // var rotateModifierOne = new StateModifier({
// //   transform: Transform.rotateZ(Math.PI/)
// // });




//   Engine.on('keydown', function(e) {
//    surface.setContent(e.which);
//   });


// stack overflow example

// var Engine    = require("famous/core/Engine");
// // var TouchSync = require("famous/inputs/TouchSync");
// var Surface   = require("famous/core/Surface");

// var mainContext = Engine.createContext();

// var touches = {};

// var touchSync = new TouchSync(function() { return position; });

// Engine.pipe(touchSync);

// var contentTemplate = function() {

//     var string = "";

//     for (var key in touches ) {
//       var touch = touches[key];
//       var x     = touch.clientX ? touch.clientX : "" ;
//       var y     = touch.clientY ? touch.clientY : "" ;
//       string += "key: "+key+", x: "+ x+", y: "+ y +"<br/>";
//     }

//     return string;
// };

// var surface = new Surface({
//     size: [undefined, undefined],
//     classes: ['grey-bg'],
//     content: contentTemplate(),
//     properties: {
//       padding:'10px'
//     }
// });

//   var logo = new ImageSurface({
//       size: [1000, 700],
//       content: 'http://lifeblasters.com/awesome/wp-content/uploads/2013/11/juliansmasho-42-4.jpg',
//   });

//   var initialTime = Date.now();
//   var centerSpinModifier = new Modifier({
//       origin: [0.5, 0.5],
//       transform : function(){
//           return Transform.rotateZ(.0001 * (Date.now() - initialTime));
//       }
//   });

// var clone = function(obj){
//   var newObj = {};
//   for ( var key in obj ) { newObj[key] = obj[key]; }
//   return newObj;
// }

// touchSync.on("start", function(data) {
//     touches[data.touch] = clone(data);
//     surface.setContent(contentTemplate());
// });

// touchSync.on("update", function(data) {
//     touches[data.touch] = clone(data);
//     surface.setContent(contentTemplate());
// });

// touchSync.on("end", function(data) {
//     delete touches[data.touch];
//     surface.setContent(contentTemplate());
// });

// mainContext.add(surface);
// mainContext.add(centerSpinModifier).add(logo);

// });

//FU example

GenericSync.register({
    "mouse"  : MouseSync,
    "touch"  : TouchSync,
    "scroll" : ScrollSync
});

var Transitionable = require("famous/transitions/Transitionable");
var SnapTransition = require("famous/transitions/SnapTransition");
Transitionable.registerMethod("spring", SnapTransition);

var position = new Transitionable([0, 0]);

// create a sync from the registered SYNC_IDs
// here we define default options for `mouse` and `touch` while
// scrolling sensitivity is scaled down
var sync = new GenericSync({
    "mouse"  : {},
    "touch"  : {},
    "scroll" : {scale : .5}
});

var surface = new Surface({
    size : [200, 200],
    properties : {background : 'red'}
});

// now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
surface.pipe(sync);

sync.on('update', function(data){
    var currentPosition = position.get();
    position.set([
        currentPosition[0] + data.delta[0],
        currentPosition[1] + data.delta[1]
    ]);
});

sync.on('end', function(data){
    var velocity = data.velocity;
    position.set([0, 0], {
        method : 'spring',
        period : 150,
        velocity : velocity
    });
});

var positionModifier = new Modifier({
    transform : function(){
        var currentPosition = position.get();
        return Transform.translate(currentPosition[0], currentPosition[1], 0);
    }
});

var centerModifier = new Modifier({origin : [0.5, 0.5]});

var mainContext = Engine.createContext();
mainContext.add(centerModifier).add(positionModifier).add(surface);

});
