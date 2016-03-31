/**
 * OpenLayers 3 Layer Switcher Control.
 * See [the examples](./examples) for usage.
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object} opt_options Control options, extends olx.control.ControlOptions adding:
 *                              **`tipLabel`** `String` - the button tooltip.
 */
ol.control.LayerSwitcher = function(opt_options) {

    var options = opt_options || {};

    var tipLabel = options.tipLabel ?
        options.tipLabel : 'Legend';

    this.mapListeners = [];

    var element = document.getElementById("layers");

    this.panel = document.createElement('div');
    this.panel.className = 'panel-body list-group'; // 'panel'
    element.appendChild(this.panel);

    ol.control.LayerSwitcher.enableTouchScroll_(this.panel);
    var this_ = this;

    //button.onmouseover = function(e) {
    //    this_.showPanel();
    //};
    //
    //button.onclick = function(e) {
    //    e = e || window.event;
    //    this_.showPanel();
    //    e.preventDefault();
    //};
    //
    //this_.panel.onmouseout = function(e) {
    //    e = e || window.event;
    //    if (!this_.panel.contains(e.toElement || e.relatedTarget)) {
    //        this_.hidePanel();
    //    }
    //};
    var divTarget = document.getElementById("mainLayer");

    ol.control.Control.call(this, {
        element: element, //element,
        target: divTarget //options.target
    });

};

ol.inherits(ol.control.LayerSwitcher, ol.control.Control);

/**
 * Show the layer panel.
 */
//ol.control.LayerSwitcher.prototype.showPanel = function() {
//    if (this.element.className != this.shownClassName) {
//        this.element.className = this.shownClassName;
//        this.renderPanel();
//    }
//};
//
///**
// * Hide the layer panel.
// */
//ol.control.LayerSwitcher.prototype.hidePanel = function() {
//    if (this.element.className != this.hiddenClassName) {
//        this.element.className = this.hiddenClassName;
//    }
//};

/**
 * Re-draw the layer panel to represent the current state of the layers.
 */
ol.control.LayerSwitcher.prototype.renderPanel = function() {

    this.ensureTopVisibleBaseLayerShown_();

    while(this.panel.firstChild) {
        this.panel.removeChild(this.panel.firstChild);
    }

    this.renderLayers_(this.getMap(), this.panel);
};

/**
 * Set the map instance the control is associated with.
 * @param {ol.Map} map The map instance.
 */
ol.control.LayerSwitcher.prototype.setMap = function(map) {
    // Clean up listeners associated with the previous map
    for (var i = 0, key; i < this.mapListeners.length; i++) {
        this.getMap().unByKey(this.mapListeners[i]);
    }
    this.mapListeners.length = 0;
    // Wire up listeners etc. and store reference to new map
    ol.control.Control.prototype.setMap.call(this, map);
    if (map) {
        var this_ = this;
        //this.mapListeners.push(map.on('pointerdown', function() {
        //    this_.hidePanel();
        //}));
        this.renderPanel();
    }
};

/**
 * Ensure only the top-most base layer is visible if more than one is visible.
 * @private
 */
ol.control.LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown_ = function() {
    var lastVisibleBaseLyr;
    ol.control.LayerSwitcher.forEachRecursive(this.getMap(), function(l, idx, a) {
        if (l.get('type') === 'base' && l.getVisible()) {
            lastVisibleBaseLyr = l;
        }
    });
    if (lastVisibleBaseLyr) this.setVisible_(lastVisibleBaseLyr, true);
};

/**
 * Toggle the visible state of a layer.
 * Takes care of hiding other layers in the same exclusive group if the layer
 * is toggle to visible.
 * @private
 * @param {ol.layer.Base} The layer whos visibility will be toggled.
 */
