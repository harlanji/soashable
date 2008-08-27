<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>

<%@ page import="org.jivesoftware.openfire.XMPPServer" %>
<%@ page import="org.jivesoftware.util.ParamUtils" %>
<%@ page import="com.soashable.robotolympics.RobotOlympicsPlugin" %>
<%@ page import="org.jivesoftware.util.Log" %>


<% // Get parameters

    XMPPServer server = XMPPServer.getInstance();
    RobotOlympicsPlugin plugin = (RobotOlympicsPlugin)server.getPluginManager().getPlugin("robot-olympics");

    boolean update = request.getParameter("update") != null;
    boolean updateSuccess = false;

    String textCaptchaApiKey = request.getParameter("textCaptchaApiKey");
    int numAnonBeforeSpim = ParamUtils.getIntParameter(request, "numAnonBeforeSpim", 3);

    // Perform update if requested
    if (update) {
        plugin.setTextCaptchaApiKey( textCaptchaApiKey.trim() );
        plugin.setNumAnonBeforeSpim( numAnonBeforeSpim );
        plugin.applyProperties();
        plugin.writeProperties();
        updateSuccess = true;
    }
    
    // Populate form
    textCaptchaApiKey = plugin.getTextCaptchaApiKey();
    numAnonBeforeSpim = plugin.getNumAnonBeforeSpim();
%>

<html>
<head>
    <title>
        Robot Olympics Settings
    </title>
    <meta name="pageID" content="robotolympics-settings"/>
</head>
<body>

<p>
    <!-- fmt:message key="archive.settings.intro"/ -->
</p>

<% if (updateSuccess) { %>

<div id="updateSuccessMessage" class="success">
   Update success
</div>

<% } %>

<form action="robotolympics-settings.jsp" method="post">
    <div class="jive-contentBoxHeader">
        Robot Olympics Settings
    </div>
    <div class="jive-contentBox">
        <table cellpadding="3" cellspacing="0" border="0">
            <tbody>
                <tr>
                    <td width="1%" valign="top" nowrap>
                        <input type="text" name="textCaptchaApiKey" value="<%= (textCaptchaApiKey != null ? textCaptchaApiKey : "") %>" id="rb01"/>
                    </td>
                    <td width="99%">
                        <label for="rb01">
                            Text Captcha API Key
                        </label>
                    </td>
                </tr>
                <tr>
                    <td width="1%" valign="top" nowrap>
                        <input type="text" name="numAnonBeforeSpim" value="<%= numAnonBeforeSpim %>" id="rb02"/>
                    </td>
                    <td width="99%">
                        <label for="rb02">
                            Number of Anonymous Connections Before SPIM Control
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <input type="submit" name="update" value="Save Settings"/>
</form>


</body>
</html>
