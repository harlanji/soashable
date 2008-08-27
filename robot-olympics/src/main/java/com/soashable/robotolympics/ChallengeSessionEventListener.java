/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics;

import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import org.jivesoftware.openfire.event.SessionEventListener;
import org.jivesoftware.openfire.session.Session;
import org.jivesoftware.util.Log;

/**
 * Keeps track of how many anonymous sessions a host has open, and is used by 
 * ChallengePacketInterceptor.
 * 
 * @author Harlan
 */
public class ChallengeSessionEventListener implements SessionEventListener {

    private Map<String, SessionStats> anonSessionStats = new HashMap<String, SessionStats>(); 
    
    
    public void anonymousSessionCreated(Session session) {
        try {
            String hostAddress = session.getHostAddress();
            SessionStats stats = anonSessionStats.get(hostAddress);

            if( stats == null ) {
                stats = new SessionStats(hostAddress);
                anonSessionStats.put(hostAddress, stats);
            } 

            stats.setSessionCount( stats.getSessionCount() + 1);
        } catch( UnknownHostException e ) {
            // wtf?
            Log.error(e);
        }
    }

    public void anonymousSessionDestroyed(Session session) {
        try {
            String hostAddress = session.getHostAddress();
            SessionStats stats = anonSessionStats.get(hostAddress);

            if( stats == null ) {
                stats = new SessionStats(hostAddress);
                anonSessionStats.put(hostAddress, stats);
            } 

            // in practice this should never fall below 0
            stats.setSessionCount( stats.getSessionCount() - 1);
        } catch( UnknownHostException e ) {
            // wtf?
            Log.error(e);
        }
    }

    public void resourceBound(Session session) {
        
    }

    public void sessionCreated(Session session) {
        
    }

    public void sessionDestroyed(Session session) {
        
    }

    public Map<String, SessionStats> getAnonSessionStats() {
        return anonSessionStats;
    }
    
    
    
    public class SessionStats {
        private String hostAddress;
        private int sessionCount = 0;

        public SessionStats(String hostAddress) {
            this.hostAddress = hostAddress;
        }

        public String getHostAddress() {
            return hostAddress;
        }

        public void setHostAddress(String hostAddress) {
            this.hostAddress = hostAddress;
        }

        public int getSessionCount() {
            return sessionCount;
        }

        public void setSessionCount(int sessionCount) {
            this.sessionCount = sessionCount;
        }  
    }  
}
