const functions = require('firebase-functions');

const express = require('express');
const app = express();

const FBAuth = require('./util/fbAuth');

const { db } = require(`./util/admin`);

const { getAllScreams, 
    postOneScream, 
    getScream, 
    commentOnScream,
    likeScream, 
    unlikeScream,
    deleteScream
} = require('./handlers/screams');

const { 
    signup, 
    login, 
    uploadImage, 
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users');

//screams routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth,postOneScream);
app.get('/scream/:screamId', getScream);
//Delete a scream
app.delete('/scream/:screamId', FBAuth, deleteScream);
//like a scream
app.get(`/scream/:screamId/like`, FBAuth, likeScream);
//unlike a scream
app.get(`/scream/:screamId/unlike`, FBAuth, unlikeScream);
//comment on scream
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/users/image',FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get(`/user/:handle`, getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);


 exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document(`likes/{id}`)
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .catch(err => 
                console.error(err));
    });

exports.deleteNotificationOnLike = functions.firestore.document(`likes/{id}`)
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => 
                console.error(err));
            
    });

exports.createNotificationOnComment = functions.firestore.document(`comments/{id}`)
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .catch(err => 
                console.error(err));
    });

exports.onUserImageChange = functions.firestore.document(`/users/{userId}`)
    .onUpdate((change) => {
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            const batch = db.batch();
            return db.collection('screams')
                .where('userHandle', '==', change.before.date().handle).get()
                .then((data) => {
                    data.forEach(doc => {
                        const scream = db.doc(`/screams/${doc.id}`);
                        batch.update(scream, { userImage: change.after.data().imageUrl});
                    });
                    return batch.commit();
                });
        } else return true;
    });

exports.onScreamDelete = functions.firestore.document(`/screams/{screamId}`)
    .onDelete((snapshot, context) => {
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db.collection('comments').where('screamId', '==', screamId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('screamId', '==', screamId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('screamId', '==', screamId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => console.error(err));
    });