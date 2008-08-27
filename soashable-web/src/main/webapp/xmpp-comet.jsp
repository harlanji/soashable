<%-- 
    Document   : index
    Created on : Dec 24, 2007, 10:53:18 AM
    Author     : Harlan
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>Comet echo RPC</title>
        <link rel="stylesheet" type="text/css" href="chat/chat.css"></link>
        <script type="text/javascript" src="dojo/dojo/dojo.js.uncompressed.js"></script>
        <script type="text/javascript">
            dojo.require("dojox.cometd");
            $ = dojo.byId;

            var echoBehaviours = { 
                '#phrase': {
                    "found": function(e){
                        e.setAttribute("autocomplete","OFF");
                    },
                    "onkeyup": function(e){
                        if(e.keyCode == dojo.keys.ENTER){
                            echoRpc($('phrase').value);
                            $('phrase').value='';
                            return false;
                        }
                        return true;
                    }
                },

                '#sendB': {
                    "onclick": function(e){
                        echoRpc($('phrase').value);
                        $('phrase').value='';
                        return false;
                    }
                }
            };


            function setUp(){

              var element=dojo.byId('phrase');
              element.setAttribute("autocomplete","OFF");
              dojo.connect(element, "onkeyup", function(e){   
                        if(e.keyCode == dojo.keys.ENTER){
                            sendXmpp($('phrase').value);
                            $('phrase').value='';
                            return false;
                        }
                        return true;
                    });
              element=dojo.byId('sendB');
              dojo.connect(element, "onclick", function(e){   
                        sendXmpp($('phrase').value);
                        $('phrase').value='';
                        return false;
                    });



              dojox.cometd.init("/CometTest/cometd");
              dojox.cometd.subscribe("/service/jabber","recvXmpp");
              dojox.cometd.subscribe("/service/jabber/log","recvLog");
            }

            function sendXmpp(packet){
                console.debug(packet);
                dojox.cometd.publish("/service/jabber", { packet: packet });
            }
            
            function recvXmpp(msg){
                var packet = msg.data.packet;
                dojo.byId("responses").innerHTML += " "+msg.channel+": "+msg.data.packet+"\n";
            }
            
            function recvLog(msg){
                var packet = msg.data.packet;
                dojo.byId("responses").innerHTML += " "+msg.channel+": "+msg.data.message+"\n";
            }

            dojo.addOnLoad(setUp);
        </script>

    </head>
    <body>
        
        <h1>Echo test</h1>
        <p>
            Echo data to ONLY this client using RPC style messaging over
            cometd. Requires a server side component at /service/echo which echos
            responses directly to the client.
        </p>
        <div>
            Echo: <input id="phrase" type="text"></input> <input id="sendB" class="button" type="submit" name="join" value="Send"/>

        </div>
        <pre id="responses"></pre>
    </body>
</html>
