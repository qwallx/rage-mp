let tabBrowser = null;
 
mp.keys.bind(0x5A, true, function() {
  
    if(isChatActive() == false) mp.events.callRemote("deschideTab");	
}); 

mp.events.add('showTabBrowser', (tabString, totalPlayers) => {
 
    if(tabBrowser == null) 
    {
        tabBrowser = mp.browsers.new("package://CEF/serverTab/serverTab.html"); 
        mp.gui.cursor.visible = true;
    }

    if(tabBrowser != null)
    {
        tabBrowser.execute(`document.getElementById('totalPlayers-placeholder').innerHTML = '${totalPlayers}'`); 
        tabBrowser.execute(`document.getElementById('tabString-placeholder').innerHTML = '${tabString}'`);
    }  
}); 

mp.events.add('closeStatsBrowser', () => 
{
    if(tabBrowser != null) 
    {
        tabBrowser.destroy();
        tabBrowser = null;

        mp.gui.cursor.visible = false;
    }
});