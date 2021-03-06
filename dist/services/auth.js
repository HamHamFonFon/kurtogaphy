import uuid from 'node-uuid';
import kuzzle from './kuzzle'
import notification from './notification';
import user from '../src/user';

export default {

    state: {
        msgLogin: null
    },

    /**
     *
     * @param loginUser
     * @param pwdUser
     */
    login(loginUser, pwdUser)
    {

        if(
            (undefined != loginUser && 0 < loginUser.length)
            &&
            (undefined != pwdUser && 0 < pwdUser.length)
        )  {

            kuzzle.login('local', {username: loginUser, password: pwdUser}, '1h', (err, resp) => {
                if (err) {
                    notification.init({
                        type: 'error',
                        message: 'Error on authentification'
                    });
                } else {
                    // Set session in session storage
                    document.getElementById("divAuth").classList.toggle("hidden");
                    window.sessionStorage.setItem('jwt', resp.jwt);

                    user.getCurrentUser(() => {
                    });

                    notification.init({
                        type: 'notice',
                        message: 'Welcome back ' + loginUser
                    });
                }
            });

        } else {
            notification.init({
               type: 'error',
               message: 'Please, enter a login and a password available'
            });
        }
    },

    /**
     * Deconnexion
     */
    logout()
    {
        kuzzle.logout();
        user.removeCurrentUser();
        window.sessionStorage.removeItem('jwt');
        document.querySelector('a[data-link="auth"]').parentNode.removeAttribute("disabled");
        document.querySelector('a[data-link="logout"]').parentNode.setAttribute("disabled", "disabled");
        notification.init({
            type : 'notice',
            message: 'See you later.'
        });
    },

    /**
     * Create a new user in kuzzle
     * @param tabNewUser
     */
    registerNewUser(tabNewUser)
    {
        if (undefined != tabNewUser && 0 < Object.keys(tabNewUser).length) {
            var userContent = {
                "profile": "user",
                "password": tabNewUser.password,
                "pictureId": "",
                "email": tabNewUser.email,
            };

            var options = {
                replaceIfExist: true
            };

            kuzzle.security.createUser(tabNewUser.username, userContent, options, function(error, response) {
                // result is a KuzzleUser object
                if (!error) {
                    notification.init({
                        type : 'notice',
                        message: 'Welcome and thank you for registration ' + tabNewUser.username + ' :).'
                    });
                    document.getElementById("divRegister").classList.toggle("hidden");
                } else {
                    notification.init({
                        type : 'error',
                        message: 'Error registration, please retry.'
                    });
                }
            });
        }

    }
}