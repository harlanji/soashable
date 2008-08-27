/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.httpfilexfer;

import org.jivesoftware.openfire.XMPPServer;
import org.jivesoftware.openfire.filetransfer.FileTransfer;
import org.jivesoftware.openfire.filetransfer.FileTransferInterceptor;
import org.jivesoftware.openfire.filetransfer.FileTransferRejectedException;
import org.jivesoftware.openfire.http.HttpConnection;
import org.jivesoftware.openfire.http.HttpSession;
import org.jivesoftware.openfire.interceptor.PacketInterceptor;
import org.jivesoftware.openfire.interceptor.PacketRejectedException;
import org.jivesoftware.openfire.session.Session;
import org.xmpp.packet.IQ;
import org.xmpp.packet.JID;
import org.xmpp.packet.Packet;
import org.xmpp.packet.PacketError;

/**
 *
 * @author Harlan
 */
public class HttpFileXferInterceptor implements FileTransferInterceptor {

    public void interceptFileTransfer(FileTransfer fileTransfer, boolean isReady) throws FileTransferRejectedException {
        XMPPServer server = XMPPServer.getInstance();
        
        JID initiator = new JID(fileTransfer.getInitiator());
        JID receiver = new JID(fileTransfer.getTarget());
        Session initiatorSession = server.getSessionManager().getSession(initiator);
        Session receiverSession = server.getSessionManager().getSession(receiver);
        
        // initial request initiated locally from an HTTP session
        if( !isReady 
                && server.isLocal( initiator ) 
                && initiatorSession != null 
                && initiatorSession instanceof HttpSession ) {
            
            // TODO:
            // - tell servlet we're expecting a file with a given ID
            // - silently discard the packet without notifying anyone
            //   - actually, give the initiator a URL to post to w/ token?
            // - servlet continues where the POSTed file left off
            
            HttpSession httpSession = (HttpSession)initiatorSession;
            HttpConnection httpConnection = (HttpConnection)httpSession.getConnection();
            
            
            // does getServerName include port? is it the actual HTTP host name?
            String transferPostUrl = "http://"+httpSession.getServerName()+"/fileupload.jsp";

            IQ httpInfoIQ = new IQ(IQ.Type.set);
            httpInfoIQ.setTo(initiator);
            // FIXME this seems like gross misuse of error... make a custom packet extension.
            httpInfoIQ.setError(new PacketError(PacketError.Condition.redirect, PacketError.Type.modify, transferPostUrl) );
            
            throw new FileTransferRejectedException("HTTP client resuming via upload servlet");
            
            

            
            
        // file stream initiated from anywhere destined for an HTTP stream
        } else if( isReady 
                && server.isLocal(receiver) 
                && receiverSession != null 
                && receiverSession instanceof HttpSession ) {
            
            // TODO can we just make a data: iframe on the client side?
        }
    }

    
    
}
