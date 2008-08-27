package com.soashable.robotolympics;

import com.soashable.robotolympics.challenge.Challenge;
import com.soashable.robotolympics.challenge.ChallengeGenerator;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jivesoftware.openfire.XMPPServer;
import org.jivesoftware.openfire.event.SessionEventListener;
import org.jivesoftware.openfire.interceptor.PacketInterceptor;
import org.jivesoftware.openfire.interceptor.PacketRejectedException;
import org.jivesoftware.openfire.session.Session;
import org.jivesoftware.util.Log;
import org.xmpp.forms.DataForm;
import org.xmpp.packet.Message;
import org.xmpp.packet.Packet;
import org.xmpp.packet.PacketError;
import com.soashable.robotolympics.ChallengeSessionEventListener.SessionStats;

/**
 * Manages ChallengeData objects and exposes the state of a challenge on a 
 * Packet and challengeId basis.
 * 
 * @author Harlan
 */
public class ChallengeManager  {

    /* package */ XMPPServer server;
    private Map<String, ChallengeData> challengeMap = new HashMap<String, ChallengeData>();
    private ChallengeGenerator challengeGenerator;


    public ChallengeManager(ChallengeGenerator challengeGenerator) {
        this.challengeGenerator = challengeGenerator;
    }
    
    public ChallengeManager(ChallengeGenerator challengeGenerator, XMPPServer server) {
        this.challengeGenerator = challengeGenerator;
        this.server = server;
    }
    
    public boolean hasBeenChallenged(Packet packet) {
        String key = makeChallengeId(packet);

        return challengeMap.containsKey(key);
    }

    public boolean isChallengeMet(Packet packet) {
        String key = makeChallengeId(packet);

        return challengeMap.containsKey(key) && challengeMap.get(key).isSolved();
    }

    public boolean isChallengeResponse(Packet packet) {
        String challengeId = makeChallengeId(packet);
        return packet instanceof Message && ((Message)packet).getBody() != null && ((Message)packet).getBody().indexOf(challengeId) > -1;
        
        //return packet.getExtension(ChallengeExtension.ELEMENT_NAME, ChallengeExtension.NAMESPACE) != null;
    }

    public void appendPacket(Packet packet) {
        String key = makeChallengeId(packet);
        challengeMap.get(key).getPackets().add(packet);
    }

    public Packet createChallenge(Packet packet, Session session) {
        String challengeId = makeChallengeId(packet);
        Challenge challenge = challengeGenerator.nextChallenge();
        String question = challenge.getChallenge();
        

        ChallengeExtension challengeExt = new ChallengeExtension();
        challengeExt.setFrom(packet.getTo().toString());
        challengeExt.setChallengeId(challengeId);
        // the original packet ID
        if( packet.getID() != null ) {
            challengeExt.setPacketId(packet.getID());
        }
        challengeExt.setQAChallenge(question);
        
        
        Message challengeMessage = new Message();
        challengeMessage.setTo(packet.getFrom());
        challengeMessage.setFrom(packet.getTo());
        challengeMessage.addExtension(challengeExt);
        
        challengeExt.addLegacyChallenge(challengeMessage);
        
        // add the challenge to the challenge map
        ChallengeData challengeData = new ChallengeData(challengeId, packet.getTo().toBareJID(), packet.getFrom().toBareJID() );
        challengeData.setChallenge( challenge );
        this.challengeMap.put(challengeId, challengeData);

        return challengeMessage;
    }

    public boolean checkResponse(Packet packet, Session session) {
        String key = makeChallengeId(packet);
        ChallengeData challengeData = challengeMap.get(key);
        
        String bodyText = ((Message)packet).getBody().trim();
        
        String[] parts = bodyText.split("\\ ");
        
        String response = parts[0];
        String challengeId = parts[1];
        
        
        if( Log.isDebugEnabled() ) {
            Log.debug("Challenge response ["+challengeId+"] "+response+"." );
        }
        
        boolean challengePassed = challengeData.getChallengeId().equals(challengeId)  
                && challengeData.getChallenge().isResponseCorrect(response);

        challengeData.setSolved(challengePassed);

        return challengePassed;
    }

    
    public Challenge getChallenge( Packet packet ) {
        String key = makeChallengeId(packet);
        return challengeMap.get(key).getChallenge();
    }

    public String makeChallengeId(Packet packet) {
        String challenge = "challenge:" + packet.getFrom() + ":" + packet.getTo();
        return Integer.toHexString( challenge.hashCode() );
    }
    
    public List<Packet> getPackets(String challengeId) {
        return this.challengeMap.get(challengeId).getPackets();
    }
    
    public void clearPackets(String challengeId ) {
        getPackets(challengeId).clear();
    }

    
}
