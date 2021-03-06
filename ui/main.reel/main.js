/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;
var SceneHelper = require("mjs-volume/runtime/scene-helper").SceneHelper;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    constructor: {
        value: function Main() 
        {
                this.super();
                window.MAIN=this;
        }
    },

    _viewPoints: { value: {}, writeable: true },
    
    _enterDocument : 
    {
    	value : function(firstTime) 
    	{
        	this.super(firstTime);
        	if (this.templateObjects.sceneView.viewPoint && this.templateObjects.sceneView.viewPoint.id) 
        		this.fix(this.templateObjects.sceneView.viewPoint.id);

          for (var k in this.templateObjects) {
            if (k.startsWith("CAMERA")) {
                var elem = this.templateObjects[k].glTFElement;
                this._viewPoints[k] = JSON.parse(JSON.stringify(elem.transform.matrix));
            }
          }

    	}
    },

	fix: 
	{
		value : function(id) 
		{
			//------------------------------------------------------
			function onClick(event) 
			{
				if (event && event.target && event.target.name) 
				{
					console.log("SELECT BY ID '"+event.target.name+"'");
					event.preventDefault();
					event.stopPropagation();
					window.SELECTED=event.target.name;
					MAIN.templateObjects.sceneView.needsDraw=true;
				}
			}
			//------------------------------------------------------
			var that=this;
			function onDone(html) {
				that.__cached[id]=html;
				//document.querySelector(".html_details").innerHTML=html;
			}
			if (!this.__cached)
				this.__cached={};
			if (this.__cached[id]) {
				onDone(this.__cached[id]);				
			} else {
				var xmlhttp;
				var url="html/"+id+".html";
				if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				} else { // code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange = function()
				{
				  if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
					  document.querySelector(".html_details").innerHTML="<div class='status'>"+url+"&nbsp;&nbsp;|&nbsp;&nbsp;"+xmlhttp.status+"</div>";
				  }
				  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
				  {
				    onDone(xmlhttp.responseText);
				    setTimeout(function() {
						var sel = document.querySelectorAll(".link");
						for (var i=0;i<sel.length;i++)
							sel[i].onclick=onClick;
				    },0);
				  }
				}
				xmlhttp.open("GET", url, true);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xmlhttp.setRequestHeader("Cache-Control", "no-cache"); // For no cache
				xmlhttp.send();
			}
		}
	},

  handleFirstFrameDidRender: {
    value: function(event) {
      console.log("frame did render");
      var loadScreen = document.getElementById("loading_screen");
      loadScreen.style.display = "none";
    }
  },

  handleNavItemAction: 
	{ 
		value: function(event) 
		{
      var sceneView = this.templateObjects.sceneView;

			sceneView.stop();
			sceneView.viewPoint = event.target.viewPoint;

      var newVP = this._viewPoints[event.target.viewPoint.identifier];
      var transMat = newVP;
      sceneView.changeViewPointTrans(transMat);
      sceneView.cameraController.changeViewPointTrans(transMat);

			sceneView.allowsViewPointControl = true; //true; //event.target.viewPoint === this.templateObjects.planetVP;
			this.fix(event.target.viewPoint.id);
		}
	},    

	handleTESTAction: {
		value: function(event) {
			alert("The user clicked the door!");
		}
	},
});
