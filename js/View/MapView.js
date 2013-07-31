N.plug("MapView", function() {
N.extend(MapView, N.plugins.View);

MapView.EVENTS = { marker : "marker_add", fullscreen : "fullscreen", map : "map_created" };
MapView.POPUP = { agreement : "agreement_popup", overview : "overview_popup" };
MapView.POPUP_CLASS = "popup";
MapView.templates = N.plugins.Templates;
MapView.engine = new N.TemplateEngine();

function MapView(data) {
	this.MapView(data);
}
MapView.prototype.MapView = function(data) {
	if (typeof data === "object") {
		this.View();
		this.holder = data.holder || document.body;
		this.map = null;
		this.currentMarker = null;
		this.currentPopup = null;
	}
};
MapView.prototype.set = function(data, callback) {
	if (typeof data === "object") {
		this.fullScreen();
	    this.map = new N.plugins.Map(this.holder, data);
	    this.push(MapView.EVENTS.map);
	    (typeof callback === "function") && callback.call(this, this.map.map);
	}
	return this;
};
MapView.prototype.fullScreen = function() {
	N.DOM.style(this.holder, { 
		width : (window.innerWidth || document.documentElement.clientWidth) + "px", 
		height : (window.innerHeight || document.documentElement.clientHeight) + "px"
	});
	this.push(MapView.EVENTS.fullscreen);
	return this;
};
MapView.prototype.marker = function(data, callback) {
	this.currentMarker = this.map.addMarker(data);
	this.push(MapView.EVENTS.marker);
	(typeof callback === "function") && callback.call(this, this.currentMarker);
	return this;
};
MapView.prototype.popup = function(data, callback) {
	if (typeof data === "object") {
		var that = this;
		MapView.engine.assign("type", data.content);
		MapView.engine.fetch(MapView.templates[data.content], function(result) {
			that.currentPopup = that.map.addPopup(result, data.on);
			(typeof callback === "function") && callback.call(that, that.currentPopup);
		});
	}
	return this;
};
MapView.prototype.removePopup = function(callback) {
	//this.currentMarker.unbindPopup(this.currentMarker._popup);
	this.map.removePopup(this.currentPopup);
	this.currentPopup = null;
	return this;
};
MapView.prototype.removeMarker = function(callback) {
	this.map.removeMarker(this.currentMarker);
	this.currentMarker = null;
	this.currentPopup = null;
	return this;
};
MapView.prototype.openPopup = function(popupOrMarker, callback) {
	if (popupOrMarker instanceof this.map.Popup) {
		this.map.openPopup(popupOrMarker);
	} else if (popupOrMarker instanceof this.map.Marker) {
		popupOrMarker.openPopup();
	}
	(typeof callback === "function") && callback.call(this, popupOrMarker);
	return this;
};
MapView.prototype.closePopup = function(popupOrMarker, callback) {
	if (popupOrMarker instanceof this.map.Popup) {
		this.map.closePopup(popupOrMarker);
	} else if (popupOrMarker instanceof this.map.Marker) {
		popupOrMarker.closePopup();
	}
	(typeof callback === "function") && callback.call(this, popupOrMarker);
	return this;
};

return MapView;
});