package com.soashable.web.servlet;

import com.sun.syndication.feed.atom.Entry;
import com.sun.syndication.feed.synd.SyndEntry;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.context.Context;

import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.SyndFeedOutput;
import com.sun.syndication.io.XmlReader;
import java.util.Arrays;
import java.util.List;

/**
 * @TODO Describe the purpose of the class here.
 */
public class SoashableBlogServlet extends HttpServlet {

    /** 
     * {@inheritDoc}
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            URL ATOM_URL = new URL("http://soashable.blogspot.com/feeds/posts/default");
            //URL ATOM_URL = new URL("http://feeds.feedburner.com/HarlansDevelopmentJournal?format=xml");

            SyndFeedInput input = new SyndFeedInput();
            SyndFeedOutput output = new SyndFeedOutput();

            SyndFeed feed = input.build(new XmlReader(ATOM_URL));

            // crop it down to just 1 entry
            List entries = Arrays.asList(new Object[] { feed.getEntries().get(0) });
            feed.setEntries( entries );

            VelocityEngine ve = new VelocityEngine();
            Context context = new VelocityContext();
            context.put("feed", feed);

            InputStream template = getServletContext().getResourceAsStream("/WEB-INF/templates/blog.vm");
            
            response.addHeader("Content-type", "text/html");
            ve.evaluate(context, response.getWriter(), "doGet", new InputStreamReader(template));

        //output.output(feed, response.getWriter());
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}
