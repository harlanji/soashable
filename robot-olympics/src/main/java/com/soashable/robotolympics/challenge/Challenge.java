/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics.challenge;

import com.soashable.robotolympics.util.MD5;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Holds a challenge string and a list of correct answers.
 * 
 * @author Harlan
 */
public class Challenge {
    private String challenge;
    private List<String> correctResponses;

    public Challenge() {
    }
    
    public Challenge(String challenge, String correctResponse) {
        this.challenge = challenge;
        this.correctResponses = Arrays.asList( new String[] {correctResponse} );
    }
    
    public Challenge(String challenge, List<String> correctResponses) {
        this.challenge = challenge;
        this.correctResponses = correctResponses;
    }
    
    

    public String getChallenge() {
        return challenge;
    }

    public void setChallenge(String challenge) {
        this.challenge = challenge;
    }

    public List<String> getCorrectResponses() {
        return correctResponses;
    }

    public void setCorrectResponses(List<String> correctResponses) {
        this.correctResponses = correctResponses;
    }
    
    public boolean isResponseCorrect(String response) {
        String processedResponse = MD5.getMd5Hex( response.toLowerCase().trim() ).toLowerCase();
        
        
        for(String correctResponse : correctResponses) {
            if( processedResponse.equals(correctResponse) ) {
                return true;
            }
        }
        return false;
    }
}
