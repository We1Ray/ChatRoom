/**
 * A simple implementation to save the actual Redux state into
 * a browser cookie so it is sent to the server when the site is loaded.
 * The server will read that cookie information an use it as the
 * initial state, this way we can render the layout on the server and
 * send the classes and themes already applied directly to the client.
 */

const REDUX_STORAGE_KEY = 'angle-next-redux-key';

const saveCookie = (cname, cvalue, exdays) => {
    let d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

const readCookie = (cookies, name) => {
    const cstr = RegExp('' + name + '[^;]+').exec(cookies);
    return decodeURIComponent(!!cstr ? cstr.toString().replace(/^[^=]+./, '') : '');
};

/* Server: Read the saved state from cookies sent from browser */
export const readState = cookie => {
    let state;
    try {
        state = JSON.parse(readCookie(cookie, REDUX_STORAGE_KEY));
    } catch {
        state = {};
    }
    return state;
};

/* Client: Export a method to save state on each store update */
export const saveState = state => {
    try {
        let stateFilter = JSON.parse(JSON.stringify(state)); // deep clone
        ['offsidebarOpen', 'asideToggled', 'horizontal'] // states which we don't want to persist.
            .forEach(item => delete stateFilter.settings[item]);
        const rawState = JSON.stringify(stateFilter);
        saveCookie(REDUX_STORAGE_KEY, rawState, 100);
    } catch (err) {
        console.log(err);
        // Ignore write errors.
    }
};
