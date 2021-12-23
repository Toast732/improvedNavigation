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
            font-size: 17px;
            font-family: Tahoma, sans-serif;
            position: relative;
            display: inline-block;
          }
        </style>
        <style>
          .checkboxlist {
            height: 4096px;
            width: 4096px;
            overflow-y:auto;
            visibility: hidden;
          }
        </style>
        <style>
        .checkbox .tooltiptextlines1 {
            visibility: hidden;
            font-size: 12px;
            font-family: Tahoma, sans-serif;
            width: 300px;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            position: absolute;
            bottom: 100%;
            left: 0%;
            height: 17px;
            opacity: 0;
            transition: opacity 0.3s;
            <!-- subtract 22 from height -->
          }
          .checkbox .tooltiptextlines2 {
            visibility: hidden;
            font-size: 12px;
            font-family: Tahoma, sans-serif;
            width: 300px;
            height: 29px;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            position: absolute;
            bottom: 100%;
            left: 0%;
            opacity: 0;
            transition: opacity 0.3s;
            <!-- subtract 34 from height -->
          }
          .checkbox .tooltiptextlines3 {
            visibility: hidden;
            font-size: 12px;
            font-family: Tahoma, sans-serif;
            width: 300px;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            position: absolute;
            bottom: 100%;
            left: 0%;
            height: 41px;
            opacity: 0;
            transition: opacity 0.3s;
            <!-- subtract 46 from height -->
          }
        </style>
        <style>
          .checkbox:hover .tooltiptextlines1:not(:hover) {
            animation-name:fade;
            animation-duration:0.3s;
            animation-fill-mode: forwards;
          }
          .checkbox:hover .tooltiptextlines2:not(:hover) {
            animation-name:fade;
            animation-duration:0.3s;
            animation-fill-mode: forwards;
          }
          .checkbox:hover .tooltiptextlines3:not(:hover) {
            animation-name:fade;
            animation-duration:0.3s;
            animation-fill-mode: forwards;
          }
          @keyframes fade {
            from {
                opacity: 0;
                visibility: hidden;
            }
        
            to {
                opacity: 1;
                visibility: visible;
            }
        }
        </style>
        <style>
          .settingswarning {
            width:475px;
            background-color: black;
            border: yellow;
            color: #fff;
            text-align: center;
            font-family: Tahoma, sans-serif;
            font size: 10px;
            position: absolute;
            bottom: -5%;
            right: 0%;
            display: inline-block;
            opacity: 1;
          }
        </style>
        <style>
        .settingswarning .tooltiptextlines1 {
            visibility: hidden;
            font-size: 12px;
            font-family: Tahoma, sans-serif;
            width: 300px;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            border-style: solid;
            border-color: rgba(250, 255, 94, 1);
            position: absolute;
            bottom: -7%;
            right: 50%;
            height: 17px;
            opacity: 0;
            transition: opacity 0.3s;
            <!-- subtract 22 from height -->
          }
          .settingswarning .tooltiptextlines2 {
            visibility: hidden;
            font-size: 12px;
            font-family: Tahoma, sans-serif;
            width: 300px;
            height: 29px;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            border-style: solid;
            border-color: rgba(250, 255, 94, 1);
            position: absolute;
            bottom: -7%;
            right: 50%;
            opacity: 0;
            transition: opacity 0.3s;
            <!-- subtract 34 from height -->
          }
          .settingswarning .tooltiptextlines3 {
            visibility: hidden;
            font-size: 12px;
            font-family: Tahoma, sans-serif;
            width: 300px;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            border-style: solid;
            border-color: rgba(250, 255, 94, 1);
            position: absolute;
            bottom: -7%;
            right: 50%;
            height: 41px;
            opacity: 0;
            transition: opacity 0.3s;
            <!-- subtract 46 from height -->
          }
        </style>
        <style>
          .settingswarning:hover .tooltiptextlines1:not(:hover) {
            animation-name:warningFade;
            animation-duration:0.3s;
            animation-fill-mode: forwards;
          }
          .settingswarning:hover .tooltiptextlines2:not(:hover) {
            animation-name:warningFade;
            animation-duration:0.3s;
            animation-fill-mode: forwards;
          }
          .settingswarning:hover .tooltiptextlines3:not(:hover) {
            animation-name:warningFade;
            animation-duration:0.3s;
            animation-fill-mode: forwards;
          }
          @keyframes warningFade {
            from {
                opacity: 0;
                visibility: hidden;
            }
        
            to {
                opacity: 1;
                visibility: visible;
            }
        }
        </style>
        <!-- Zoom Display -->
        <div id="zoomDisplay" style="font-size: 1.2em; padding: 0.2%; color: white; background-color: rgba(0, 0, 0, 0.3); position: absolute; bottom:0px; left:0px">
          {{ zoomMag }}
        </div>
        <!-- Offscreen Vehicles -->
        <foreignObject id="overflowVehiclesCanvasWrapper" style="position:fixed; top:0%; left:0%; transform: scale(1, 1);">
          <canvas id="overflowVehiclesCanvas" width="4096" height="4096" style="left:0%; position:fixed;"></canvas>
        </foreignObject>
        <!-- Settings Menu -->
        <foreignObject id="settingsCanvasWrapper" style="position:fixed; width:100%; height:100%; top:0px; left:0px; right:0px; bottom:0px">
          <canvas id="settingsCanvas" width="4096" height="4096"></canvas>
        </foreignObject>
        <div style="font-size: 1.2em; color: white; background-color: rgba(0, 0, 0, 0.3); position: absolute; bottom:0px; right:0px">
          <button id="settingsMenuButton" class="button">
            ⚙
          </button>
        </div>
        <!-- Settings Warning -->
        <div id="warnings" style="visibility: hidden;">
          <span class="settingswarning" id="northLockAndShowOffscreenVehicles">Conflict with setting 5 and 8 (hover for more info).
            <span class="tooltiptextlines3" style="position:fixed; bottom:5%; left:18%;">
              Having North Lock disabled and Show Offscreen Vehicles enabled will cause them to conflict, Show Offscreen Vehicles will not work as intended.
            </span>
          </span>
          <span class="settingswarning" id="speedTiedZoomWarning">Warning regarding speed tied zoom (hover for more info).
            <span class="tooltiptextlines3" style="position:fixed; bottom:5%; left:18%;">
              in 0.24, they removed obj.vel, which was used when speed tied zoom and lock north were enabled, they do not work nearly as nicely anymore.
            </span>
          </span>
        </div>
        <!-- Collectible Display -->
        <div ng-if="collectableTotal > 0" style="font-size: 1.2em; padding: 1%; color: white; background-color: rgba(0, 0, 0, 0.3); position: absolute; top:15px; left: 15px">
          <md-icon style="margin-bottom: 3px;" md-svg-src="{{ '/ui/modules/apps/Navigation/snowman.svg' }}" />
          {{ collectableCurrent + '/' + collectableTotal }}
        </div>

        <div id="openMap" ng-click="openBigMap()" style="cursor: pointer; position: absolute; top: 0; background-color:rgba(0, 0, 0, 0.6)">
          <md-icon class="material-icons" style="color:rgb(255, 103, 0, 128); margin: 0.1em">map</md-icon>
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
        var offScreenVehicleCanvas = document.getElementById("overflowVehiclesCanvas");
        var routeCanvas = document.getElementById('routeCanvas');
        var routeCanvasWrapper = document.getElementById('routeCanvasWrapper');
        var warningsPanel = document.getElementById('warnings');

        var settingsCheckBoxes = document.getElementById('checkboxes');

        var pointer = mapcontainer.children[1];
        var northPointer = root.children[0].children[1].children[0];

        var mapReady = false;
        var rotateMap = true;
        var viewParams = [];

        var navMapData = null;
        var bgImage = null;
        var red = true;

        // Settings
        var boolConfigTitles = ['Smooth Zoom', 'Display Zoom Level', 'Speed Tied Zoom', 'Scale Map Elements with Zoom', 'Lock North', 'Show Grid', 'Centre On Player', 'Show Offscreen Vehicles']
        var boolConfigTooltips = [`With this enabled, the map will smoothly zoom instead of snapping to the next zoom level.`, `With this enabled, in the bottom left corner it will display the zoom magnification.`, `With this enabled, it will change the zoom according to your speed, and will look as if your vehicle is lagging behind the map.`, `With this enabled, the icons such as your player icon and ai vehicle icons will scale according to the zoom. Helpful for when you're zoomed out extremely far.`, `With this enabled, the map will be locked to point north.`, `With this enabled, the map will force the grid to show, even over official maps.`, `With this enabled, it will focus exactly on the player instead of ahead of the player.`, `With this enabled, any vehicles that are too far to be seen on the minimap will have an arrow pointing towards it on the border of the map.`]
        var boolConfigStartY = 55; // where it first starts showing settings on the y level
        var boolConfigOffsetY = 25; // spacing between each setting
        var boolConfigTitleSize = 17; // the size of the text
        var boolConfigTitleFont = 'Tahoma, sans-serif';
        var settingsMenuBackground = 'rgba(35, 35, 35, 1)';
        var settingsMenuPanels = 'rgba(55, 55, 55, 1)';
        // load settings
        var boolConfigClicked = [];
        var boolConfig = [];
        var boolConfigDefaults = [true, true, true, true, false, true, true, true];
        var boolConfigKeys = ['navMapSmoothZoom', 'navMapDisplayZoom', 'navMapSpeedTiedZoom', 'ElementScaleTiedZoom', 'navMapNorthLocked', 'navMapShowGrid', 'navMapCentreOnPlayer', 'navMapShowOffScreenVehicles'];
        for(i=0;boolConfigKeys.length>i;i++){
          boolConfig[i] = localStorage.getItem(boolConfigKeys[i]);
          if(!boolConfig[i]) { // if the setting does not exist, then create it
            localStorage.setItem(boolConfigKeys[i], boolConfigDefaults[i]);
            boolConfig[i] = localStorage.getItem(boolConfigKeys[i]);
            boolConfigClicked[i] = true;
          }
        }
        if(boolConfig[4] == 'false' && boolConfig[7] == 'true') {
          document.getElementById('northLockAndShowOffscreenVehicles').style.opacity = '1';
        } else {
          document.getElementById('northLockAndShowOffscreenVehicles').style.opacity = '0';
        }
        if(boolConfig[2] == 'true' && boolConfig[4] == 'true') {
          document.getElementById('speedTiedZoomWarning').style.opacity = '1';
        } else {
          document.getElementById('speedTiedZoomWarning').style.opacity = '0';
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

        let staticMarkersDict = {}

        var collectableShapes = {};
        // group to store all collectable svgs
        var collGroup;

        var visibilitySlots = [0.2, 0.6, 0.8, 1]
        var activeVisibilitySlot = 1;

        var quad = null;//new Quadtree({x:0, y:0, width:1, height:1});
        settingsCanvas.addEventListener('click', function(event) {
          var x = event.pageX - settingsCanvas.getBoundingClientRect().left;
          var y = event.pageY - settingsCanvas.getBoundingClientRect().top;
          for(var i=0;boolConfig.length>i;i++) {
            if(boolConfig[i] == 'true') {
              if(Math.sqrt(((settingsCanvas.width - 25) - x)*((settingsCanvas.width - 25) - x) + ((50 + 25 * i) - y)*((50 + 25 * i) - y)) < 10) {
                boolConfig[i] = 'false';
                boolConfigClicked[i] = true;
              }
            } else {
              if(Math.sqrt(((settingsCanvas.width - 45) - x)*((settingsCanvas.width - 45) - x) + ((50 + 25 * i) - y)*((50 + 25 * i) - y)) < 10) {
                boolConfig[i] = 'true';
                boolConfigClicked[i] = true;
              }
            }
          }
        })
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        function getTextWidth(text, fontName, fontSize) {
          if(getTextWidth.c == undefined) {
            getTextWidth.c=document.createElement('canvas');
            getTextWidth.ctx=getTextWidth.c.getContext('2d');
          }
          var fontSpecs = fontSize + 'px ' + fontName;
          if(getTextWidth.ctx.font !== fontSpecs) {
            getTextWidth.ctx.font = fontSpecs;
          }
          return getTextWidth.ctx.measureText(text).width;
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
            ctx.fillStyle = settingsMenuBackground;
            ctx.fillRect(0, 0, settingsCanvas.width, settingsCanvas.height);
            // Draw Settings
            ctx.font = boolConfigTitleSize + 'px ' + boolConfigTitleFont;
            ctx.fillStyle = "white";
            for(var i=0;i<boolConfig.length;i++) {
              ctx.fillText(boolConfigTitles[i], settingsCanvas.width - (getTextWidth(boolConfigTitles[i], boolConfigTitleFont, boolConfigTitleSize) + 65), (boolConfigStartY + 4.5) + (boolConfigOffsetY + 0.25) * i);
            }
            // Draw UI Lines
            ctx.strokeStyle = "white";
            ctx.lineWidth = "2";
            ctx.moveTo(1, 37);
            ctx.lineTo(settingsCanvas.width - 1, 37);
            ctx.stroke();
            ctx.moveTo(165, 37);
            ctx.lineTo(165, settingsCanvas.height - 1);
            ctx.stroke();
            ctx.moveTo(1, settingsCanvas.height - 26);
            ctx.lineTo(settingsCanvas.width - 1, settingsCanvas.height - 26);
            ctx.stroke();
            // Draw UI Panels
            ctx.fillStyle = settingsMenuPanels;
            ctx.fillRect(1, 1, settingsCanvas.width - 1, 35)
            ctx.fillRect(1, settingsCanvas.height - 25, settingsCanvas.width - 1, settingsCanvas.height - 1)
            // Draw Title
            ctx.font = "28px Tahoma, sans-serif";
            ctx.fillStyle = "white";
            ctx.fillText("Navigation Settings", 10, 28)
            // Other
            warningsPanel.style.visibility = "visible";
            document.getElementById('openMap').style.opacity = '0';
            settingsIsOpen = true;
          } else {
            ctx.clearRect(0, 0, settingsCanvas.width, settingsCanvas.height)
            warningsPanel.style.visibility = "hidden";
            document.getElementById('openMap').style.opacity = '1';
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
          if (boolConfig[0] == 'true') {
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
              if(boolConfig[3] == 'true') {
                setupMap(navMapData);
              }
            }
            animatedZoom();
          } else {
            if(boolConfig[3] == 'true') {
              setupMap(navMapData);
            }
          }
        });
        scope.$on('NavigationMapUpdate', function (event, data) {
          if (!mapReady || !data) return;
          updateNavMap(data);
          centerMap(data.objects[data.controlID]);
        });
        let borderWidth = 0
        let borderHeight = 0
        let appCircleSizeSquared = 0
        scope.$on('app:resized', function (event, streams) {
          element.css({
            'width': streams.width-25 + "px",
            'height': streams.height-25 + "px",
          })
          settingsCanvas.width = streams.width-25
          settingsCanvas.height = streams.height-25
          offScreenVehicleCanvas.width = streams.width-25
          offScreenVehicleCanvas.height = streams.height-25
          appCircleSizeSquared = borderWidth * borderWidth + borderHeight * borderHeight
          setupMap()
        });

        scope.$on('$destroy', function () {
          bngApi.engineLua('extensions.unload("ui_uiNavi")');
          //StreamsManager.remove(requiredStreams);
        });

        var init = false;
        // receive the one-time map setup
        scope.$on('NavigationMap', function (event, data) {
          if (data && !init) {
            setupMap(data)
            init = true
          }
        })

        scope.$on('CollectablesInit', (event, data) => {
          if (data) setupCollectables(data)
        })

        scope.$on('NavigationStaticMarkers', (event, data) => {
          if (data) setupStaticMarkers(data)
        })

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

        async function centerMap(obj) {
          var speedZoomMultiplier = 2;

          // added in 0.3.1, due to obj.vel being removed in version 0.24
          if(zoomStates[zoomSlot] <= 0 && boolConfig[2] == "true") { // removes speed based zoom if you are zoomed too far in
            if(boolConfig[4] == "true") { // if lock north is enabled
              obj.dir = [
                0, // north, [0]
                0, // east, [1]
                0, // south, [2]
                0, // west, [3]
                1 // used to find if north/south is in the positives or the negatives, [4]
              ]; // object direction
              
              if(obj.rot >= 90 || obj.rot <= -90) {
                obj.dir[0] = 1; // north = true
                if(obj.rot >= 90) {
                  obj.dir[4] = 1
                } else {
                  obj.dir[4] = -1
                }
              } else if(obj.rot <= 90 && obj.rot >= -90) {
                obj.dir[2] = -1; // south = true
              }

              if(obj.rot <= 180 && obj.rot >= 0) {
                obj.dir[1] = 1; // east = true
              } else if(obj.rot >= -180 && obj.rot <= 0) {
                obj.dir[3] = -1; // west = true
              }
              obj.vel = [
                (((obj.dir[0]*obj.speed)*(obj.rot/(180*obj.dir[4]))) + ((obj.dir[2]*obj.speed)*((obj.rot+90)/90))), // north/south
                ((obj.dir[1]*obj.speed)*Math.min((90/obj.rot), 1)+((obj.dir[3]*obj.speed)*Math.min((-90/obj.rot), 1))) // east/west
              ];
              var zoomX = -(1 + (obj.vel[1]) * 1.5); // speed tied zoom
              var zoomY = 1 + (obj.vel[0]) * 1.5;
              var zoom = Math.min(1 + (obj.speed * 3.6) * 1.5, 200);
            } else {
              var zoomX = 0;
              var zoomY = Math.min(1 + (obj.speed * 3.6) * 1.5, 200);;
              var zoom = Math.min(1 + (obj.speed * 3.6) * 1.5, 200);
            }
          } else {
            var zoomX = 0;
            var zoomY = 0;
            var zoom = 0;
          }
          // center on what?
          var focusX = -obj.pos[0] / mapScale;
          var focusY = obj.pos[1] / mapScale;
          var borderWidth = root.children[0].clientWidth;
          var borderHeight = root.children[0].clientHeight;
          var degreeNorth = boolConfig[4] == 'false' ? (obj.rot - 90) : 90;
          var npx = - Math.cos(degreeNorth * Math.PI / 180) * borderWidth * 0.75;
          var npy = borderHeight * 0.5 - Math.sin(degreeNorth * Math.PI / 180) * borderHeight * 0.75;
          var translateX = (((viewParams[0]) + borderWidth/2 - 10) + focusX + 10 + (zoomX / 2));
          if (boolConfig[6] == 'true') { // if centre on player is enabled
            var translateY = (((viewParams[1]) + borderHeight/2) + focusY + (zoomY / 2)); // translate map with speed
          } else {
            var translateY = (((viewParams[1]) + borderHeight/1.5) + focusY + (zoomY / 2)); // translate map with speed
          }
          if(settingsIsOpen == false) { // is settings menu closed?
            if(boolConfig[4] == 'false') { // if lock north is disabled
              mapcontainer.style.transform = "translate3d(" + translateX + "px, " + translateY + "px," + (mapZoom - (zoom * speedZoomMultiplier)) + "px)" + "rotateX(" + 0 + (zoom / 10) + "deg)" + "rotateZ(" + (180 + Utils.roundDec(obj.rot, 2)) + "deg)"
              mapcontainer.style.transformOrigin = (((viewParams[0] * -1)) - focusX) + "px " + ((viewParams[1] * -1) - focusY) + "px"
            } else { // if lock north is enabled
              mapcontainer.style.transform = "translate3d(" + translateX + "px, " + translateY + "px," + (mapZoom - (zoom * speedZoomMultiplier)) + "px)" + "rotateX(" + 0 + (zoom / 10) + "deg)" + "rotateZ(" + (270 + Utils.roundDec(90, 2)) + "deg)"
            }

            northPointer.style.transform = 'translate(' + Math.min(Math.max(npx, -borderWidth / 2 - 2), borderWidth / 2) + 'px,' + Math.min(Math.max(npy, 0), borderHeight) + 'px)';
          } else { // hide north pointer
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
            // get size of canvas
            var borderWidth = offScreenVehicleCanvas.width;
            var borderHeight = offScreenVehicleCanvas.height;
            var ctx = offScreenVehicleCanvas.getContext('2d');
            // clear background
            ctx.beginPath();
            ctx.clearRect(0, 0, borderWidth, borderHeight);
            ctx.fill();
            ctx.closePath();
            // update shape positions
            for (var key in data.objects) {
              var o = data.objects[key];
              var p = data.objects[data.controlID];
              if (vehicleShapes[key]) {
                var px = -o.pos[0] / mapScale;
                var py = o.pos[1] / mapScale;
                var rot = Math.floor(-o.rot);
                if(boolConfig[3] == 'true') { // if the user wants map elements to scale with map zoom
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
                if(boolConfig[7] == 'true') { // if show offscreen vehicles is enabled
                  if(o != p) {
                    // check if vehicle is visible by the player
                    var speedZoomMultiplier = 2;
                    if(zoomStates[zoomSlot] <= 0 && boolConfig[2] == "true") { // removes speed based zoom if you are zoomed too far in
                      var zoom = (mapZoom - (Math.min(1 + (p.speed * 3.6) * 1.5, 200) * speedZoomMultiplier));
                    } else {
                      var zoom = mapZoom
                    }
                    var visibleAreaWidth = borderWidth + 100 * (zoom/-500)*mapScale;
                    var visibleAreaHeight = borderHeight + 100 * (zoom/-500)*mapScale;
                    var dX = (p.pos[0] - o.pos[0])
                    var dY = (p.pos[1] - o.pos[1])
                    if (boolConfig[6] == 'true') { // if centre on player is enabled
                      var borderSizeDiv = 2;
                      var subAmountY = 0;
                    } else {
                      var borderSizeDiv = 1.5;
                      var subAmountY = (borderHeight/4)*mapScale;
                    }
                    if (mapScale > 1) {
                      var scalingRatioWidth = ((borderWidth)/475)*(-mapScale*2)
                      var scalingRatioHeight = ((borderHeight*borderSizeDiv)/275)*(-mapScale*2)
                    } else {
                      var scalingRatioWidth = (borderWidth/475)*mapScale
                      var scalingRatioHeight = (borderHeight/275)*mapScale
                    }
                    if(dX > visibleAreaWidth/2 - (27.5*mapScale) * scalingRatioWidth|| dY > (visibleAreaHeight/2 - 27.5 * scalingRatioHeight) - subAmountY|| dX < -visibleAreaWidth/2 + (27.5*mapScale) * scalingRatioWidth|| dY < (-visibleAreaHeight/2 + 27.5 * scalingRatioHeight) - subAmountY/2) {
                      var r = (borderWidth+borderHeight)/2; // radius
                      // angle, oversized vehicle y, oversized vehicle x
                      var angle = boolConfig[4] == 'false' ? (p.rot - (-getAngle(-p.pos[0]/mapScale, p.pos[1]/mapScale, -o.pos[0]/mapScale, o.pos[1]/mapScale) - 135)* 180 / Math.PI - 180) : getAngle(-p.pos[0]/mapScale, p.pos[1]/mapScale, -o.pos[0]/mapScale, o.pos[1]/mapScale) * 180 / Math.PI - 180;
                      var ovy = (r * Math.sin(Math.PI * 2 * angle / 360)) + borderHeight/borderSizeDiv
                      var ovx = (r * Math.cos(Math.PI * 2 * angle / 360)) + borderWidth/2

                      var rotType = 0;

                      if (ovx < 0) { // if its too far left
                        var tvx = 0;
                        var tvy = (Math.abs(ovx)/Math.sin((180 - (angle + 90)) * Math.PI / 180) * Math.sin(angle * Math.PI / 180)) + ovy;
                        if (tvy > borderHeight/2) { // if its below the middle of the map
                          rotType = 1
                        }
                      } else if (borderWidth < ovx) { // if its too far right
                        var tvx = borderWidth;
                        var tvy = (Math.abs(ovx - borderWidth)/Math.sin((180 - (angle - 90)) * Math.PI / 180) * Math.sin(angle * Math.PI / 180)) + ovy;
                        if (tvy > borderHeight/2) { // if its below the middle of the map
                          rotType = 1
                        }
                      }

                      if (ovy < 0) { // if its too high up
                        var tvy = 0;
                        var tvx = (Math.abs(ovy)/Math.sin(angle * Math.PI / 180) * Math.sin((180 - (angle + 90)) * Math.PI / 180)) + ovx;
                        if (tvx < 0) { // if its too far left
                          tvx = 0;
                          tvy = (Math.abs(ovx)/Math.sin((180 - (angle + 90)) * Math.PI / 180) * Math.sin(angle * Math.PI / 180)) + ovy;
                        } else if (tvx > borderWidth) { // if its too far right
                          tvx = borderWidth;
                          tvy = (Math.abs(ovx - borderWidth)/Math.sin((180 - (angle - 90)) * Math.PI / 180) * Math.sin(angle * Math.PI / 180)) + ovy; 
                        }
                      }
                      if (borderHeight < ovy) { // if its too far down
                        var tvy = borderHeight;
                        var tvx = (Math.abs(ovy - borderHeight)/Math.sin(angle * Math.PI / 180) * Math.sin((180 - (angle - 90)) * Math.PI / 180)) + ovx;
                        rotType = 1
                        if (tvx < 0 ) { // if its too far left
                          tvx = 0;
                          tvy = (Math.abs(ovx)/Math.sin((180 - (angle + 90)) * Math.PI / 180) * Math.sin(angle * Math.PI / 180)) + ovy;
                        } else if (tvx > borderWidth) { // if its too far right
                          tvx = borderWidth;
                          tvy = (Math.abs(ovx - borderWidth)/Math.sin((180 - (angle - 90)) * Math.PI / 180) * Math.sin(angle * Math.PI / 180)) + ovy; 
                        }
                      }
                      ctx.save();
                      ctx.beginPath();
                      ctx.lineWidth = 4;
                      ctx.strokeStyle = '#FFFFFF';
                      ctx.translate(tvx, tvy);
                      if (rotType == 1) {
                        ctx.rotate(Math.PI - Math.cos(getAngle(borderWidth/2, borderHeight/2, tvx, tvy)));
                      } else {
                        ctx.rotate(Math.cos(getAngle(borderWidth/2, borderHeight/2, tvx, tvy)));
                      }
                      ctx.translate(-tvx, -tvy)
                      ctx.moveTo(tvx, tvy);
                      ctx.lineTo(tvx + 15, tvy + 15)
                      ctx.lineTo(tvx + 8, tvy + 22)
                      ctx.lineTo(tvx, tvy + 15)
                      ctx.lineTo(tvx - 8, tvy + 22)
                      ctx.lineTo(tvx - 15, tvy + 15)
                      ctx.lineTo(tvx + 1, tvy)
                      ctx.fillStyle = '#A3D39C';
                      ctx.fill();
                      ctx.stroke();
                      ctx.closePath();
                      ctx.restore();

                    }
                  }
                }
                vehicleShapes[key].attr({"transform": "translate(" + px + "," + py + ") scale(" + iconScale + "," + iconScale + ") rotate(" + rot + ")", "opacity": show});
              }
              else {
                updatePlayerShape(key, data);
              }
            }
            // zoom magnification display
            if (boolConfig[1] == 'true') {
              document.getElementById('zoomDisplay').style.visibility = "visible";
              scope.zoomMag = zoomMags[zoomSlot] + "x zoom"
            } else {
              document.getElementById('zoomDisplay').style.visibility = "hidden";
            }
          } else {
            var ctx = settingsCanvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = settingsMenuBackground;
            ctx.fillRect(settingsCanvas.width - 60, 40, settingsCanvas.width, settingsCanvas.height - 73);
            ctx.fill();
            for(i=0;boolConfigKeys.length>i;i++){
              for(var xO=0;xO<20;xO++) {
                ctx.beginPath();
                if(boolConfig[i] == 'true') {
                  ctx.fillStyle = "rgba(255, 103, 0, 1)";
                } else {
                  ctx.fillStyle = "rgba(125, 125, 125, 1)";
                }
                ctx.arc(settingsCanvas.width - 25 - xO, boolConfigStartY + boolConfigOffsetY * i, 10, 0, 2 * Math.PI);
                ctx.fill();
              }
              ctx.beginPath();
              ctx.fillStyle = "rgba(255, 255, 255, 1)";
              if(boolConfig[i] == 'true') {
                ctx.arc(settingsCanvas.width - 25, boolConfigStartY + boolConfigOffsetY * i, 10, 0, 2 * Math.PI);
              } else {
                ctx.arc(settingsCanvas.width - 45, boolConfigStartY + boolConfigOffsetY * i, 10, 0, 2 * Math.PI);
              }
              ctx.fill();
              if(boolConfigClicked[i] == true) {
                if(boolConfig[i] == 'false') {
                  boolConfigClicked[i] = false;
                  localStorage.setItem(boolConfigKeys[i], 'false');
                  // make sure not to change visiblity slot
                  activeVisibilitySlot--;
                  if (activeVisibilitySlot < 0) activeVisibilitySlot = 3;
                  element.css({
                    'background-color': 'rgba(50, 50, 50, ' + visibilitySlots[activeVisibilitySlot] + ')',
                  })
                  if(i == 3 || i == 5 || i == 7) {
                    setupMap(navMapData);
                  }
                  if(boolConfig[4] == 'false' && boolConfig[7] == 'true') { 
                    document.getElementById('northLockAndShowOffscreenVehicles').style.opacity = '1';
                  } else {
                    document.getElementById('northLockAndShowOffscreenVehicles').style.opacity = '0';
                  }
                  if(boolConfig[2] == 'true' && boolConfig[4] == 'true') { 
                    document.getElementById('speedTiedZoomWarning').style.opacity = '1';
                  } else {
                    document.getElementById('speedTiedZoomWarning').style.opacity = '0';
                  }
                }
                if(boolConfig[i] == 'true') {
                  boolConfigClicked[i] = false;
                  localStorage.setItem(boolConfigKeys[i], 'true');
                  // make sure not to change visiblity slot
                  activeVisibilitySlot--;
                  if (activeVisibilitySlot < 0) activeVisibilitySlot = 3;
                  element.css({
                    'background-color': 'rgba(50, 50, 50, ' + visibilitySlots[activeVisibilitySlot] + ')',
                  })
                  if(i == 3 || i == 5 || i == 7) {
                    setupMap(navMapData);
                  }
                  if(boolConfig[4] == 'false' && boolConfig[7] == 'true') { 
                    document.getElementById('northLockAndShowOffscreenVehicles').style.opacity = '1';
                  } else {
                    document.getElementById('northLockAndShowOffscreenVehicles').style.opacity = '0';
                  }
                  if(boolConfig[2] == 'true' && boolConfig[4] == 'true') { 
                    document.getElementById('speedTiedZoomWarning').style.opacity = '1';
                  } else {
                    document.getElementById('speedTiedZoomWarning').style.opacity = '0';
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
        function getAngle(originX, originY, targetX, targetY) {
          var dx = originX - targetX;
          var dy = originY - targetY;
          var theta = Math.atan2(-dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = east
          return theta;
        }
        async function setupMap(data) {
          await sleep(250);
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
            // reset overflow vehicles
            var borderWidth = offScreenVehicleCanvas.width;
            var borderHeight = offScreenVehicleCanvas.height;
            var ctx = offScreenVehicleCanvas.getContext('2d');
            ctx.clearRect(0, 0, borderWidth, borderHeight);
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

            } 
            if(boolConfig[5] == 'true') {
              if (maxX == -999 && minX == 999 && maxY == -999 && minY == 999) {
                minX = -2048;
                maxX = 2048;
                minY = -2048;
                maxY = 2048;
              }
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

        async function setupStaticMarkers(data) {
          if(data.key === undefined)
            return
          if(staticMarkersDict[data.key] === undefined) {
            staticMarkersDict[data.key] = {}
          }
          let dict = staticMarkersDict[data.key]
          var mapSize = viewParams[2]

          // remove any existing collectable svgs
          for (var key in dict) {
            dict[key].marker.remove()
          }
          markerGroup = hu('<g>', svg)
          // draw collectable svgs
          for(var i=0; i<data.items.length; i+=4) {
            /**
            let marker = hu('<image>', markerGroup)
            let icon = '/ui/modules/apps/navigation/missionIcons/'+data.items[i+3]+'.svg'
            marker.attr({
              x: -25, y:-25,
              width: 50, height: 50,
              style: style + "0px);",
              'xlink:href': icon
            })
            // store all collectable svgs
            **/
           if(boolConfig[3] == 'true') {
             var r = 8 + mapZoom / -500 * 0.151;
           } else {
             var r = 8;
           }

            let style = "transform: translate3d("+(-data.items[i+0])+"px,"+(data.items[i+1])+"px,"
            let marker = hu('<circle>', svg)
            marker.attr('cx', -data.items[i+0])
            marker.attr('cy', data.items[i+1])
            marker.attr('r', r)
            marker.attr('fill', '#2C5CFF')
            marker.attr('style', style)
            marker.css('stroke', '#FFFFFF')
            marker.css('stroke-width', '3px')
            //marker.attr('visibility', 'hidden')


            dict[i/4.0] = {
              marker: marker,

              screenX: -data.items[i+0],
              screenY: data.items[i+1],
              visible: false
            }
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

        scope.openBigMap = function() {
          bngApi.engineLua(`if freeroam_bigMapMode then freeroam_bigMapMode.enterBigMap() end`)
        }

        bngApi.engineLua('extensions.ui_uiNavi.requestUIDashboardMap()')

        bngApi.engineLua(`extensions.core_collectables.sendUIState()`)
        bngApi.engineLua(`if gameplay_missions_missionEnter then gameplay_missions_missionEnter.sendMissionLocationsToMinimap() end`)

      }
    };
  }]);
