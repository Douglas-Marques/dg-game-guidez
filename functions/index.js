const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

exports.addAdminRole = functions.https.onCall((data, context) => {
    if(context.auth.token.admin !== true) return { error: 'Only admins can add other admins!' }
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        })
    }).then(_ => {
        return {
            message: `Success! ${data.email} has been made an admin.`
        }
    }).catch(err => {
        return err
    })
})
