/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.soashable.httpfilexfer;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.jivesoftware.openfire.XMPPServer;
import org.jivesoftware.openfire.filetransfer.FileTransferManager;

/**
 *
 * @author Harlan
 */
public class HttpFileXferServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        

        // TODO config params
        String domain = "soashable.com";
        String resource = "Soashable";
        
        response.setContentType("text/html;charset=UTF-8");
        
        PrintWriter out = response.getWriter();

        out.println("File Upload...");


        try {
            boolean isMultipart = ServletFileUpload.isMultipartContent(request);

            if (!isMultipart) {
                throw new ServletException("No file attached.");
            }
            String repoDir = System.getProperty("java.io.tmpdir");




            // Create a factory for disk-based file items
            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setRepository(new File(repoDir));

// Create a new file upload handler
            ServletFileUpload upload = new ServletFileUpload(factory);

// Parse the request
            List<FileItem> items = null;

            try {
                items = upload.parseRequest(request);
            } catch (Exception e) {
                throw new ServletException("Error parsing request.", e);
            }


            String token = null;


            // get necessary posted fields
            for (FileItem item : items) {
                if (item.isFormField()) {
                    if ("token".equals(item.getFieldName())) {
                        token = item.getString();
                    } 
                }
            }

            // validate
            if ( token == null ) {
                throw new ServletException("Missing some data, yo");
            }
            
            
            XMPPServer server = XMPPServer.getInstance();
            FileTransferManager ftm = server.getFileTransferManager();


            // process files
            for (FileItem item : (List<FileItem>) items) {
                if (!item.isFormField()) {
                    //handleUpload(item);

                    // the item is a file if it isn't a form field
                    String originalFileName = item.getName();
                    String contentType = item.getContentType();
                    long size = item.getSize();

                    File uploadedFile = null;
                    try {
                        uploadedFile = new File(repoDir + "/" + originalFileName);

                        item.write(uploadedFile);
                    } catch (Exception e) {
                        throw new ServletException("Error writing uploaded file", e);
                    }

                    // TODO upload here
                }
            }

        } catch (ServletException e) {
            out.println("oops");
            e.printStackTrace(out);
            throw e;
        } finally {
            out.close();
        }
    }

}
