const guideList = document.querySelector('.guides')
const loggedOutLinks = document.querySelectorAll('.logged-out')
const loggedInLinks = document.querySelectorAll('.logged-in')
const accountDetails = document.querySelector('.account-details')
const adminItems = document.querySelectorAll('.admin')

// Setup Navbar
const setupUi = user => {
    if (user) {
        if(user.admin) {
            adminItems.forEach(item => item.style.display = 'block')
        }
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                let html = `
                    <div>Logged in as ${ user.email}</div>
                    <div>Bio: ${ doc.data().bio}</div>
                    <div class='pink-text'>${ user.admin ? 'Admin' : '' }</div>
                `
                accountDetails.innerHTML = html
            })
        loggedInLinks.forEach(item => item.style.display = 'block')
        loggedOutLinks.forEach(item => item.style.display = 'none')
    } else {
        adminItems.forEach(item => item.style.display = 'none')
        accountDetails.innerHTML = ''
        loggedInLinks.forEach(item => item.style.display = 'none')
        loggedOutLinks.forEach(item => item.style.display = 'block')
    }
}

// Setup Guides
const setupGuides = data => {
    if (!data.length) {
        guideList.innerHTML = "<h5 class='center-align'>Login in to view guides!</h5>"
        return
    }
    let html = ''
    data.forEach(doc => {
        const guide = doc.data()
        const li = `
        <li>
            <div class='collapsible-header grey lighten-4'>${ guide.title}</div>
            <div class='collapsible-body white'>${ guide.content}</div>
        </li>
        `
        html += li
    });
    guideList.innerHTML = html
}

document.addEventListener('DOMContentLoaded', function () {
    const modals = document.querySelectorAll('.modal')
    M.Modal.init(modals)

    const items = document.querySelectorAll('.collapsible')
    M.Collapsible.init(items)
})
