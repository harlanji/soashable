/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.openfirecometd;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextAttributeEvent;
import javax.servlet.ServletContextAttributeListener;

import org.mortbay.cometd.BayeuxService;
import org.jivesoftware.util.Log;

import dojox.cometd.Bayeux;
import dojox.cometd.Client;
import dojox.cometd.Listener;
import dojox.cometd.Message;
import dojox.cometd.MessageListener;
import dojox.cometd.RemoveListener;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArraySet;

public class BayeuxStartupListener implements ServletContextAttributeListener
{
    public void initialize(Bayeux bayeux)
    {
        synchronized(bayeux)
        {
            if (!bayeux.hasChannel("/service/echo"))
            {
                new EchoRPC(bayeux);
                new Monitor(bayeux);
                new ChatService(bayeux);
            }
        }
    }
    
    public void attributeAdded(ServletContextAttributeEvent scab)
    {
        if (scab.getName().equals(Bayeux.DOJOX_COMETD_BAYEUX))
        {
            Bayeux bayeux=(Bayeux)scab.getValue();
            initialize(bayeux);
        }
    }

    public void attributeRemoved(ServletContextAttributeEvent scab)
    {

    }

    public void attributeReplaced(ServletContextAttributeEvent scab)
    {

    }

    
    public static class EchoRPC extends BayeuxService
    {
        public EchoRPC(Bayeux bayeux)
        {
            super(bayeux,"echo");
            subscribe("/service/echo","doEcho");
        }
        
        public Object doEcho(Client client, Object data)
        {
	    Log.info("ECHO from "+client+" "+data);
	    return data;
        }
    }
    
    public static class Monitor extends BayeuxService
    {
        public Monitor(Bayeux bayeux)
        {
            super(bayeux,"monitor");
            subscribe("/meta/subscribe","monitorSubscribe");
            subscribe("/meta/unsubscribe","monitorUnsubscribe");
            subscribe("/meta/*","monitorMeta");
        }
        
        public void monitorSubscribe(Client client, Message message)
        {
            Log.info("Subscribe from "+client+" for "+message.get(Bayeux.SUBSCRIPTION_FIELD));
        }
        
        public void monitorUnsubscribe(Client client, Message message)
        {
            Log.info("Unsubscribe from "+client+" for "+message.get(Bayeux.SUBSCRIPTION_FIELD));
        }
        
        public void monitorMeta(Client client, Message message)
        {
            Log.debug(message.getChannel()+" from "+client);
        }
    }
    
    public static class ChatService extends BayeuxService
    {
        ConcurrentMap<String,Set<String>> _members = new ConcurrentHashMap<String,Set<String>>();
        
        public ChatService(Bayeux bayeux)
        {
            super(bayeux,"chat");
            subscribe("/chat/**","trackMembers");
        }
        
        public void trackMembers(Client joiner,String channel,Map<String,Object> data,String id)
        {
            if (Boolean.TRUE.equals(data.get("join")))
            {
                Set<String> m = _members.get(channel);
                if (m==null)
                {
                    Set<String> new_list=new CopyOnWriteArraySet<String>();
                    m=_members.putIfAbsent(channel,new_list);
                    if (m==null)
                        m=new_list;
                }
                
                final Set<String> members=m;
                final String username=(String)data.get("user");
                
                members.add(username);
                joiner.addListener(new RemoveListener(){
                    public void removed(String clientId, boolean timeout)
                    {
                        members.remove(username);
                        Log.info("members: "+members);
                    }
                });
                Log.info("Members: "+members);
                send(joiner,channel,members,id);
            }
        }
    }
}
