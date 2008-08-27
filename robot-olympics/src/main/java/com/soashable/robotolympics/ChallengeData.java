package com.soashable.robotolympics;

import com.soashable.robotolympics.challenge.Challenge;
import java.util.ArrayList;
import java.util.List;
import org.xmpp.packet.Packet;

/**
 * Associates a Challenge with a conversation, and holds information
 * about the state of the challenge (to,from,solved?,challengeId,held packets).
 * 
 * @author Harlan
 */
public class ChallengeData {

    private String challengeId;
    private String to;
    private String from;
    private List<Packet> packets = new ArrayList<Packet>();
    private boolean solved = false;
    
    private Challenge challenge; // this will be plain text of captcha challenge for images, videos, etc


    public ChallengeData(String challengeId, String to, String from) {
        super();
        this.challengeId = challengeId;
        this.to = to;
        this.from = from;
    }

    public String getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(String challengeId) {
        this.challengeId = challengeId;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<Packet> getPackets() {
        return packets;
    }

    public void setPackets(List<Packet> messages) {
        this.packets = packets;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public boolean isSolved() {
        return solved;
    }

    public void setSolved(boolean solved) {
        this.solved = solved;
    }

    public Challenge getChallenge() {
        return challenge;
    }

    public void setChallenge(Challenge challenge) {
        this.challenge = challenge;
    }
    
    
}
