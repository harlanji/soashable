/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics;

import com.soashable.robotolympics.challenge.ChallengeGenerator;
import com.soashable.robotolympics.challenge.TextCaptchaChallengeGenerator;
import java.io.File;
import org.jivesoftware.openfire.SessionManager;
import org.jivesoftware.openfire.XMPPServer;
import org.jivesoftware.openfire.container.Plugin;
import org.jivesoftware.openfire.container.PluginManager;
import org.jivesoftware.openfire.event.SessionEventDispatcher;
import org.jivesoftware.openfire.interceptor.InterceptorManager;
import org.jivesoftware.openfire.interceptor.PacketRejectedException;
import org.jivesoftware.openfire.session.Session;
import org.jivesoftware.util.JiveGlobals;
import org.xmpp.packet.Packet;

/**
 * An implementation of XEP-0159 with support for XEP-0158 picture_recog using JCaptcha
 * @author Harlan
 */
public class RobotOlympicsPlugin implements Plugin {

    private XMPPServer server;
    private InterceptorManager interceptorManager;
    
    private ChallengeManager challengeManager;
    private ChallengeGenerator challengeGenerator;
    
    private ChallengePacketInterceptor challengeInterceptor;
    private ChallengeSessionEventListener challengeSessionListener;
    
    private String textCaptchaApiKey;
    private int numAnonBeforeSpim;

    
    public void initializePlugin(PluginManager manager, File pluginDirectory) {
        
        readProperties();
        
        // TODO not hardcode
        challengeGenerator = new TextCaptchaChallengeGenerator(getTextCaptchaApiKey());
        
        server = XMPPServer.getInstance();
        interceptorManager = InterceptorManager.getInstance();
        
        challengeManager = new ChallengeManager(challengeGenerator, server);
        
        challengeSessionListener = new ChallengeSessionEventListener();
        challengeInterceptor = new ChallengePacketInterceptor(challengeManager, challengeSessionListener);

        interceptorManager.addInterceptor(challengeInterceptor);
        SessionEventDispatcher.addListener(challengeSessionListener);

        
        applyProperties();
    }

    public void destroyPlugin() {
        interceptorManager.removeInterceptor(challengeInterceptor);
        SessionEventDispatcher.removeListener(challengeSessionListener);
        
        writeProperties();
    }


    public void applyProperties() {
        if(challengeGenerator instanceof TextCaptchaChallengeGenerator ) {
            ((TextCaptchaChallengeGenerator)challengeGenerator).setApiKey(getTextCaptchaApiKey());
        }
        challengeInterceptor.setNumAnonBeforeSpim(getNumAnonBeforeSpim());        
    }
    
    public void readProperties() {
        setTextCaptchaApiKey(JiveGlobals.getProperty(RobotOlympicsProperties.TEXTCAPTCHA_API_KEY));
        setNumAnonBeforeSpim(JiveGlobals.getIntProperty(RobotOlympicsProperties.NUM_ANON_BEFORE_SPIM, 3));
    }
    
    public void writeProperties() {
        JiveGlobals.setProperty(RobotOlympicsProperties.TEXTCAPTCHA_API_KEY, getTextCaptchaApiKey());
        JiveGlobals.setProperty(RobotOlympicsProperties.NUM_ANON_BEFORE_SPIM, String.valueOf(getNumAnonBeforeSpim()));
    }
    
    
    public String getTextCaptchaApiKey() {
        return textCaptchaApiKey;
    }

    public void setTextCaptchaApiKey(String textCaptchaApiKey) {
        this.textCaptchaApiKey = textCaptchaApiKey;
    }

    public void setNumAnonBeforeSpim(int numAnonBeforeSpim) {
        this.numAnonBeforeSpim = numAnonBeforeSpim;
    }

    public int getNumAnonBeforeSpim() {
        return numAnonBeforeSpim;
    }
}
