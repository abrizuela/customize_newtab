/**
* customize_newtab namespace.
*/
if ("undefined" == typeof(customize_newtab)) {
  var customize_newtab = {};
};

customize_newtab.Preferences = {
	
  sizeWidthDisplay: function() {
    var bgSizeWidthCheck = window.document.getElementById("cnt_bgSizeWidthCheck").checked;
    window.document.getElementById("cnt_bgSizeWidth").disabled = bgSizeWidthCheck;
    window.document.getElementById("cnt_bgSizeWidthM").disabled = bgSizeWidthCheck;
  },
  
  sizeHeightDisplay: function() {
    var bgSizeHeightCheck = window.document.getElementById("cnt_bgsizeHeightCheck").checked;
    window.document.getElementById("cnt_bgSizeHeight").disabled = bgSizeHeightCheck;
    window.document.getElementById("cnt_bgSizeHeightM").disabled = bgSizeHeightCheck;
  },
  
  showTopSites: function() {
    var showTopSitesCheck = window.document.getElementById("cnt_showTopSites").checked;
    window.document.getElementById("cnt_columnsLabel").disabled = !showTopSitesCheck;
    window.document.getElementById("cnt_columns").disabled = !showTopSitesCheck;
    window.document.getElementById("cnt_rowsLabel").disabled = !showTopSitesCheck;
    window.document.getElementById("cnt_rows").disabled = !showTopSitesCheck;
  },
  
  sizeTypeDisplay: function() {
    var bgSize = window.document.getElementById("cnt_bgSize").value;
    var sizeCustomGroup = window.document.getElementById("sizeCustomGroup");
    var bgRepeat = window.document.getElementById("bgRepeat");
    switch(bgSize){
      case "cover":
        bgRepeat.style.display="none";
        sizeCustomGroup.style.display="none";
        break;
      case "contain":
        bgRepeat.style.display="";
        sizeCustomGroup.style.display="none";
        break;
      case "custom":
        bgRepeat.style.display="";
        sizeCustomGroup.style.display="";
        break;
    };
    window.sizeToContent();
    customize_newtab.Preferences.sizeWidthDisplay();
    customize_newtab.Preferences.sizeHeightDisplay();
    customize_newtab.Preferences.showTopSites();
  },
  
  preferenceLoad: function() {
    customize_newtab.Preferences.sizeTypeDisplay();
  },
  
  preferenceAccept: function() {
  // Save the image's url.
    var sibPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var imageLocationURL = window.document.getElementById("cnt_imageLocation").value;
    sibPref.setCharPref("extensions.customize_newtab.bgImage",imageLocationURL);
      
  // If you are in about:newtab page, reload it to take effect the new preferences.
    try{
      if(window.arguments[0].location.href == "about:newtab"){
        window.arguments[0].location.reload();
      };
    } catch(e){
      //do nothing
    };
	},
  
  showFileBrowser: function() {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var filePicker = Components.classes["@mozilla.org/filepicker;1"]
                     .createInstance(nsIFilePicker);
    
    filePicker.init(window, null, nsIFilePicker.modeOpen);
    filePicker.appendFilters(nsIFilePicker.filterImages);
    var filePickerWindow = filePicker.show();
    if (filePickerWindow == nsIFilePicker.returnOK){
      window.document.getElementById("cnt_imageLocation").value = filePicker.fileURL.spec;
    };
  },
  
  homePageCheck: function() {
    var sibPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    if(window.document.getElementById("cnt_homePageCheck").checked){
      var oldHomePage = sibPref.getCharPref("browser.startup.homepage");
      // Save the old home page url.
      var str = Components.classes["@mozilla.org/supports-string;1"]
                .createInstance(Components.interfaces.nsISupportsString);
      str.data = oldHomePage;
      sibPref.setComplexValue("extensions.customize_newtab.oldHomePage",Components.interfaces.nsISupportsString, str);
      
      sibPref.setCharPref("browser.startup.homepage", "about:newtab");
    }else{
      var oldHomePage = sibPref.getCharPref("extensions.customize_newtab.oldHomePage");
      // Put the old home page back.
      var str = Components.classes["@mozilla.org/supports-string;1"]
                .createInstance(Components.interfaces.nsISupportsString);
      str.data = oldHomePage;
      sibPref.setComplexValue("browser.startup.homepage",Components.interfaces.nsISupportsString, str);
    };
  },
  
  preferencesUnload: function() {
    var instantApply = window.document.getElementById("cnt-preferences").instantApply;
    if(instantApply){ 
      //If instantApply is true (which is the default on Linux and OS-X), 
      //I need run the preferenceAccept function when the prefwindow unloads
      customize_newtab.Preferences.preferenceAccept();
    };
  },
  
}