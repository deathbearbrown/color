var RYBColor = function(array) {
  if (array instanceof RYBColor) {
  	return array;
  }

  if (! (this instanceof RYBColor)) { 
  	return new RYBColor(array);
  }

  this.color = {
  	rgb:[0,0,0],
  	ryb:[0,0,0]
  };

  this.setColors(array);

};


 RYBColor.prototype = {

 	setColors: function(array){
 		this.color.ryb = array;
 		this.color.rgb = this.rybToRGBArray(array);
 	},

 	rybtoRGB: function(color){
 		return this.toRgbString(this.color.rgb);
 	},


    xRotate: function(sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */
      {
        var Rx = [ [0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0] ]; // Create an initialized 3 x 3 rotation matrix.
                           
        Rx[0][0] = 1;
        Rx[0][1] = 0; // Redundant but helps with clarity.
        Rx[0][2] = 0; 
        Rx[1][0] = 0; 
        Rx[1][1] = Math.cos( sign*constants.dTheta );
        Rx[1][2] = -Math.sin( sign*constants.dTheta );
        Rx[2][0] = 0; 
        Rx[2][1] = Math.sin( sign*constants.dTheta );
        Rx[2][2] = Math.cos( sign*constants.dTheta );
        
        this.multi(Rx); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
      },
         
      // -----------------------------------------------------------------------------------------------------
         
     yRotate: function(sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */      
      {
        var Ry = [ [0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0] ]; // Create an initialized 3 x 3 rotation matrix.
                           
        Ry[0][0] = Math.cos( sign*constants.dTheta );
        Ry[0][1] = 0; // Redundant but helps with clarity.
        Ry[0][2] = Math.sin( sign*constants.dTheta );
        Ry[1][0] = 0; 
        Ry[1][1] = 1;
        Ry[1][2] = 0; 
        Ry[2][0] = -Math.sin( sign*constants.dTheta );
        Ry[2][1] = 0; 
        Ry[2][2] = Math.cos( sign*constants.dTheta );
        
        this.multi(Ry); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
      },
 
      // -----------------------------------------------------------------------------------------------------
         
    zRotate: function(sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */      
      {
        var Rz = [ [0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0] ]; // Create an initialized 3 x 3 rotation matrix.
                           
        Rz[0][0] = Math.cos( sign*constants.dTheta );
        Rz[0][1] = -Math.sin( sign*constants.dTheta );        
        Rz[0][2] = 0; // Redundant but helps with clarity.
        Rz[1][0] = Math.sin( sign*constants.dTheta );
        Rz[1][1] = Math.cos( sign*constants.dTheta );
        Rz[1][2] = 0;
        Rz[2][0] = 0
        Rz[2][1] = 0;
        Rz[2][2] = 1;
        
        this.multi(Rz); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
  },

 	rotationMatrix: function(angle) {
    var center = [ 128, 128, 128],
    		colorArray = this.color.ryb,
    		radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        radius = Math.sqrt(((colorArray[0]-128)*(colorArray[0]-128)) +((colorArray[1]-128)*(colorArray[1]-128)))

        var x = colorArray[0] + radius * cos,
						y = colorArray[1] + radius * sin,
						z = colorArray[2];

    return [x, y, z];
	},

 	triadic: function(){
 		// +/- 120°
 		var triadicPos= this.rotationMatrix(120),
 				triadicNeg= this.rotationMatrix(360-120);

 		return [this.toRgbString(triadicPos),this.toRgbString(triadicNeg)];

 	},

 	splitComplement: function(){
 		//+/- 150°
 	},

 	analogous: function(){
 		//+/- 30°
 	},



 	complement: function(){
 		var rybComplementArray = this.complementRYBArray();
 		var rgbComp = this.rybToRGBArray(rybComplementArray);

 		return this.toRgbString(rgbComp);
 	},

 	complementRYBArray: function(){
 		var colorArray = this.color.ryb;
 		var v = {
          r: 255-colorArray[0],   
          y: 255-colorArray[1],  
          b: 255-colorArray[2]
        };
       return [ 
         (v.r<255)?v.r:255, 
         (v.y<255)?v.y:255,
         (v.b<255)?v.b:255
       ];
 	},

  rybToRGBArray: function(color) {

		//ryb interpolization cube values
		// from this paper http://vis.computer.org/vis2004/DVD/infovis/papers/gossett.pdf

		/*
		   green +------+ black(ish) 
		        /|     /|     
		yellow +-+----+ |orange (x2)  
		 (x3)  | |blue| |   
		       | +----+-+ purple 
		       |/     |/    
		white  +------+ red  
		 (x0)           (x1)

		*/

  	var ryb = {
      white: [1,1,1],
      red: [1, 0,0],
      orange: [1,0.5,0],
      yellow: [1, 1,0],
      green:[0.0, 0.66, 0.2],
      blue: [0.163, 0.373, 0.6],
      purple: [0.5, 0, 0.5],
      black: [0.2,0.094,0.0] 
    };

		function interpolate (t, A, B){
			return A + (t * t)*(3 - (2 * t)) * (B - A);
		}

		function getR(R, Y, B) {
			var x0 = interpolate(B, ryb.white[0], ryb.blue[0]);
			var x1 = interpolate(B, ryb.red[0], ryb.purple[0]);
			var x2 = interpolate(B, ryb.orange[0], ryb.black[0]);
			var x3 = interpolate(B, ryb.yellow[0], ryb.green[0]);
			var y0 = interpolate(Y, x0, x3);
			var y1 = interpolate(Y, x1, x2);
			return interpolate(R, y0, y1);
		}

		function getG(R, Y, B) {
			var x0 = interpolate(B, ryb.white[1], ryb.blue[1]);
			var x1 = interpolate(B, ryb.red[1], ryb.purple[1]);
			var x2 = interpolate(B, ryb.orange[1], ryb.black[1]);
			var x3 = interpolate(B, ryb.yellow[1], ryb.green[1]);
			var y0 = interpolate(Y, x0, x3);
			var y1 = interpolate(Y, x1, x2);
			return interpolate(R, y0, y1);
		}

		function getB(R, Y, B) {
			var x0 = interpolate(B, ryb.white[2], ryb.blue[2]);
			var x1 = interpolate(B, ryb.red[2], ryb.purple[2]);
			var x2 = interpolate(B, ryb.orange[2], ryb.black[2]);
			var x3 = interpolate(B, ryb.yellow[2], ryb.green[2]);
			var y0 = interpolate(Y, x0, x3);
			var y1 = interpolate(Y, x1, x2);
			return interpolate(R, y0, y1);
		}

    var R = color[0] / 255;
    var Y = color[1] / 255;
    var B = color[2] / 255;
    
    var newR = getR(R,Y,B);
    var newG = getG(R,Y,B);
    var newB = getB(R,Y,B);
    console.log('yo');
    return [
      Math.round(newR * 255),
      Math.round(newG * 255),
      Math.round(newB * 255)
    ];

  },

  toRgbString: function(colorArray){
		return "rgb("+colorArray[0]+","+colorArray[1]+","+colorArray[2]+")";
  }

 };
