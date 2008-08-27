/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics;

import com.soashable.robotolympics.challenge.StaticChallengeGenerator;
import junit.framework.TestCase;
import org.xmpp.packet.Message;
import org.xmpp.packet.Packet;

/**
 *
 * @author Harlan
 */
public class ChallengePacketInterceptorTest extends TestCase {

    public ChallengeManager challengeManager;
    public ChallengeSessionEventListener challengeSessionListener;
    
    public ChallengePacketInterceptor interceptor;

    
    
    @Override
    protected void setUp() throws Exception {
        super.setUp();
        
        challengeSessionListener = new ChallengeSessionEventListener();
        challengeManager = new ChallengeManager(new StaticChallengeGenerator());
        
        interceptor = new ChallengePacketInterceptor(challengeManager, challengeSessionListener) {

            @Override
            protected boolean isLocalPacket(Packet packet) {
                return true;
            }

            @Override
            protected void route(Packet packet) {
                // do nothing
            }
            
        };
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }

    public void testInnocentMessage() {
        Message message = new Message();
        message.setTo("a@soashable.com");
        message.setFrom("b@soashable.com");
        message.setBody("testing");
        
        //interceptor.interceptPacket(message, session, incoming, processed);
                
    }

}
