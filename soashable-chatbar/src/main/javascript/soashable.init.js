$(document).ready(function(){
    app = new Application();
});
            
function addTab() {
    app.startChat( "test"+parseInt(Math.random() * 100)+"@test.com");
}

window.addEventListener( "load", function() { app.onPageLoad(); }, false );
window.addEventListener( "beforeunload", function() { app.onPageUnload(); }, false );