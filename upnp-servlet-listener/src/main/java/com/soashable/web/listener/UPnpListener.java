/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.soashable.web.listener;

import java.io.IOException;
import java.net.InetAddress;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import net.sbbi.upnp.impls.InternetGatewayDevice;
import net.sbbi.upnp.messages.UPNPResponseException;

/**
 *
 * @author Harlan
 */
public class UPnpListener implements ServletContextListener {

    static int discoveryTimeout = 5000; // 5 secs to receive a response from devices

    public void contextInitialized(ServletContextEvent event) {
        boolean upnpEnabled = Boolean.parseBoolean( event.getServletContext().getInitParameter("upnp.enabled") );

        if( upnpEnabled ) {
            int port = Integer.parseInt( event.getServletContext().getInitParameter("upnp.port") );
            openPort(port);
        }
    }

    public void contextDestroyed(ServletContextEvent event) {
        boolean upnpEnabled = Boolean.parseBoolean( event.getServletContext().getInitParameter("upnp.enabled") );

        if( upnpEnabled ) {
            int port = Integer.parseInt( event.getServletContext().getInitParameter("upnp.port") );
            closePort(port);
        }
    }

    public static boolean openPort(int port) {
        
        
        try {
            InternetGatewayDevice[] IGDs = InternetGatewayDevice.getDevices(discoveryTimeout);
            if (IGDs != null) {
                // let's the the first device found
                InternetGatewayDevice testIGD = IGDs[0];
                System.out.println("Found device " + testIGD.getIGDRootDevice().getModelName());
                // now let's open the port
                String localHostIP = InetAddress.getLocalHost().getHostAddress();
                // we assume that localHostIP is something else than 127.0.0.1
                boolean mapped = testIGD.addPortMapping("Some mapping description",
                        null, port, port,
                        localHostIP, 0, "TCP");
                if (mapped) {
                    System.out.println("Port " + port + " mapped to " + localHostIP);
                }

                return mapped;
            }


        } catch (IOException ex) {
        // some IO Exception occured during communication with device
        } catch (UPNPResponseException respEx) {
        // oups the IGD did not like something !!
        }

        return false;
    }

    public static boolean closePort(int port) {
        try {
            InternetGatewayDevice[] IGDs = InternetGatewayDevice.getDevices(discoveryTimeout);
            if (IGDs != null) {
                // let's the the first device found
                InternetGatewayDevice testIGD = IGDs[0];
                System.out.println("Found device " + testIGD.getIGDRootDevice().getModelName());
                // now let's open the port
                String localHostIP = InetAddress.getLocalHost().getHostAddress();
                // we assume that localHostIP is something else than 127.0.0.1
                boolean unmapped = testIGD.deletePortMapping(null, port, "TCP");
                if (unmapped) {
                    System.out.println("Port " + port + " unmapped");
                }

                return unmapped;

            }


        } catch (IOException ex) {
        // some IO Exception occured during communication with device
        } catch (UPNPResponseException respEx) {
        // oups the IGD did not like something !!
        }
        return false;
    }
}
