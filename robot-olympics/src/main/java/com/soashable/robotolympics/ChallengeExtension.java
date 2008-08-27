package com.soashable.robotolympics;

import org.dom4j.Element;
import org.dom4j.QName;
import org.xmpp.forms.DataForm;
import org.xmpp.forms.FormField;
import org.xmpp.packet.Message;
import org.xmpp.packet.PacketExtension;

public class ChallengeExtension extends PacketExtension {

    public static final String ELEMENT_NAME = "challenge";
    public static final String NAMESPACE = "urn:xmpp:tmp:challenge";
    
    private transient DataForm challengeForm;
    
    static {
        registeredExtensions.put(QName.get(ELEMENT_NAME, NAMESPACE), ChallengeExtension.class);
    }

    public ChallengeExtension() {
        this( new DataForm(DataForm.Type.form) );
    }
    
    public ChallengeExtension(DataForm challengeForm) {
        super(ELEMENT_NAME, NAMESPACE);

        setChallengeForm(challengeForm);
    }
    
    public ChallengeExtension(Element element) {
        super(element);
        // challengeForm will be lazilly loaded when the getter is called
    }
    
    public DataForm getChallengeForm() {
        if( challengeForm == null ) {
            Element dataFormElem = element.element( QName.get(DataForm.ELEMENT_NAME, DataForm.NAMESPACE) );
            if( dataFormElem != null ) {
                challengeForm = new DataForm(dataFormElem);
            }  // TODO how to create new element of none exists? not here.
        }
        
        return challengeForm;
    }
    
    public void setChallengeForm(DataForm challengeForm) {
        this.challengeForm = challengeForm;
        Element currentFormElem = element.element(QName.get(DataForm.ELEMENT_NAME, DataForm.NAMESPACE) );
        
        // we may only have 1
        if( currentFormElem != null ) {
            element.remove(currentFormElem);
        }
        
        element.add(challengeForm.getElement());
        
        addFormType();
    }
    
    public String getFrom() {
        return getChallengeForm().getField("from").getValues().get(0);
    }
    
    public void setFrom(String from) {
        DataForm challengeForm = getChallengeForm();
        
        FormField field = challengeForm.getField("from");
        if( field == null ) {
            field = challengeForm.addField();
            field.setVariable("from");
            field.setType(FormField.Type.hidden);
            
            field.clearValues();
        }
        field.addValue(from);
    }
    
    public String getChallengeId() {
        return getChallengeForm().getField("cid").getValues().get(0);
    }
    
    public void setChallengeId(String challengeId) {
        DataForm challengeForm = getChallengeForm();
        
        FormField field = challengeForm.getField("cid");
        if( field == null ) {
            field = challengeForm.addField();
            field.setVariable("cid");
            field.setType(FormField.Type.hidden);
            
            field.clearValues();
        }
        field.addValue(challengeId);
    }
    
    public String getPacketId() {
        return getChallengeForm().getField("sid").getValues().get(0);
    }
    
    public void setPacketId(String packetId) {
        DataForm challengeForm = getChallengeForm();
        
        FormField field = challengeForm.getField("sid");
        if( field == null ) {
            field = challengeForm.addField();
            field.setVariable("sid");
            field.setType(FormField.Type.hidden);
            
            field.clearValues();
        }
        field.addValue(packetId);
    }
    
    public void setQAChallenge(String question) {
        DataForm challengeForm = getChallengeForm();
        
        FormField field = challengeForm.getField("qa");
        if( field == null ) {
            field = challengeForm.addField();
            field.setVariable("qa");
            field.setType(FormField.Type.text_single);
        }
        field.setLabel(question);
    }
    
    public String getQAChallenge() {
        return getChallengeForm().getField("qa").getLabel();
    }
    
    public void setQAResponse(String response) {
        FormField field = challengeForm.getField("qa");
        field.clearValues();
        field.addValue(response);
    }
    
    public String getQAResponse() {
        return challengeForm.getField("qa").getValues().get(0);
    }
    
    public void removeQAChallenge() {
        getChallengeForm().removeField("qa");
    }
    
    public void addFormType() {
        DataForm challengeForm = getChallengeForm();
        
        challengeForm.removeField("FORM_TYPE");
        
        FormField field = challengeForm.addField();
        field.setVariable("FORM_TYPE");
        field.setType(FormField.Type.hidden);
        field.addValue("urn:xmpp:tmp:challenge");
    }
    
    
    public void addLegacyChallenge(Message challengeMessage) {
        DataForm challengeForm = getChallengeForm();
        
        if( challengeForm == null ) {
            return; //TODO should this throw exception?
        }
        
        String question = getQAChallenge();
        String challengeId = getChallengeId();
        
        challengeMessage.setBody("Anti-Spim Device: Your messages to " + challengeMessage.getTo() + " are being blocked until you have proved that you are not a robot. To unblock, reply with the answer to '"+question+"' followed by '"+challengeId+"'");
    }
}


















