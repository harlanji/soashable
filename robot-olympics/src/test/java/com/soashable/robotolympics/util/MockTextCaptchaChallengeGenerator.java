package com.soashable.robotolympics.util;

import com.soashable.robotolympics.challenge.*;
import java.net.MalformedURLException;
import org.dom4j.Document;
import org.dom4j.DocumentException;

public class MockTextCaptchaChallengeGenerator extends TextCaptchaChallengeGenerator {

    Document responseDoc;

    public MockTextCaptchaChallengeGenerator() {
        super("");
    }

    @Override
    public Document getResponseDoc() throws DocumentException, MalformedURLException {
        return this.responseDoc;
    }

    public void setResponseDoc(Document responseDoc) {
        this.responseDoc = responseDoc;
    }
}
