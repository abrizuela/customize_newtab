/**
* customize_newtab namespace.
*/
if ("undefined" == typeof(customize_newtab)) {
  var customize_newtab = {};
};

window.addEventListener("load", function load(event){
  window.removeEventListener("load", load, false); //remove listener, no longer needed
  customize_newtab.BrowserOverlay.init();
},false);

customize_newtab.BrowserOverlay = {
  init: function() {
    var appcontent = document.getElementById("appcontent");   // browser
    if(appcontent){
      appcontent.addEventListener("pageshow", customize_newtab.BrowserOverlay.onPageLoad, false);
    };
  },
  
  setSettingButton: function(doc) {
  //Set the settings button on the background
    //Create the button
    var settingsButton = doc.createElement("div");
    settingsButton.id = "newtab-settings";
    
    //Set the button
    settingsButton.style.backgroundImage = "url('chrome://customize_newtab/skin/icon_38.png')";
    settingsButton.style.backgroundColor = "transparent";
    settingsButton.style.backgroundRepeat = "no-repeat";
    settingsButton.style.border = "medium none";
    settingsButton.style.height = "38px";
    settingsButton.style.width = "38px";
    settingsButton.style.cursor = "pointer";
    settingsButton.style.padding = "0";
    settingsButton.style.position = "absolute";
    settingsButton.style.right = "14px";
    settingsButton.style.top = "50px"; 
    
    // Insert the button
    var tog = doc.getElementById("newtab-customize-button");
    var parentDiv = tog.parentNode;
    parentDiv.insertBefore(settingsButton, tog.nextSibling);
    
    var cntStringsBundle = document.getElementById("cnt-string-bundle");
    var title_settingsButton = cntStringsBundle.getString('title_settingsButton');
    settingsButton.setAttribute("tooltiptext", title_settingsButton);
    
    settingsButton.addEventListener("click",function() {
      window.openDialog('chrome://customize_newtab/content/options.xul','ent-preferences','chrome, modal, dialog',doc);
    },false);
  },
  
  onPageLoad: function(aEvent) {
    var sibPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
    // do something with the loaded page.
    // doc.location is a Location object (see below for a link).
    // You can use it to make your code executed on certain pages only.
    if(doc.location.href == "about:newtab"){
      var bgImage = sibPref.getCharPref("extensions.customize_newtab.bgImage");
      var bgRepeat = sibPref.getCharPref("extensions.customize_newtab.bgRepeat");
      var bgSize = sibPref.getCharPref("extensions.customize_newtab.bgSize");
      var bgPositionH = sibPref.getCharPref("extensions.customize_newtab.bgPositionH");
      var bgPositionV = sibPref.getCharPref("extensions.customize_newtab.bgPositionV");
      var bgColor = sibPref.getCharPref("extensions.customize_newtab.bgColor");
      var bgSizeWidth = "";
      var bgSizeHeight = "";
      
      if (bgSize == "custom") {
        
        var bgSizeWidthAuto = sibPref.getBoolPref("extensions.customize_newtab.bgSizeWidthAuto");
        if(bgSizeWidthAuto){
          bgSizeWidth = "auto";
        }else{
          var bgSizeWidthN = sibPref.getIntPref("extensions.customize_newtab.bgSizeWidth");
          var bgSizeWidthM = sibPref.getCharPref("extensions.customize_newtab.bgSizeWidthM");
          bgSizeWidth = bgSizeWidthN + bgSizeWidthM;
        };
        
        var bgSizeHeightAuto = sibPref.getBoolPref("extensions.customize_newtab.bgSizeHeightAuto");        
        if(bgSizeHeightAuto){
          bgSizeHeight = "auto";
        }else{
          var bgSizeHeightN = sibPref.getIntPref("extensions.customize_newtab.bgSizeHeight");
          var bgSizeHeightM = sibPref.getCharPref("extensions.customize_newtab.bgSizeHeightM");
          bgSizeHeight = bgSizeHeightN+bgSizeHeightM
        };
        
        bgSize = bgSizeWidth +' '+ bgSizeHeight;
      };
      
    //Set the background
      var newTab = doc.getElementById("newtab-vertical-margin");
      newTab.style.backgroundColor = bgColor;
      newTab.style.backgroundImage = "url("+bgImage+")";
      newTab.style.backgroundSize = bgSize;
      if(bgSize == "cover"){
      //
      }else if (bgSize == "contain"){
        newTab.style.backgroundRepeat = bgRepeat;
        newTab.style.backgroundPosition = "center center"
      }else{
        newTab.style.backgroundRepeat = bgRepeat;
        newTab.style.backgroundPosition = bgPositionH + ' ' + bgPositionV;
      };
      customize_newtab.BrowserOverlay.setSettingButton(doc);
      
      doc.getElementById("newtab-margin-bottom").style.visibility="hidden";
      
      var showTopSites = sibPref.getBoolPref("extensions.customize_newtab.showTopSites");
      if(showTopSites){
        doc.getElementById("newtab-horizontal-margin").style.display="";
      }else{ 
        doc.getElementById("newtab-horizontal-margin").style.display="none";
      };
      
      var showSearchBar = sibPref.getBoolPref("extensions.customize_newtab.showSearchBar");
      if(showSearchBar){
        doc.getElementById("newtab-search-form").style.display="";
      }else{ 
        doc.getElementById("newtab-search-form").style.display="none";
      };
      
    };
  },  
}