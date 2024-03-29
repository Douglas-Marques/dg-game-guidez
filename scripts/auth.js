// Add Admin Cloud Function
const adminForm = document.querySelector('.admin-actions')
adminForm.addEventListener('submit', e => {
    e.preventDefault()
    const adminEmail = document.querySelector('#admin-email').value
    const addAdminRole = functions.httpsCallable('addAdminRole')
    addAdminRole({ email: adminEmail })
})

// Listen for Auth status change
auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult()
            .then(idTokenResult => {
                user.admin = idTokenResult.claims.admin
                setupUi(user)
            })
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs)            
        })
    } else {
        setupUi()
        setupGuides([])
    }
})

// Create new guide
const createForm = document.querySelector('#create-form')
createForm.addEventListener('submit', e => {
    e.preventDefault()
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(_ => {
        const modal = document.querySelector('#modal-create')
        M.Modal.getInstance(modal).close()
        createForm.reset()
    })
})

// Sign Up
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value
    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
                bio: signupForm['signup-bio'].value
            })
        }).then(_ => {
            const modal = document.querySelector('#modal-signup')
            M.Modal.getInstance(modal).close()
            signupForm.reset()
            signupForm.querySelector('.error').innerHTML = ''
        }).catch(err => {
            signupForm.querySelector('.error').innerHTML = err.message
        })
})

// Sign Out the User
const logout = document.querySelector('#logout')
logout.addEventListener('click', e => {
    e.preventDefault()
    auth.signOut()
})

// Login the User
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = loginForm['login-email'].value
    const password = loginForm['login-password'].value

    // Sign In the User
    auth.signInWithEmailAndPassword(email, password)
        .then(_ => {
            const modal = document.querySelector('#modal-login')
            M.Modal.getInstance(modal).close()
            loginForm.reset()
            loginForm.querySelector('.error').innerHTML = ''
        }).catch(err => {
            loginForm.querySelector('.error').innerHTML = err.message
        })
})
