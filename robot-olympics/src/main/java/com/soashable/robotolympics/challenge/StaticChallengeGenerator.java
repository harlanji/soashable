/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics.challenge;

import com.soashable.robotolympics.util.MD5;

/**
 *
 * @author Harlan
 */
public class StaticChallengeGenerator implements ChallengeGenerator {

    public static String CHALLENGE = "the color of a stop light";
    public static String CORRECT_RESPONSE = "red";
    
    public Challenge nextChallenge() {
        return new Challenge(CHALLENGE, MD5.getMd5Hex(CORRECT_RESPONSE) );
    }

}
