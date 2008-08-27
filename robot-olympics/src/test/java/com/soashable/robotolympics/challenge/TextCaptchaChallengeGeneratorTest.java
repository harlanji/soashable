/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics.challenge;

import com.soashable.robotolympics.util.MockTextCaptchaChallengeGenerator;
import java.io.StringReader;
import junit.framework.TestCase;
import org.dom4j.Document;
import org.dom4j.io.SAXReader;

/**
 *
 * @author Harlan
 */
public class TextCaptchaChallengeGeneratorTest extends TestCase {
    
    MockTextCaptchaChallengeGenerator challengeGenerator;

    @Override
    protected void setUp() throws Exception {
        super.setUp();
        
        // empty string because we will never use the API service
        challengeGenerator = new MockTextCaptchaChallengeGenerator();
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }

    /**
     * This does not test functionality of getting the response document from the 
     * URL and also assumes internals of how getChallenge works. Never the less,
     * it tests that it properly parses the result when it comes back.
     * 
     * @throws java.lang.Exception
     */
    public void testGetChallenge() throws Exception {
        
        StringBuffer responseXmlBuffer = new StringBuffer();
        responseXmlBuffer.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        responseXmlBuffer.append("<captcha>");
        responseXmlBuffer.append("<question>Which of ten, sixty six or 68 is the biggest?</question>");
        responseXmlBuffer.append("<answer>a3f390d88e4c41f2747bfa2f1b5f87db</answer>");
        responseXmlBuffer.append("<answer>f92e5b0180df749f878b302f4ced4f7a</answer>");
        responseXmlBuffer.append("</captcha>");

        SAXReader reader = new SAXReader();
        Document responseDoc = reader.read(new StringReader(responseXmlBuffer.toString()));
        
        
        challengeGenerator.setResponseDoc(responseDoc);
        
        Challenge challenge = challengeGenerator.nextChallenge();
        
        
        assertNotNull("Challenge was null", challenge);
        
        assertNotNull("There was no challenge string", challenge.getChallenge());
        assertNotNull("There were no correct responses", challenge.getCorrectResponses());
    }

}
