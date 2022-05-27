var tradingBrowser = null;
var trading_invite = null;

//Invite trade menu
mp.events.add("invite_trading", (text) => { 

    if(trading_invite == null) 
    { 
        trading_invite = mp.browsers.new("package://CEF/trade/invite.html");  
    } 

    if(trading_invite)
    {
        mp.gui.cursor.visible = true;   
        trading_invite.execute(`invite_player('${text}');`);
    }
});

mp.events.add("click_invite_buttons", (option = 1) => { 

    if(trading_invite) 
    {     
        mp.gui.cursor.visible = false;  
 
        mp.events.callRemote("preload_click_invite_buttons", option); 
    } 
});
 
//------------------------------------------------------------------------------- [START TRADE MENU] -------------------------------------------------------------------------------\\

//Add item on trade
mp.events.add("add_item_on_trade", (x, type, invColor, amount) => { 

    if(tradingBrowser) 
    { 
        mp.events.callRemote("preload_add_item_on_trade", x, type, invColor, amount); 
    } 
});

//Update offer
mp.events.add("update_offer", (x, amount, texting, texting2) => { 

    if(tradingBrowser) 
    { 
        tradingBrowser.execute(`document.getElementById('offer_placeholder').innerHTML = '${texting}'`);  

        tradingBrowser.execute(`document.getElementById('offer2_placeholder').innerHTML = '${texting2}'`);   
 
        tradingBrowser.execute(`document.getElementById('badge_inv${x}').innerHTML = '${amount}'`);  
    } 
});

 
//Start trade menu
mp.events.add("start_trading", (items, name) => { 

    if(tradingBrowser == null) tradingBrowser = mp.browsers.new("package://CEF/trade/index.html");   
   
    if(tradingBrowser)
    {
        //tradingBrowser.execute(`document.getElementById('offerName').innerHTML = '${name}'`);    
        tradingBrowser.execute(`document.getElementById('player_items').innerHTML = '${items}'`);    
 
        tradingBrowser.execute(`add_buttons(${false}, '${name}');`);
 
        tradingBrowser.execute(`document.querySelector('.container_global').style.display = 'block'`);    

        mp.gui.chat.show(false); 
        mp.gui.cursor.visible = true;    
    } 
});

//Close trade menu
mp.events.add("close_trade_menu", () => { 

    if(tradingBrowser) 
    {   
        tradingBrowser.execute(`document.querySelector('.container_global').style.display = 'none'`);     
    } 
});
  
//Load messages from index.html and send to trade.js
mp.events.add("send_message_to_players", (text) => { 

    if(tradingBrowser) 
    {  
        mp.events.callRemote("preload_text_chat", text); 
    } 
});

//Load message from trade.js and send to players
mp.events.add("preload_text_chat_andSnd", (text) => { 

    if(tradingBrowser) 
    {  
        tradingBrowser.execute(`send_message('${text}');`);
    } 
});

//Function click 'ready' and 'close'
mp.events.add("click_ready_close", (option) => { 

    if(tradingBrowser) 
    {  
        mp.events.callRemote("preload_ready_close", option); 
    } 
});

//Click ready/unready button
mp.events.add("update_trade_ready", (status, name) => { 

    if(tradingBrowser) 
    {    
        tradingBrowser.execute(`add_buttons(${status}, '${name}');`); 
    } 
});

mp.events.add("start_trade_timer", (time) => { 

    if(tradingBrowser) 
    {    
        tradingBrowser.execute(`document.querySelector('.timerTrade').style.display = '${(time == -1) ? ("none") : ("block")}'`);  
 
        tradingBrowser.execute(`document.getElementById('trade_finish_in').innerHTML = 'Trade finish in ${time} <i class="fa fa-clock-o"></i>'`);  
    } 
}); 

//Update offer
mp.events.add("update_offer_money", (text, text2) => { 

    if(tradingBrowser) 
    { 
        tradingBrowser.execute(`document.getElementById('your_offer').innerHTML = '${text}'`);   

        tradingBrowser.execute(`document.getElementById('offerName').innerHTML = '${text2}'`); 
    } 
});

//---------------------------------------------------------------------- [CLICK ITEM FOR ADD IN TRADE OFFER ] ----------------------------------------------------------------------//
mp.events.add("preload_clicked_item_inv2", (x, type, invColor, index, name, gender, status) => {
      
    tradingBrowser.execute(`clicked_item_inv2(${x}, ${type}, ${invColor}, '${index}', '${name}', ${gender}, ${status});`);  
});
 
mp.events.add("preload_clicked_item_inv", (x, type, invColor, gender) => { 

    mp.events.callRemote("preload_add_finall_item", x, type, invColor, gender); 
});
  
function clicked_item_inv(x, type, invColor, gender)
{  
    mp.trigger("preload_clicked_item_inv", x, type, invColor, gender);   
}
 
mp.events.add("show_finish_trade_items", (your_items, his_items, his_name) => { 

    tradingBrowser.execute(`document.getElementById('your_items').innerHTML = '${your_items}'`); 
    tradingBrowser.execute(`document.getElementById('his_items').innerHTML = '${his_items}'`);   
    tradingBrowser.execute(`document.getElementById('offer_finish_name').innerHTML = '${his_name}'`); 
  
    tradingBrowser.execute(`document.querySelector('.trade_finish').style.display = 'block'`);    
});
 
mp.events.add("destroy_trade_browser2", () => { 
 
    tradingBrowser.destroy();
    tradingBrowser = null;

    mp.gui.chat.show(true); 
    mp.gui.cursor.visible = false;   
});
  
function destroy_trade_browser()
{
    mp.trigger("destroy_trade_browser2");    
}


mp.events.add("clear_offer", (texting, texting2) => { 

    if(tradingBrowser) 
    { 
        tradingBrowser.execute(`document.getElementById('offer_placeholder').innerHTML = '${texting}'`);  

        tradingBrowser.execute(`document.getElementById('offer2_placeholder').innerHTML = '${texting2}'`);    
    } 
});

//------------------------------------------------------------------------------------------ [ DETTACH ITEM FROM PLAYER ] //------------------------------------------------------------------------------------------//

mp.events.add("load_dettach_item", (x, type, status) => { 

    mp.events.callRemote("preload_dettach_item", x, type, status);  
});




























mp.events.add("delete_item_offer", (x, type, index, quantity) => { 

    if(tradingBrowser) 
    { 
        mp.events.callRemote("preload_delete_item_offer", x, type, index, quantity);  
    } 
});