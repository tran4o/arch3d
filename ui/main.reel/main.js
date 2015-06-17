/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

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
	handleNavItemAction: 
	{ 
		value: function(event) 
		{
			this.templateObjects.sceneView.stop();
			this.templateObjects.sceneView.viewPoint = event.target.viewPoint;
			this.templateObjects.sceneView.allowsViewPointControl = true; //true; //event.target.viewPoint === this.templateObjects.planetVP;					
		}
	},    
	handleTESTAction: {
		value: function(event) {
			alert("The user clicked the door!");
		}
	}
});
