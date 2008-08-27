/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.robotolympics.util;

import java.util.Date;
import org.jivesoftware.openfire.StreamID;
import org.jivesoftware.openfire.session.Session;
import org.xmpp.packet.JID;
import org.xmpp.packet.Packet;

/**
 *
 * @author Harlan
 */
public class MockSession implements Session {
    
    private JID address;
    private int status;
    private StreamID streamID;
    private String serverName;
    private Date creationDate;
    private Date lastActiveDate;
    private long numClientPackets;
    private long numServerPackets;
    private boolean closed;
    private boolean secure;
    private String hostAddress;
    private String hostName;
    


    public void close() {
        closed = true;
    }

    public void process(Packet arg0) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void deliverRawText(String arg0) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public boolean validate() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public JID getAddress() {
        return address;
    }

    public void setAddress(JID address) {
        this.address = address;
    }

    public boolean isClosed() {
        return closed;
    }

    public void setClosed(boolean closed) {
        this.closed = closed;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public String getHostAddress() {
        return hostAddress;
    }

    public void setHostAddress(String hostAddress) {
        this.hostAddress = hostAddress;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public Date getLastActiveDate() {
        return lastActiveDate;
    }

    public void setLastActiveDate(Date lastActiveDate) {
        this.lastActiveDate = lastActiveDate;
    }

    public long getNumClientPackets() {
        return numClientPackets;
    }

    public void setNumClientPackets(long numClientPackets) {
        this.numClientPackets = numClientPackets;
    }

    public long getNumServerPackets() {
        return numServerPackets;
    }

    public void setNumServerPackets(long numServerPackets) {
        this.numServerPackets = numServerPackets;
    }

    public boolean isSecure() {
        return secure;
    }

    public void setSecure(boolean secure) {
        this.secure = secure;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public StreamID getStreamID() {
        return streamID;
    }

    public void setStreamID(StreamID streamID) {
        this.streamID = streamID;
    }
    
    
}