ol.control.LayerSwitcher.prototype.setVisible_ = function(lyr, visible) {
    var map = this.getMap();
    lyr.setVisible(visible);
    if (visible && lyr.get('type') === 'base') {
        // Hide all other base layers regardless of grouping
        ol.control.LayerSwitcher.forEachRecursive(map, function(l, idx, a) {
            if (l != lyr && l.get('type') === 'base') {
                l.setVisible(false);
            }
        });
    }
};

/**
 * Render all layers that are children of a group.
 * @private
 * @param {ol.layer.Base} lyr Layer to be rendered (should have a title property).
 * @param {Number} idx Position in parent group list.
 */
ol.control.LayerSwitcher.prototype.renderLayer_ = function(lyr, idx) {

    var this_ = this;

    if (lyr.getLayers) {
        console.log("Groupe de couche " + lyr.get('title'));
        this.renderLayers_(lyr, this.panel);

    } else {
        console.log("Mono couche : " + lyr.get('title'));

        var a = document.createElement('a');
        a.className = "list-group-item";

        var lyrTitle = ' ' + lyr.get('title');
        var lyrId = lyr.get('title').replace(/\s+/g, '-') + '_' + idx;

        var label = document.createElement('label');

        if (lyr.get('type') === 'base') {
            var input = document.createElement('input');
            input.type = 'radio';
            input.name = 'base';

            input.id = lyrId;
            input.checked = lyr.get('visible');
            input.onchange = function(e) {
                this_.setVisible_(lyr, e.target.checked);
            };

            a.appendChild(input);

        } else {
            var iGlobe = document.createElement('i');
            iGlobe.className = "fa fa-globe";
            a.appendChild(iGlobe);
        }

        label.innerHTML = '&nbsp;' + lyrTitle;
        label.htmlFor = lyrId;
        a.appendChild(label);
        return a;
    }
};

/**
 * Render all layers that are children of a group.
 * @private
 * @param {ol.layer.Group} lyr Group layer whos children will be rendered.
 * @param {Element} elm DOM element that children will be appended to.
 */
ol.control.LayerSwitcher.prototype.renderLayers_ = function(lyr, elm) {
    var lyrs = lyr.getLayers().getArray().slice().reverse();
    for (var i = 0, l; i < lyrs.length; i++) {
        l = lyrs[i];
        if (l.get('title')) {
            var linkLayer = this.renderLayer_(l, i);
            if (undefined != linkLayer) {
                elm.appendChild(linkLayer);
            }
        }
    }
};

/**
 * **Static** Call the supplied function for each layer in the passed layer group
 * recursing nested groups.
 * @param {ol.layer.Group} lyr The layer group to start iterating from.
 * @param {Function} fn Callback which will be called for each `ol.layer.Base`
 * found under `lyr`. The signature for `fn` is the same as `ol.Collection#forEach`
 */
ol.control.LayerSwitcher.forEachRecursive = function(lyr, fn) {
    lyr.getLayers().forEach(function(lyr, idx, a) {
        fn(lyr, idx, a);
        if (lyr.getLayers) {
            ol.control.LayerSwitcher.forEachRecursive(lyr, fn);
        }
    });
};

/**
 * @private
 * @desc Apply workaround to enable scrolling of overflowing content within an
 * element. Adapted from https://gist.github.com/chrismbarr/4107472
 */
ol.control.LayerSwitcher.enableTouchScroll_ = function(elm) {
    if(ol.control.LayerSwitcher.isTouchDevice_()){
        var scrollStartPos = 0;
        elm.addEventListener("touchstart", function(event) {
            scrollStartPos = this.scrollTop + event.touches[0].pageY;
        }, false);
        elm.addEventListener("touchmove", function(event) {
            this.scrollTop = scrollStartPos - event.touches[0].pageY;
        }, false);
    }
};

/**
 * @private
 * @desc Determine if the current browser supports touch events. Adapted from
 * https://gist.github.com/chrismbarr/4107472
 */
ol.control.LayerSwitcher.isTouchDevice_ = function() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch(e) {
        return false;
    }
};