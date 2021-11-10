angular.module('beamng.apps')
  .directive('improvedNavigation', ['Utils', function (Utils) {
    return {
      template: `
      <div style="height: 100%; width: 100%; position: relative;">
        <!-- map container -->
        <div id="overflow-wrap" style=" width: 100%; height: 100%; overflow: hidden">
          <div id="mapContainer" style="overflow: visible;">
            <svg style="overflow: visible">
              <defs>
                <image style="" id="vehicleMarker" width="40" height="40"  x="-20" y="-20" xlink:href="/ui/modules/apps/improvedNavigation/vehicleMarker.svg" />
              </defs>
              <foreignObject id="canvasWrapper" style="position:absolute; x:-100%; y:-100%; width:100%; height:100%">
                <canvas id="roadCanvas"  width="4096" height="4096"> </canvas>
              </foreignObject>
              <foreignObject id="routeCanvasWrapper" style="position:absolute; x:-100%; y:-100%; width:100%; height:100%">
                <canvas id="routeCanvas"  width="4096" height="4096"> </canvas>
              </foreignObject>
            </svg>
          </div>
          <div style="position: absolute">
            <svg width="40" height="40" style="position: fixed; top:0; left: 50%; margin-top: -20px; margin-left: -20px; transform: scale(1, 1);">
              <!--<path d="M20.272 3.228l-5.733 10.52-3.878 6.51c-1.22 1.87-1.873 4.056-1.877 6.29 0 6.38 5.17 11.55 11.55 11.55 6.38 0 11.55-5.17 11.55-11.55-.002-2.257-.666-4.466-1.91-6.35l-3.92-6.505z" fill="#282828" fill-rule="evenodd" stroke="#fff" stroke-width="2.88"/>-->
              <circle cx="20" cy="20" r="10" stroke="#FFF" stroke-width="1.5" fill="#282828" />
              <text style="line-height:125%" x="14.265" y="1043.581" font-size="14" font-family="sans-serif" letter-spacing="0" word-spacing="0" fill="#fff" transform="translate(1 -1012.362)"><tspan x="14" y="1037">N</tspan></text>
            </svg>
          </div>
        </div>
        <!-- Styles -->
        <style>
          .button {
            background-color: transparent;
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 20px;
            cursor: pointer;
          }
        </style>
        <style>
          .settingsMenu {
            background-color: rgba(0, 0, 0, 0);
            background-size: 0px, 0px;
            background-repeat: no-repeat;
            overflow: hidden;
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 1px;
            cursor: pointer;
          }
        </style>
        <style>
          .checkbox {
            color: white;
            font-size: 20px;
            font-family: Tahoma, sans-serif;
          }
        </style>
        <!-- Zoom Display -->
        <div id="zoomDisplay" style="font-size: 1.2em; padding: 0.2%; color: white; background-color: rgba(0, 0, 0, 0.3); position: absolute; bottom:0px; left:0px">
          {{ zoomMag }}
        </div>
        <!-- Settings Menu -->
        <foreignObject id="canvasWrapper" style="position:absolute; x:-100%; y:-100%; width:100%; height:100%; top:0px; left:0px; right:0px; bottom:0px">
          <canvas id="settingsCanvas"  width="4096" height="4096"> </canvas>
        </foreignObject>
        <div style="font-size: 1.2em; color: white; background-color: rgba(0, 0, 0, 0.3); position: absolute; bottom:0px; right:0px">
          <button id="settingsMenuButton" class="button">
            ⚙
          </button>
        </div>
        <div id="checkboxes">
          <label for="navMapSmoothZoom" style="position: absolute; top:46px; left:30px;" class="checkbox">Smooth Zoom</label>
          <input type="checkbox" id="navMapSmoothZoom" style="position: absolute; top:50px; left:10px;"></input>
          <label for="navMapDisplayZoom" style="position: absolute; top:76px; left:30px;" class="checkbox">Display Zoom Level</label>
          <input type="checkbox" id="navMapDisplayZoom" style="position: absolute; top:80px; left:10px;"></input>
          <label for="navMapSpeedTiedZoom" style="position: absolute; top:106px; left:30px;" class="checkbox">Speed Tied Zoom</label>
          <input type="checkbox" id="navMapSpeedTiedZoom" style="position: absolute; top:110px; left:10px;"></input>
          <label for="navMapElementScaleTiedZoom" style="position: absolute; top:136px; left:30px;" class="checkbox">Scale Map Elements with Zoom</label>
          <input type="checkbox" id="ElementScaleTiedZoom" style="position: absolute; top:140px; left:10px;"></input>
          <label for="navMapNorthLocked" style="position: absolute; top:166px; left:30px;" class="checkbox">Lock North</label>
          <input type="checkbox" id="navMapNorthLocked" style="position: absolute; top:170px; left:10px;"></input>
          <label for="navMapShowGrid" style="position: absolute; top:196px; left:30px;" class="checkbox">Show Grid</label>
          <input type="checkbox" id="navMapShowGrid" style="position: absolute; top:200px; left:10px;"></input>
          <label for="navMapShowOffScreenVehicles" hidden style="position: absolute; top:226px; left:30px;" class="checkbox">Show Offscreen Vehicles</label>
          <input type="checkbox" id="navMapShowOffScreenVehicles" hidden style="position: absolute; top:230px; left:10px;"></input>
        </div>
        <!-- Collectible Display -->
        <div ng-if="collectableTotal > 0" style="font-size: 1.2em; padding: 1%; color: white; background-color: rgba(0, 0, 0, 0.3); position: absolute; top:15px; left: 15px">
          <md-icon style="margin-bottom: 3px;" md-svg-src="{{ '/ui/modules/apps/Navigation/snowman.svg' }}" />
          {{ collectableCurrent + '/' + collectableTotal }}
        </div>

        <style>
          .bounce {
            animation: bounce 1s cubic-bezier(0.4,0.1,0.2,1) both;
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-4px); }
            60% { transform: translateY(-2px); }
          }
        </style>
      </div>
      `,
      replace: true,
      restrict: 'EA',
      link: function (scope, element, attrs) {
        var root = element[0];
        var mapcontainer = root.children[0].children[0];
        var svg = mapcontainer.children[0]; 
        //var canvas = svg.children[0];
        var canvas = document.getElementById('roadCanvas');
        var canvasWrapper = document.getElementById('canvasWrapper');
        
        var settingsCanvas = document.getElementById('settingsCanvas');
        var routeCanvas = document.getElementById('routeCanvas');
        var routeCanvasWrapper = document.getElementById('routeCanvasWrapper');

        var settingsCheckBoxes = document.getElementById('checkboxes');

        var pointer = mapcontainer.children[1];
        var northPointer = root.children[0].children[1].children[0];

        var mapReady = false;
        var rotateMap = true;
        var viewParams = [];

        var navMapData = null;
        var bgImage = null;
        var red = true;

        // make sure checkboxes are not visible
        settingsCheckBoxes.style.visibility = "hidden";
        
        // load settings
        var config = [];
        var configDefaults = [true, true, true, true, false, true, true];
        var configKeys = ['navMapSmoothZoom', 'navMapDisplayZoom', 'navMapSpeedTiedZoom', 'ElementScaleTiedZoom', 'navMapNorthLocked', 'navMapShowGrid', 'navMapShowOffScreenVehicles'];
        for(i=0;configKeys.length>i;i++){
          config[i] = localStorage.getItem(configKeys[i]);
          if(!config[i]) { // if the setting does not exist, then create it
            localStorage.setItem(configKeys[i], configDefaults[i]);
            config[i] = localStorage.getItem(configKeys[i]);
          }
          if(config[i] == "true") {
            document.getElementById(configKeys[i]).checked = true
          } else {
            document.getElementById(configKeys[i]).checked = false
          }
          //console.log([i] + " | " + config[i])
        }
        
        var baseMapZoomSpeed = 25;
        var mapZoomSpeed = 0;
        var mapScale = 1
        var routeScale = 1/3;
        var zoomStates = [1000, 500, 0, -500, -1000, -2000, -4000, -8000, -16000] // the magnification levels
        var roadScaleZoom = [0, 0, 0, 0, 0, 0.0385, 0.1, 0.225, 0.475]
        var zoomMags = []
        var settingsIsOpen = false
        // Calculates the magnification levels to display in the gui, This allows for the magnification levels to automatically change if you were to add or remove more magnification levels (zoomStates)
        var baseZoomLevel = Math.floor(zoomStates.length / 2) // gets the zoom level that is in the middle
        for (var i=0; i < zoomStates.length; i++) {
          if (zoomStates[i] < zoomStates[baseZoomLevel]) {
            zoomMags[i] = zoomStates[baseZoomLevel]/zoomStates[i]
          } else {
            zoomMags[i] = Math.pow(2, (baseZoomLevel - i))
          }
        }
        var zoomSlot = baseZoomLevel;
        var mapZoom = zoomStates[baseZoomLevel];
        var t = 0;
        // receive live data from the GE map
        var vehicleShapes = {};
        var lastcontrolID = -1;

        var collectableShapes = {};
        // group to store all collectable svgs
        var collGroup;

        var visibilitySlots = [0.2, 0.6, 0.8, 1]
        var activeVisibilitySlot = 1;

        var quad = null;//new Quadtree({x:0, y:0, width:1, height:1});

        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        // ability to interact
        function settingsMenu() {
          // make sure not to change visiblity slot
          activeVisibilitySlot--;
          if (activeVisibilitySlot >= visibilitySlots.length) activeVisibilitySlot = 0;
          element.css({
            'background-color': 'rgba(50, 50, 50, ' + visibilitySlots[activeVisibilitySlot] + ')',
          })
          var ctx = settingsCanvas.getContext('2d');
          if(settingsIsOpen == false) {
            // Draw Background
            ctx.fillStyle = "rgba(50, 50, 50, 1)";
            ctx.fillRect(0, 0, settingsCanvas.width, settingsCanvas.height);
            // Draw Title
            ctx.font = "28px Tahoma, sans-serif";
            ctx.fillStyle = "white";
            ctx.fillText("Navigation Settings", 10, 30)
            // Draw Checkboxes
            settingsCheckBoxes.style.visibility = "visible";
            settingsIsOpen = true;
          } else {
            ctx.clearRect(0, 0, settingsCanvas.width, settingsCanvas.height)
            settingsCheckBoxes.style.visibility = "hidden";
            settingsIsOpen = false;
          }
        }
        document.getElementById("settingsMenuButton").onclick = function() {settingsMenu()};
        element[0].addEventListener('click', function (e) {
          activeVisibilitySlot++;
          if (activeVisibilitySlot >= visibilitySlots.length) activeVisibilitySlot = 0;
          element.css({
            'background-color': 'rgba(50, 50, 50, ' + visibilitySlots[activeVisibilitySlot] + ')',
          })
        });
        element[0].addEventListener('contextmenu', function(e) {
          zoomSlot++;
          mapZoomSlot = zoomSlot < zoomStates.length ? zoomSlot : zoomSlot = 0;
          if (config[0] == 'true') {
            async function animatedZoom() {
              mapZoomSpeed = Math.ceil(baseMapZoomSpeed*(zoomStates[mapZoomSlot]-mapZoom)/zoomStates[baseZoomLevel])
              if (mapZoom > zoomStates[mapZoomSlot] )
              var i = 0
              while (mapZoom != zoomStates[mapZoomSlot]) {
                i++
                if (i > 1000) {
                  mapZoom = zoomStates[mapZoomSlot] // makes sure it doesnt get stuck in an infinite loop
                  console.error("the animated zoom has caused an error, it has repeated over 1000 times, this is not normal")
                  break;
                } else if (mapZoom > zoomStates[0]) {
                  mapZoom = zoomStates[mapZoomSlot] // resets to how it should be
                  console.error("the animated zoom has caused an error, it has gone over the zoom limit, this is not normal")
                  break;
                } else if (mapZoom < zoomStates[zoomStates.length - 1]) {
                  mapZoom = zoomStates[zoomStates.length - 1] // resets to how it should be
                  console.error("the animated zoom has caused an error, it has gone under the zoom limit, this is not normal")
                  break;
                } else {
                  mapZoom = mapZoom - mapZoomSpeed
                  if (mapZoomSpeed < 0) {
                    if (mapZoom + 20 >= zoomStates[mapZoomSlot]) {
                      mapZoom = zoomStates[mapZoomSlot];
                      break;
                    }
                  } else {
                    if (mapZoom - 20 <= zoomStates[mapZoomSlot]) {
                      mapZoom = zoomStates[mapZoomSlot];
                      break;
                    }
                  }
                  await sleep(15);
                }
              }
              if(config[3] == 'true') {
                setupMap(navMapData);
              }
            }
            animatedZoom();
          } else {
            if(config[3] == 'true') {
              setupMap(navMapData);
            }
          }
        });
        scope.$on('NavigationMapUpdate', function (event, data) {
          if (!mapReady || !data) return;
          updateNavMap(data);
          // center map on thing that is controlled
          centerMap(data.objects[data.controlID]);
        });
        scope.$on('app:resized', function (event, streams) {
          element.css({
            'width': streams.width-25 + "px",
            'height': streams.height-25 + "px",
          })
          settingsCanvas.width = streams.width-25
          settingsCanvas.height = streams.height-25
          setupMap();
        });

        scope.$on('$destroy', function () {
          bngApi.engineLua('extensions.unload("ui_uiNavi")');
          //StreamsManager.remove(requiredStreams);
        });

        var init = false;
        // receive the one-time map setup
        scope.$on('NavigationMap', function (event, data) {
          if (data && !init) {
            setupMap(data);
            navMapData = data;
            init = true;
          }
        });

        scope.$on('CollectablesInit', (event, data) => {
          if (data) setupCollectables(data);
        });

        var prevMarkers = null;
        scope.$on('NavigationGroundMarkersUpdate', (evenet, data) => {
          if(routeCanvas == null) return
          var ctx = routeCanvas.getContext("2d");
          ///ctx.globalCompositeOperation = 'source-over';
          //clear canvas if no data or not markers
          if(!data || !data.markers) {
            //console.log("Clearing route.")
            ctx.clearRect(0, 0, routeCanvas.width, routeCanvas.height)
            ctx.stroke()
            return
          }
            //prevMarkers = null;
          //if no previous markers, draw the whole route.
          if(!prevMarkers) {
            //console.log("Making complete new path.")
            ctx.clearRect(0, 0, routeCanvas.width, routeCanvas.height)
            //ctx.stroke()
            //ctx.fillStyle = '#ff000044'
            //ctx.fillRect(0, 0, routeCanvas.width, routeCanvas.height)
            ctx.stroke()
            if(data) {
              ctx.beginPath();
              if(!data.color) data.color = '#3388EEFF'
              ctx.strokeStyle = data.color;
              ctx.lineWidth = 10*routeScale;
              //ctx.lineCap = 'round'

              let canvasWidth = routeCanvas.width*0.5 ;
              let canvasHeight = routeCanvas.height*0.5 ;
              let mapFac = routeScale;
              if(mapScale != 0){
                mapFac = mapFac/mapScale;
              }
              let markers = data.markers;

              ctx.moveTo(-markers[0] * mapFac + canvasWidth, markers[1] * mapFac + canvasHeight);
              for(var i=2; i<markers.length; i+=2) {
                ctx.lineTo(-markers[i] * mapFac + canvasWidth, markers[i+1] * mapFac + canvasHeight);
              }
              ctx.stroke();
            }
          } else {
            // otherwise, check previous markers for same-ness of end, and only erase the beginning that changed
            // erase anything from old markers until we reach
            let markers = data.markers;
            let ci = markers.length-2
            let pi = prevMarkers.length-2
            while(pi >= 0 && ci >= 0){
              if(markers[ci] != prevMarkers[pi] || markers[ci+1] != prevMarkers[pi+1])
                break;
              ci -=2;
              pi -=2;
            }

            if(pi >= 0 || ci >= 0){
              // we know the common postfix
              //console.log("Updating route:")
              //console.log("pi: " + pi + "  ci:" + ci);
              // first, un-draw all the stuff from prevMarkers
              ctx.globalCompositeOperation = 'destination-out';
              if(!data.color) data.color = '#3388EEFF'
              ctx.strokeStyle = data.color;
              ctx.beginPath();
              ctx.lineWidth = 12*routeScale;
              ctx.lineCap = 'round'

              let canvasWidth = routeCanvas.width * 0.5;
              let canvasHeight = routeCanvas.height * 0.5;
              let mapFac = routeScale;
              if(mapScale != 0){
                mapFac = mapFac/mapScale;
              }


              ctx.moveTo(-prevMarkers[0] * mapFac + canvasWidth, prevMarkers[1] * mapFac + canvasHeight);
              for(var i=0; i<Math.min(pi + 4, prevMarkers.length); i+=2) {
                ctx.lineTo(-prevMarkers[i] * mapFac + canvasWidth, prevMarkers[i+1] * mapFac + canvasHeight);
              }
              ctx.stroke();

              // next, draw all the previx stuff form current markers
              ctx.globalCompositeOperation = 'source-over';
              ctx.beginPath();
              if(!data.color) data.color = '#3388EEFF'
              ctx.strokeStyle = data.color;
              ctx.lineWidth = 10*routeScale;
              ctx.lineCap = 'round'

              ctx.moveTo(-markers[0] * mapFac + canvasWidth, markers[1] * mapFac + canvasHeight);
              for(var i=0; i<Math.min(ci + 6, markers.length); i+=2) {
                ctx.lineTo(-markers[i] * mapFac + canvasWidth, markers[i+1] * mapFac + canvasHeight);
              }
              ctx.stroke();
            }
          }
          prevMarkers = data.markers;
        });





        scope.$on('CollectablesUpdate', (event, data) => {
          if (data) {
            // remove collectable from svg
            collectableShapes[data.collectableName].remove();
            // play animation
            var collectIcon = root.children[1].children[0];
            collectIcon.classList.add('bounce')
            collectIcon.addEventListener("animationend", function () {  // resetting the animation
              collectIcon.classList.remove('bounce');
            });
            // update collected amount
            scope.collectableCurrent = data.collectableAmount;
          };
        });

        function _createCircle(x, y, r, c, s, sw) {
          hu('<circle>', svg).attr({
            cx: x, cy: y, r: 0.5 * r, fill: c, stroke: s, 'stroke-width': sw
          });
        }

        // License: CC BY 4.0
        // https://stackoverflow.com/questions/29377748/draw-a-line-with-two-different-sized-ends/29379772
        function _varLine(ctx, x1, y1, x2, y2, w1, w2, color) {
          var dx = (x2 - x1);
          var dy = (y2 - y1);
          // length of the AB vector
          var length = dx*dx + dy*dy;
          if (length == 0) return; // exit if zero length
          length = Math.sqrt(length);
          w1 *= 0.5;
          w2 *= 0.5;

          dx /= length;
          dy /= length;
          var shiftx = - dy * w1   // compute AA1 vector's x
          var shifty =   dx * w1   // compute AA1 vector's y
          ctx.beginPath();
          ctx.fillStyle = color
          ctx.moveTo(x1 + shiftx, y1 + shifty);
          ctx.lineTo(x1 - shiftx, y1 - shifty); // draw A1A2
          shiftx =  - dy * w2 ;   // compute BB1 vector's x
          shifty =    dx * w2 ;   // compute BB1 vector's y
          ctx.lineTo(x2 - shiftx, y2 - shifty); // draw A2B1
          ctx.lineTo(x2 + shiftx, y2 + shifty); // draw B1B2
          ctx.closePath(); // draw B2A1

          ctx.arc(x1, y1, w1, 0, 2 * Math.PI);
          ctx.arc(x2, y2, w2, 0, 2 * Math.PI);

          ctx.fill();
      }

        function _createLine(p1, p2, color) {

          var ctx = canvas.getContext("2d");
          // for drawing trapezoids if the radii are not the same
          if(Math.abs(p1.radius-p2.radius) > 0.2 ) {
            _varLine(ctx, p1.x, p1.y, p2.x, p2.y, p1.radius, p2.radius, color)
          } else {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = Math.max(p1.radius, p2.radius);
            ctx.lineCap = 'round'
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        function centerMap(obj) {
          var speedZoomMultiplier = 2;
          if(zoomStates[zoomSlot] <= 0 && config[2] == "true") { // removes speed based zoom if you are zoomed too far in
            var zoom = Math.min(1 + (obj.speed * 3.6) * 1.5, 200); // speed tied zoom
          } else {
            var zoom = 0;
          }
          

          // center on what?
          var focusX = -obj.pos[0] / mapScale;
          var focusY = obj.pos[1] / mapScale;

          var borderWidth = root.children[0].clientWidth;
          var borderHeight = root.children[0].clientHeight;
          if (config[4] == 'false') { // if lock north is disabled
            var degreeNorth = obj.rot - 90;
          } else {
            var degreeNorth = 0;
          }
          var degreeNorth = config[4] == 'false' ? (obj.rot - 90) : 90;
          var npx = - Math.cos(degreeNorth * Math.PI / 180) * borderWidth * 0.75;
          var npy = borderHeight * 0.5 - Math.sin(degreeNorth * Math.PI / 180) * borderHeight * 0.75;
          var translateX = (((viewParams[0]) + borderWidth/2 - 10) + focusX + 10);
          var translateY = (((viewParams[1]) + borderHeight/1.5) + focusY + (zoom / 2)); // translate map with speed
          // is settings menu open?
          if(settingsIsOpen == false) {

            mapcontainer.style.transformOrigin = (((viewParams[0] * -1)) - focusX) + "px " + ((viewParams[1] * -1) - focusY) + "px"
            if(config[4] == 'false') { // if lock north is disabled
              mapcontainer.style.transform = "translate3d(" + translateX + "px, " + translateY + "px," + (mapZoom - (zoom * speedZoomMultiplier)) + "px)" + "rotateX(" + 0 + (zoom / 10) + "deg)" + "rotateZ(" + (180 + Utils.roundDec(obj.rot, 2)) + "deg)"
            } else {
              mapcontainer.style.transform = "translate3d(" + translateX + "px, " + translateY + "px," + (mapZoom - (zoom * speedZoomMultiplier)) + "px)" + "rotateX(" + 0 + (zoom / 10) + "deg)" + "rotateZ(" + (270 + Utils.roundDec(90, 2)) + "deg)"
            }

            northPointer.style.transform = 'translate(' + Math.min(Math.max(npx, -borderWidth / 2 - 2), borderWidth / 2) + 'px,' + Math.min(Math.max(npy, 0), borderHeight) + 'px)';
          } else {
            northPointer.style.transform = 'translate(' + borderWidth/2.5 + 'px, ' + borderHeight/2.5 + 'px)';
          }
        }

        // no cheating :D
        function hideCollectables(camera) {
          if (camera) {
            collGroup.attr({opacity: 0});
          }
          else {
            collGroup.attr({opacity: 1});
          }
        }

        function updatePlayerShape(key, data) {
          //console.log('updatePlayerShape', key)
          if (vehicleShapes[key]) vehicleShapes[key].remove();
          // is settings menu open?
          if(settingsIsOpen == false) {
            var isControlled = (key == data.controlID);
            //console.log(data)
            var obj = data.objects[key];

            if (isControlled) {
              //console.log(obj.type);
              if (obj.type == 'Camera') {
                hideCollectables(true);
                vehicleShapes[key] = hu('<circle>', svg);
                vehicleShapes[key].attr('cx', 0);
                vehicleShapes[key].attr('cy', 0);
                vehicleShapes[key].attr('r', 8);
                vehicleShapes[key].css('fill', '#FD6A00');
              }
              else {
                hideCollectables(false);
                vehicleShapes[key] = hu('<use>', svg);
                vehicleShapes[key].attr({ 'xlink:href': '#vehicleMarker' });
              }
            }
            else {
              vehicleShapes[key] = hu('<circle>', svg);
              vehicleShapes[key].attr('cx', 0);
              vehicleShapes[key].attr('cy', 0);
              vehicleShapes[key].attr('r', 10);
              vehicleShapes[key].css('stroke', '#FFFFFF');
              vehicleShapes[key].css('stroke-width', '3px');
              vehicleShapes[key].css('fill', '#A3D39C');
            }
          }
        }

        function updateNavMap(data) {
          // is settings menu open?
          if(settingsIsOpen == false) {
            // player changed? update shapes?
            if (lastcontrolID != data.controlID) {
              if (lastcontrolID != -1) updatePlayerShape(lastcontrolID, data); // update shape of old vehicle
              updatePlayerShape(data.controlID, data); // update shape of new vehicle
              lastcontrolID = data.controlID;
            }
            // update shape positions
            for (var key in data.objects) {
              var o = data.objects[key];
              var p = data.objects[data.controlID];
              if (vehicleShapes[key]) {
                var px = -o.pos[0] / mapScale;
                var py = o.pos[1] / mapScale;
                var rot = Math.floor(-o.rot);
                if(config[3] == 'true') { // if the user wants map elements to scale with map zoom
                  var iconScale = 1 + mapZoom / -500 * 0.151;
                } else {
                  var iconScale = 1;
                }
                var show = 1;
                if (o.marker == null) {
                  o.marker = 'default';
                }
                if (o.marker == 'hidden') {
                  show = 0;
                }
                if(config[6] == 'true') {
                  if(o != p) {
                    //attempts to get the offscreen vehicles to work

                    //px = ;
                    //py = p.pos[1]/mapScale)/3;
                    //console.log("px: " + px + " py: " + py);
                    /*
                    var borderWidth = root.children[0].clientWidth;
                    var borderHeight = root.children[0].clientHeight;
                    */
                    /*
                    var distX = (-o.pos[0] - -p.pos[0]) / mapScale;
                    var distY = (o.pos[1] - p.pos[1]) / mapScale;
                    console.log("DistX: " + distX + " oposx: " + -o.pos[0] + " pposx " + -p.pos[0]);
                    console.log("px: " + px)
                    console.log("DistY: " + distY + " oposy: " + o.pos[1] + " pposy " + p.pos[1]);
                    console.log("py: " + py)
                    */
                   /*
                    var vehMar = root.children[0]; 
                    var bounding = vehMar.getBoundingClientRect();
                    var over = {};
                    over.t = bounding.top / mapScale + 3.5;
                    over.r = bounding.right / mapScale;
                    over.b = bounding.bottom / mapScale;
                    over.l = bounding.left / mapScale;
                    console.log('Bounding Top: ' + over.t);
                    console.log('Bounding Right: ' + over.r);
                    console.log('Bounding Bottom: ' + over.b);
                    console.log('Bounding Left: ' + over.l);
                    console.log('oposy: ' + o.pos[1] / mapScale)

                    if (o.pos[1] / mapScale < over.t) {
                      py = Math.abs((over.t - (p.pos[1] / mapScale)) / 2);
                      console.log("top overflow! " + py)
                    }
                    if (o.pos[1] / mapScale > over.b) {
                      py = over.b + -py 
                      console.log("bottom overflow! " + py)
                    }
                    if (-o.pos[0] / mapScale > over.r) {
                      px = px
                      console.log("right overflow! " + px)
                    }
                    if (-o.pos[0] / mapScale < over.l) {
                      px = over.l + -px
                      console.log("left overflow! " + px)
                    }
                    */
                   /*
                    console.log("px: " + px)
                    console.log("ppos: " + p.pos[0] / mapScale)
                    //console.log("mapScale: " + mapScale)
                    if((borderWidth - 65) - (-p.pos[0] / mapScale) < px) {
                      if(Math.abs(p.pos[0]) > px) {
                        px = (-p.pos[0] / mapScale) - (borderWidth - 65) + px * 2;
                      } else {
                        px = (-p.pos[0] / mapScale) - (borderWidth - -60) + px * 2;
                      }
                    } 
                    if((borderHeight - 25) - (p.pos[1] / mapScale) < py) {
                      py = (p.pos[1] / mapScale) - (borderHeight - 25) + py * 2;
                      //console.log("no")
                    }
                    console.log("npx: " + px)
                    */
                  }
                }
                vehicleShapes[key].attr({"transform": "translate(" + px + "," + py + ") scale(" + iconScale + "," + iconScale + ") rotate(" + rot + ")", "opacity": show});
              }
              else {
                updatePlayerShape(key, data);
              }
            }
            // zoom magnification display
            if (config[1] == 'true') {
              document.getElementById('zoomDisplay').style.visibility = "visible";
              scope.zoomMag = zoomMags[zoomSlot] + "x zoom"
            } else {
              document.getElementById('zoomDisplay').style.visibility = "hidden";
            }
          } else {
            for(i=0;configKeys.length>i;i++){
              if(document.getElementById(configKeys[i]).checked == true) {
                if(config[i] != 'true') {
                  config[i] = 'true'
                  localStorage.setItem(configKeys[i], 'true');
                  // make sure not to change visiblity slot
                  activeVisibilitySlot--;
                  if (activeVisibilitySlot < 0) activeVisibilitySlot = 3;
                  element.css({
                    'background-color': 'rgba(50, 50, 50, ' + visibilitySlots[activeVisibilitySlot] + ')',
                  })
                  if(i == 3 || i == 5) {
                    setupMap(navMapData);
                  }
                }
              } else {
                if(config[i] != 'false') {
                  config[i] = 'false'
                  localStorage.setItem(configKeys[i], 'false');
                  // make sure not to change visiblity slot
                  activeVisibilitySlot--;
                  if (activeVisibilitySlot < 0) activeVisibilitySlot = 3;
                  element.css({
                    'background-color': 'rgba(50, 50, 50, ' + visibilitySlots[activeVisibilitySlot] + ')',
                  })
                  if(i == 3 || i == 5) {
                    setupMap(navMapData);
                  }
                }
              }
            }
          }
          // delete missing vehicles
          for (var key in vehicleShapes) {
            if (!data.objects[key]) {
              vehicleShapes[key].remove();
              delete vehicleShapes[key];
            }
          }
        }
        async function setupMap(data) {
          if(canvas == null) {
            //console.error('setupMap called before element is ready');
            return
          }
          if (data != null) {
            element.css({
              'position': 'relative',
              'margin': '10px',
              'perspective': '2000px',
              'background-color': 'rgba(50, 50, 50, ' + visibilitySlots[activeVisibilitySlot] + ')',
              'border': '2px solid rgba(180, 180, 180, 0.8)',
            });
            svg.style.transform = "scale(-1, -1)"
            // Draw the map elements
            var minX = 999, maxX = -999;
            var minY = 999, maxY = -999;
            if (data.terrainSize) {
              var terrainSizeX = Math.min(data.terrainSize[0] / Math.min(data.squareSize, 1) / mapScale, 2048);
              var terrainSizeY = Math.min(data.terrainSize[1] / Math.min(data.squareSize, 1) / mapScale, 2048);
              viewParams = [
                (-terrainSizeX / 2),
                (-terrainSizeY / 2),
                terrainSizeX,
                terrainSizeY
              ];
            }
            else {
              viewParams = [
                (-512),
                (-512),
                1024,
                1024
              ];
            }
            if (data.terrainSize) {
              mapScale = Math.max(Math.max(data.terrainSize[0], data.terrainSize[1]) / 2048, 1) // check whether to scale the map or size the map, if the size is over 8192 it causes an error which breaks the map, this allows larger maps to work without reducing the accuracy of smaller maps
            } else {
              mapScale = 1;
            }
            //console.log(mapScale) //Debugging
            //console.log(terrainSizeX)
            //console.log(terrainSizeY)
            mapcontainer.style.width = viewParams[2] + "px"
            mapcontainer.style.height = viewParams[3] + "px";
            svg.setAttribute('viewBox', viewParams.join(' '));

            var ctx = canvas.getContext("2d");
            canvas.style.width = viewParams[2]*2 + "px"
            canvas.style.height = viewParams[3]*2 + "px"
            canvas.width = viewParams[2]*2
            canvas.height = viewParams[3]*2
            canvasWrapper.style.width = canvas.style.width;
            canvasWrapper.style.height = canvas.style.height;

            ctx.width = (viewParams[2]*2)
            ctx.height = (viewParams[3]*2)

            ctx.clearRect(0, 0, viewParams[2]*2, viewParams[3]*2)
            //ctx.stroke()


            var ctxR = routeCanvas.getContext("2d");
            routeCanvas.style.width = viewParams[2]*2 + "px"
            routeCanvas.style.height = viewParams[3]*2 + "px"
            routeCanvas.width = viewParams[2]*2*routeScale
            routeCanvas.height = viewParams[3]*2*routeScale
            routeCanvasWrapper.style.width = routeCanvas.style.width;
            routeCanvasWrapper.style.height = routeCanvas.style.height;

            ctxR.width = (viewParams[2]*2*routeScale)
            ctxR.height = (viewParams[3]*2*routeScale)

            ctxR.clearRect(0, 0, viewParams[2]*2*routeScale, viewParams[3]*2*routeScale)
            //ctxR.stroke()

            var nodes = data.nodes;

            // figure out dimensions of the road network
            for (var key in nodes) {
              var el = nodes[key];
              if (-el.pos[0] < minX) minX = -el.pos[0];
              if (-el.pos[0] > maxX) maxX = -el.pos[0];
              if (el.pos[1] < minY) minY = el.pos[1];
              if (el.pos[1] > maxY) maxY = el.pos[1];
            }
            // use background image if existing, otherwise draw a simple grid
            if (data.minimapImage && data.terrainOffset && data.terrainSize) {
              // mapcontainer.style.backgroundSize = "100%"
              // mapcontainer.style.backgroundImage = "url('/" + data.minimapImage + "')"
              if (bgImage != null) {
                bgImage.remove()
              }
              bgImage = hu('<image>', svg).attr({
                'x': data.terrainOffset[0] / mapScale,
                'y': data.terrainOffset[1] / mapScale,
                'width': data.terrainSize[0] / mapScale,
                'height': data.terrainSize[1] / mapScale,
                'transform': "scale(-1,-1)",
                'xlink:href': "/" + data.minimapImage,
              }).prependTo(svg);

            } else if(config[5] == 'true') {
              // draw grid
              
              var distX = maxX - minX
              var dx = 50
              for (var x = minX; x <= maxX * dx + 1; x += dx) {
                _createLine({ x: x, y: minY * dx, radius: 0.7 + 1 / mapScale * (roadScaleZoom[zoomSlot] * mapScale + 1)}, { x: x, y: maxY * dx, radius: 0.7 + 1 / mapScale * (roadScaleZoom[zoomSlot] * mapScale + 1)}, '#FFFFFF55');
              }
              var distY = maxY - minY
              var dy = 50
              for (var y = minY; y <= maxY * dy + 1; y += dy) {
                _createLine({ x: minX * dy, y: y, radius: 0.7 + 1 / mapScale * (roadScaleZoom[zoomSlot] * mapScale + 1)}, { x: maxX * dy, y: y, radius: 0.7 + 1 / mapScale * (roadScaleZoom[zoomSlot] * mapScale + 1)}, '#FFFFFF55');
              }
            }

            function getDrivabilityColor(d) {
              if (d <= 0.1) return '#967864'; //'#967864';
              if (d > 0.1 && d < 0.9) return '#969678'; //'#969678';
              return '#DCDCDC'; //#DCDCDC';
            }

            function drawRoads(drivabilityMin, drivabilityMax) {
              for (var key in nodes) {
                var el = nodes[key];
                // walk the links of the node
                if (el.links !== undefined) { // links
                  var d = '';
                  var first = true;
                  for (var key2 in el.links) {
                    var el2 = nodes[key2];
                    var drivability = el.links[key2].drivability;
                    if (drivability >= drivabilityMin && drivability <= drivabilityMax) {

                      _createLine({
                        x: -el.pos[0] / mapScale + viewParams[2],
                        y: el.pos[1] / mapScale + viewParams[3],
                        radius: Math.min(Math.max(el.radius, 0), 5) * 3 / mapScale * (roadScaleZoom[zoomSlot] * mapScale + 1)
                      }, {
                          x: -el2.pos[0] / mapScale + viewParams[2],
                          y: el2.pos[1] / mapScale + viewParams[3],
                          radius: Math.min(Math.max(el2.radius, 0), 5) * 3 / mapScale * (roadScaleZoom[zoomSlot] * mapScale + 1) // prevents massive blobs due to waypoints having larger radius'
                        }, getDrivabilityColor(drivability)
                      );
                    }
                  }
                }
              }
            }
            drawRoads(0, 0.1)
            drawRoads(0.1, 0.9)
            drawRoads(0.9, 1)
            mapReady = true;
          }

        }

        // need to draw collectables after roads have been drawn
        function setupCollectables(data) {
          var mapSize = viewParams[2];
          var perimeterScale = 0;

          scope.collectableTotal = data.collectableAmount;
          scope.collectableCurrent = data.collectableCurrent;

          // Calculating the different radius' for the collectible containers
          // based on map size.
          switch (true) {
            case (mapSize <= 1024): {
              perimeterScale = 130;
              break;
            }
            case (mapSize > 1024): {
              perimeterScale = 125
              break;
            }
            case (mapSize >= 2048): {
              perimeterScale = 100;
              break;
            }
          };

          // remove any existing collectable svgs
          for (var key in collectableShapes) {
            collectableShapes[key].remove();
          }
          collGroup = hu('<g>', svg);
          // draw collectable svgs
          for (var item in data.collectableItems) {
            var offset = (Math.random() * 50);
            var coll = hu('<circle>', collGroup).attr({
              cx: (-data.collectableItems[item][1] - (Math.max(Math.random() * 50), 50)), // collectible will be located somewhere within this circle but never in the exact center.
              cy: (data.collectableItems[item][2] - (Math.max(Math.random() * 50), 50)),
              r: perimeterScale,
              fill: 'rgba(255, 160, 0, 0.2)',
              stroke: 'rgba(255, 160, 0, 0.6)',
              'stroke-width': 3,
            });
            // store all collectable svgs
            collectableShapes[item] = coll;
          }
        };

        bngApi.engineLua('extensions.ui_uiNavi.requestUIDashboardMap()');

        bngApi.engineLua(`extensions.core_collectables.sendUIState()`);

      }
    };
  }]);
