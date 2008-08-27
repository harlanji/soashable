/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics.challenge;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

/**
 *
 * @author Harlan
 */
public class TextCaptchaChallengeGenerator implements ChallengeGenerator {
    private String apiKey;

    public TextCaptchaChallengeGenerator(String apiKey) {
        this.apiKey = apiKey;
    }

    public Challenge nextChallenge() {
        try {
            return parseResponse(getResponseDoc());
        } catch( Exception e ) {
            // TODO throw exception
            return null;
        }
    }
    
    protected Document getResponseDoc() throws DocumentException, MalformedURLException {
        String url = "http://textcaptcha.com/api/"+apiKey;
        
        SAXReader reader = new SAXReader();
        Document responseDoc = reader.read(new URL(url));
        
        return responseDoc;
    }
    
    protected Challenge parseResponse(Document responseDoc ) {
        responseDoc.normalize(); // kill white space, etc

        String challengeString = responseDoc.selectSingleNode("/captcha/question").getStringValue();

        List<Node> answerNodes = responseDoc.selectNodes("//captcha/answer");
        List<String> correctResponses = new ArrayList<String>();
        for( Node answerNode : answerNodes ) {
            correctResponses.add(answerNode.getStringValue());
        }

        Challenge challenge = new Challenge(challengeString, correctResponses);
        
        return challenge;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    
    

}
