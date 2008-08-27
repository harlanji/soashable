/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics;

import java.net.UnknownHostException;
import org.jivesoftware.openfire.XMPPServer;
import org.xmpp.forms.DataForm;
import org.jivesoftware.openfire.interceptor.PacketInterceptor;
import org.jivesoftware.openfire.interceptor.PacketRejectedException;
import org.jivesoftware.openfire.session.Session;
import org.jivesoftware.util.Log;
import org.xmpp.packet.Message;
import org.xmpp.packet.Packet;
import org.xmpp.packet.PacketError;

/**
 * Intercepts and holds Message packaets until a challenge has been met, if
 * it is determined that a client is subject to SPIM control.
 * 
 * @author Harlan
 */
public class ChallengePacketInterceptor implements PacketInterceptor {
    private ChallengeManager challengeManager;
    private ChallengeSessionEventListener challengeSessionListener;
    private XMPPServer server;
    private int numAnonBeforeSpim;
    

    ChallengePacketInterceptor(ChallengeManager challengeManager, ChallengeSessionEventListener challengeSessionListener) {
        this.challengeManager = challengeManager;
        this.challengeSessionListener = challengeSessionListener;
        
        // HACK
        this.server = challengeManager.server;
    }
    
    public void interceptPacket(Packet packet, Session session, boolean incoming, boolean processed) throws PacketRejectedException {
        if (processed || !incoming) {
            return;
        }
        
        // we only care about messages (for now)
        if (!(packet instanceof Message)) {
            return;
        }

        if( !isLocalPacket(packet)) {
            return;
        }
        
        // infinite loop if we don't ignore these...
        ChallengeExtension challengeExt = (ChallengeExtension)packet.getExtension( ChallengeExtension.ELEMENT_NAME, ChallengeExtension.NAMESPACE );
        if( challengeExt != null && challengeExt.getChallengeForm().getType() == DataForm.Type.form ) {
            return;
        }
        

        try {
            // we don't care if they only have 3 or fewer sessions open
            ChallengeSessionEventListener.SessionStats stats = challengeSessionListener.getAnonSessionStats().get(session.getHostAddress());
            
            if (stats == null || stats.getSessionCount() <= getNumAnonBeforeSpim()) {
                return;
            }
        } catch (UnknownHostException ex) {
            Log.error(ex);
        }

        Log.debug("Robot Olympics with packet ["+packet.getElement().getName()+"] from "+packet.getFrom() );

        if (!challengeManager.isChallengeMet(packet)) {
            if (!challengeManager.hasBeenChallenged(packet)) {
                Packet challenge = challengeManager.createChallenge(packet, session);
                route(challenge);
                
                challengeManager.appendPacket(packet);
                throw new PacketRejectedException("Robot Olympics: Must meet challenge.");
            }
            
            if (challengeManager.isChallengeResponse(packet)) {
                if (challengeManager.checkResponse(packet, session)) {
                    String challengeId = challengeManager.makeChallengeId(packet);
                    for(Packet packetToSend : challengeManager.getPackets(challengeId)) {
                        route(packetToSend);
                    }
                    
                    challengeManager.clearPackets(challengeId);
                    
                    Message successMessage = new Message();
                    successMessage.setTo( packet.getFrom() );
                    successMessage.setFrom( packet.getTo() );
                    successMessage.setBody( "Anti-Spim Device: Thank you. Your messages have been forwarded.");
                    route(successMessage);
                    
                    throw new PacketRejectedException("Robot Olympics: Passed challenge; discarding.");
                } else {
                    Message failureMessage = new Message();
                    failureMessage.setTo( packet.getFrom() );
                    failureMessage.setFrom( packet.getTo() );

                    PacketError error = new PacketError(PacketError.Condition.not_acceptable, 
                            PacketError.Type.cancel, 
                            "Anti-Spim Device: Failed, but you can keep trying.");
                    
                    failureMessage.setError(error);
                    
                    route(failureMessage);
                }
            } else {
                Message failureMessage = new Message();
                failureMessage.setTo( packet.getFrom() );
                failureMessage.setFrom( packet.getTo() );
                failureMessage.setBody( "Anti-Spim Device: Please complete the robot challenge.");
                route(failureMessage);
                
                challengeManager.appendPacket(packet);
                throw new PacketRejectedException("Robot Olympics: Must meet challenge.");
            }
        } 
    }
    
    protected boolean isLocalPacket( Packet packet ) {
        return server.isLocal(packet.getFrom());
    }
    
    protected void route(Packet packet ) {
        // challengeManager.server = HACK
        challengeManager.server.getPacketRouter().route(packet);
    }

    public int getNumAnonBeforeSpim() {
        return numAnonBeforeSpim;
    }

    public void setNumAnonBeforeSpim(int numAnonBeforeSpim) {
        this.numAnonBeforeSpim = numAnonBeforeSpim;
    }
}
