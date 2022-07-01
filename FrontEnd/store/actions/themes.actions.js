export const CHANGE_THEME = 'CHANGE_THEME';


/**
 * Change current theme path
 */
export function changeTheme(name) {
    return { type: CHANGE_THEME, name };
}
