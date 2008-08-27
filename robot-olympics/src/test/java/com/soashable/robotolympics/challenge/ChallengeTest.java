/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics.challenge;

import com.soashable.robotolympics.util.MD5;
import java.util.Arrays;
import junit.framework.TestCase;

/**
 *
 * @author Harlan
 */
public class ChallengeTest extends TestCase {        

    @Override
    protected void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }

    public void testIsResponsecorrect() {
        Challenge challenge = new Challenge("The fifth day of the week", Arrays.asList(new String[]{MD5.getMd5Hex("thursday"), MD5.getMd5Hex("thurs"), MD5.getMd5Hex("friday"), MD5.getMd5Hex("fri")}));
        
        assertTrue(challenge.isResponseCorrect("thursday"));
        assertTrue(challenge.isResponseCorrect("thurs"));
        assertTrue(challenge.isResponseCorrect("friday"));
        assertTrue(challenge.isResponseCorrect("fri"));
        
        assertFalse(challenge.isResponseCorrect("friz"));
    }

}
