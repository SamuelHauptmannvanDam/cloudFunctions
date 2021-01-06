'use-strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/Notifications/{user_id}/{notification_id}').onWrite((change, context) => {

  const user_id = context.params.user_id;
  const notification_id = context.params.notification_id;

  //Get name
  const fromUser = admin.database().ref(`/Notifications/${user_id}/${notification_id}`).once('value');
    return fromUser.then(fromUserResult => {
                var from_user_id = fromUserResult.val().from;
                
                if(from_user_id === null){
                     from_user_id = "BeBetter"
                }

                console.log('You have a new notification from :' + from_user_id);
            
    const userQuery = admin.database().ref(`/Users/${from_user_id}/name`).once('value');
    
            return userQuery.then(userResult => {

                const userName = userResult.val();
                const afterData = change.after.val();

            //New Type of Notification.
            if (afterData.type === "friend request") {
                const userToken = admin.database().ref('Users/' + user_id + '/user_token').once('value');
                return userToken.then(result => {

                    const token_id = result.val();

                    const payload = {
                        notification: {
                            title: "Friend Request",
                            body: `${userName} sent you a Friend Request! <3`,
                            icon: "default",
			                click_action : "BeBetter_TARGET_NOTIFICATION"
                        },
			data : {
			from_user_id : from_user_id 
			}
                    };

                    return admin.messaging().sendToDevice(token_id,payload).then(response => {
                        return console.log('This was the notification feature for friend request');
                        });

                });

            //New Type of Notification.
            } else if(afterData.type === "friend request accepted") {
            const userToken = admin.database().ref('/Users/' + user_id + '/user_token').once('value');
            return userToken.then(result => {

                const token_id = result.val();
                
                const payload = {
                    notification: {
                        title: "Friend Request Accepted",
                        body: `You've got a new friend! ${userName} <3`,
                        icon: "default",
			            click_action : "BeBetter_TARGET_NOTIFICATION"
                    },
                };

                return admin.messaging().sendToDevice(token_id,payload).then(response => {
                return console.log('This was the notification feature for friend request accept');
                });

            });

        //New Type of Notification.
        } else if(afterData.type === "experience invite") {
            const userToken = admin.database().ref('/Users/' + user_id + '/user_token').once('value');
            return userToken.then(result => {

                const token_id = result.val();
                
                const payload = {
                    notification: {
                        title: "Experience Invite!",
                        body: `${userName} invited you to an experience!`,
                        icon: "default",
			            click_action : "BeBetter_TARGET_NOTIFICATION"
                    },
                };

                return admin.messaging().sendToDevice(token_id,payload).then(response => {
                return console.log('This was the notification feature for experience invite');
                });

            });


        }else if(afterData.type === "experience completed") {
            const userToken = admin.database().ref('/Users/' + user_id + '/user_token').once('value');
            return userToken.then(result => {

                const token_id = result.val();
                
                const payload = {
                    notification: {
                        title: "Experience Completed!",
                        body: `${userName} joined! <3`,
                        icon: "default",
			            click_action : "BeBetter_TARGET_NOTIFICATION"
                    },
                };

                return admin.messaging().sendToDevice(token_id,payload).then(response => {
                return console.log('This was the notification feature for experience completed');
                });

            });
        } else {
            console.log('Not a friend request');
            return null;
        }
            
        });

    });


});


const CUT_OFF_TIME = 1000 * 60 * 60 * 24 * 30;

exports.deleteOldNotifications = functions.database.ref('/Notifications/{user_id}/{notification_id}').onWrite(async (change) => {

  const ref = change.after.ref.parent; // reference to the parent
  const now = Date.now();
  const cutoff = now - CUT_OFF_TIME;
  const oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff);
  const snapshot = await oldItemsQuery.once('value');
  // create a map with all children that need to be removed
  const updates = {};
  snapshot.forEach(child => {
    updates[child.key] = null;
  });
  // execute all updates in one go and return the result to end the function
  return ref.update(updates);
});

exports.deleteOldFeedExperiences = functions.database.ref('/Feeds/{user_id}/{notification_id}').onWrite(async (change) => {

  const ref = change.after.ref.parent; // reference to the parent
  const now = Date.now();
  const cutoff = now - CUT_OFF_TIME;
  const oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff);
  const snapshot = await oldItemsQuery.once('value');
  // create a map with all children that need to be removed
  const updates = {};
  snapshot.forEach(child => {
    updates[child.key] = null;
  });
  // execute all updates in one go and return the result to end the function
  return ref.update(updates);
});


  
exports.deleteOldExperiences = functions.database.ref('/Experiences/{notification_id}').onWrite(async (change) => {

  const ref = change.after.ref.parent; // reference to the parent
  const now = Date.now();
  const cutoff = now - CUT_OFF_TIME;
  const oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff);
  const snapshot = await oldItemsQuery.once('value');
  // create a map with all children that need to be removed
  const updates = {};
  snapshot.forEach(child => {
    updates[child.key] = null;
  });
  // execute all updates in one go and return the result to end the function
  return ref.update(updates);
});