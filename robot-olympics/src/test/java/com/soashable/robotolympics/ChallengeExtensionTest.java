/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics;

import junit.framework.TestCase;
import org.xmpp.forms.DataForm;
import org.xmpp.packet.Message;

/**
 *
 * @author Harlan
 */
public class ChallengeExtensionTest extends TestCase {
    ChallengeExtension challengeExt; 

    @Override
    protected void setUp() throws Exception {
        super.setUp();
        
        challengeExt = new ChallengeExtension();
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }

    public void testDefaultFormType() {
        assertEquals(DataForm.Type.form, challengeExt.getChallengeForm().getType());
    }
    
    public void testChallengeId() {
        String expectedCid = "abc123";
        
        challengeExt.setChallengeId(expectedCid);
        assertEquals(expectedCid, challengeExt.getChallengeId());
    }
    
    public void testPacketId() {
        String expectedSid = "abc123";
        
        challengeExt.setPacketId(expectedSid);
        assertEquals(expectedSid, challengeExt.getPacketId());
    }
    
    public void testFrom() {
        String expectedFrom = "abc123@soashable.com";
        
        challengeExt.setFrom(expectedFrom);
        assertEquals(expectedFrom, challengeExt.getFrom());
    }
    
    public void testQAChallenge() {
        String expectedChallenge = "abc123";
        
        challengeExt.setQAChallenge(expectedChallenge);
        assertEquals(expectedChallenge, challengeExt.getQAChallenge());
    }
    
    public void testQAResponse() {
        String expectedResponse = "abc123";
        
        challengeExt.setQAChallenge("challenge");
        challengeExt.setQAResponse(expectedResponse);
        assertEquals(expectedResponse, challengeExt.getQAResponse());
    }
    
    public void testSetQAResponse_NullChallenge() {
        String expectedResponse = "abc123";
        try {
            challengeExt.setQAResponse(expectedResponse);
            fail( "Should have thrown null pointer exception");
        } catch( Exception e ) {
            // do nothing
        }
    }
    
    public void testAddLegacyChallenge() {
        String challengeId = "abc123";
        String challenge = "def456";
        
        Message message = new Message();
        message.setTo("a@soashable.com");
        message.setFrom("b@soashable.com");
        
        challengeExt.setFrom(message.getFrom().toString());
        challengeExt.setChallengeId(challengeId);
        challengeExt.setQAChallenge(challenge);
        
        challengeExt.addLegacyChallenge(message);
        
        assertTrue("Challenge ID is not present in message", message.getBody().indexOf(challengeId) > -1);
        assertTrue("Challenge question is not present in message", message.getBody().indexOf(challenge) > -1);
    }

}
