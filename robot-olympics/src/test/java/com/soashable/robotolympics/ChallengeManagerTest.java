/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics;

import com.soashable.robotolympics.challenge.Challenge;
import com.soashable.robotolympics.challenge.StaticChallengeGenerator;
import com.soashable.robotolympics.util.MockSession;
import junit.framework.TestCase;
import org.xmpp.packet.Message;
import org.xmpp.packet.Packet;

/**
 *
 * @author Harlan
 */
public class ChallengeManagerTest extends TestCase {
    
    MockSession session;
    Message message;
    ChallengeManager challengeManager;
    
    public ChallengeManagerTest(String testName) {
        super(testName);
    }            

    @Override
    protected void setUp() throws Exception {
        super.setUp();
        
        session = new MockSession();
        session.setServerName("test.com");
        
        message = new Message();
        message.setTo("harlan@soashable.com");
        message.setFrom("harlan@soashable.com");
        message.setBody("Hello, Friend");
        message.setID("message1");
        
        challengeManager = new ChallengeManager(new StaticChallengeGenerator());
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }
    
    public void testHasBeenChallengedFalse() {
        assertFalse("hasBeenChallenged was not false but it should be when no challenge has been issued", challengeManager.hasBeenChallenged(message));
    }
    
    public void testCreateChallenge() {
        Packet challengePacket = challengeManager.createChallenge(message, session);
        String packetBody = ((Message)challengePacket).getBody();
        
        String challengeId = challengeManager.makeChallengeId(message);
        Challenge challenge = challengeManager.getChallenge( message );
        String challengeString = challenge.getChallenge();
        
        assertEquals( "The chalenge must come from the original recipient", message.getTo(), challengePacket.getFrom() );
        
        assertNotNull( "Challenge does not have extension", challengePacket.getExtension( ChallengeExtension.ELEMENT_NAME, ChallengeExtension.NAMESPACE ) );
        
        assertTrue( "There was no challenge ID present in the challenge message", packetBody.indexOf(challengeId) > -1 );
        assertTrue( "There was no question present in the challenge message", packetBody.indexOf(challengeString) > -1 );
        
        assertTrue( "Challenge has been issued but hasBeenChallenged says it hasn't", challengeManager.hasBeenChallenged(message));

    }
    
    public void testCreateChallengeNullPacketId() {
        message.setID(null);
        
        try {
            Packet challenge = challengeManager.createChallenge(message, session);
        } catch( NullPointerException e ) {
            fail( "Should not fail with null packet ID" );
        }
        
    }

    public void testRespondToChallengeCorrect() {
        Packet challenge = challengeManager.createChallenge(message, session);
        
        String correctResponse = challengeManager.getChallenge( message ).getCorrectResponses().get(0);
        
        Message challengeResponse = new Message();
        challengeResponse.setTo(message.getFrom());
        challengeResponse.setFrom(message.getTo());
        challengeResponse.setBody( StaticChallengeGenerator.CORRECT_RESPONSE + " " + challengeManager.makeChallengeId(message));
        
        boolean challengePassed = challengeManager.checkResponse(challengeResponse, session);
        
        assertTrue( "Challenge should have passed but didn't", challengePassed );
        assertTrue( "isChallgeMet did not return the correct answer",challengeManager.isChallengeMet(message) );
    }
    
    public void testRespondToChallengeIncorrect() {
        Packet challenge = challengeManager.createChallenge(message, session);
        
        String incorrectResponse = "fdsfsdfdsf2354";
        
        Message challengeResponse = new Message();
        challengeResponse.setTo(message.getFrom());
        challengeResponse.setFrom(message.getTo());
        challengeResponse.setBody(incorrectResponse + " " + challengeManager.makeChallengeId(message));
        
        boolean challengePassed = challengeManager.checkResponse(challengeResponse, session);
        
        assertFalse( "Challenge should have passed but didn't", challengePassed );
        assertFalse( "isChallgeMet did not return the correct answer", challengeManager.isChallengeMet(message) );
    }
    
    public void testIsChallengeResponseTrue() {
        Message challengeResponse = new Message();
        challengeResponse.setTo(message.getFrom());
        challengeResponse.setFrom(message.getTo());
        challengeResponse.setBody(challengeManager.makeChallengeId(message));
        
        assertTrue( "Legit response was not identified as a response", challengeManager.isChallengeResponse(challengeResponse) );
    }
    
    public void testIsChallengeResponseFalse() {
        Message challengeResponse = new Message();
        challengeResponse.setTo(message.getFrom());
        challengeResponse.setFrom(message.getTo());
        challengeResponse.setBody("fdsfs");
        
        assertFalse( "Non-response was identified as a response", challengeManager.isChallengeResponse(challengeResponse) );
    }
    
    public void testIsChallengeResponseNoBody() {
        Message challengeResponse = new Message();
        challengeResponse.setTo(message.getFrom());
        challengeResponse.setFrom(message.getTo());
        
        try {
            assertFalse( "Non-response was identified as a response", challengeManager.isChallengeResponse(challengeResponse) );
        } catch( NullPointerException e ) {
            fail( "Null pointer with no body." );
        }
    }
}
