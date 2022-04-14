// Constants
// var isLoggedIn = false;
// $("#sendMsgBtn").prop("disabled", true);

// // Auto Init MaterializeCSS
// M.AutoInit();

// Form Click Event
$("#join-channel").click(function () {
    var accountName = $('#form-uid').val();
    var agoraAppId = $('#form-appid').val();

    console.log(accountName, agoraAppId);

    // RtmClient
    const client = AgoraRTM.createInstance(agoraAppId, {
        enableLogUpload: false
    });

    // Login
    client.login({
        uid: accountName
    }).then(() => {
        console.log('AgoraRTM client login success. Username: ' + accountName);
        isLoggedIn = true;

        // Channel Join
        var channelName = $('#form-channel').val();
        channel = client.createChannel(channelName);
        // document.getElementById("channelNameBox").innerHTML = channelName;
        channel.join().then(() => {
            console.log('AgoraRTM client channel join success.');
            $("#join-channel").prop("disabled", true);
            $("#sendMsgBtn").prop("disabled", false);

            // Close Channel Join Modal
            // $("#modalForm").modal('close');

            // Send Channel Message
            $("#sendMsgBtn").click(function () {
                singleMessage = $('#channelMsg').val();
                channel.sendMessage({
                    text: singleMessage
                }).then(() => {
                    console.log("Message sent successfully.");
                    console.log("Your message was: " + singleMessage + " by " + accountName);
                    // $("#messageBox").append("<br> <b>Sender:</b> " + accountName + "<br> <b>Message: </b> <span style='white-space: pre-wrap;'>" + singleMessage + "</span><br>");
                    // $('#channelMsg').val('');
                    $("#messageBox").append(`
                    <div class="outgoing">
                        <div class="bubble lower">
                            <h6 style="color: white;">${accountName}</h6>
                            <p>${singleMessage}</p>
                        </div>
                    </div>
                    `);
                    $('#channelMsg').val('');
                }).catch(error => {
                    console.log("Message wasn't sent due to an error: ", error);
                });

                // Receive Channel Message
                channel.on('ChannelMessage', ({
                    text
                }, senderId) => {
                    console.log("Message received successfully.");
                    console.log("The message is: " + text + " by " + senderId);
                    // $("#messageBox").append("<br> <b>Sender:</b> " + senderId + "<br> <b>Message: </b> <span style='white-space: pre-wrap;'>" + text + "</span><br>");
                    $("#messageBox").append(`
                    <div class="incoming">
                        <div class="bubble">
                            <h6 style="color: white;">${senderId}</h6>
                            <p>${text}</p>
                        </div>
                    </div>
                    `);
                });
            });

        }).catch(error => {
            console.log('AgoraRTM client channel join failed: ', error);
        }).catch(err => {
            console.log('AgoraRTM client login failure: ', err);
        });
    });
});

// Show Form on Page Load
// $(document).ready(function () {
//     $('#modalForm').modal();
//     $("#modalForm").modal('open');
// });

// Logout
function leaveChannel() {
    channel.leave();
    client.logout();
    isLoggedIn = false;
    $("#join-channel").prop("disabled", false);
    $("#sendMsgBtn").prop("disabled", true);
    // $("#modalForm").modal('open');
    // console.log("Channel left successfully and user has been logged out.");
}