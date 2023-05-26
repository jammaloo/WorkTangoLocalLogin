// ==UserScript==
// @name         WorkTango Local Login
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Add quick links to set or remove the kwref on login
// @author       You
// @namespace    https://github.com/jammaloo
// @updateURL    https://raw.githubusercontent.com/jammaloo/WorkTangoLocalLogin/main/WorkTangoLocalLogin.user.js
// @downloadURL  https://raw.githubusercontent.com/jammaloo/WorkTangoLocalLogin/main/WorkTangoLocalLogin.user.js
// @match        https://*.rr.develop.non-prod.kazoohr.io/users/sign_in*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worktango.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const local_kwref = 'http://localhost:8888/';

    const loginContainer = document.querySelector('.login-form');
    if (!loginContainer) {
        console.warn('Local Login Tamperscript could not find login form');
    }
    const pageUrl = new URL(document.location.href);
	const kwref = pageUrl.searchParams.get('kwref');

    const noKwref = new URL(pageUrl);
    noKwref.searchParams.set('kwref', '');
    const localKwref = new URL(pageUrl);
    localKwref.searchParams.set('kwref', local_kwref);


    const url_id = 'tampermonkey_site_url';
    const remove_id = 'tampermonkey_remove_id';
    const set_local_id = 'tampermonkey_set_local_id';
    const htmlTemplate = `
    <div>
    	<h2 style="display: ${kwref ? 'block' : 'none'}">Logging in to <span id="${url_id}"></span></h2>

        <h2 style="display: ${kwref ? 'none' : 'block'}">No kwref set</span></h2>

        <a style="display: ${kwref ? 'block' : 'none'}" href="#" id="${remove_id}">Remove kwref</a>

        <a style="display: ${kwref !== local_kwref ? 'block' : 'none'}" href="#" id="${set_local_id}">Set kwref to ${local_kwref}</a>
    </div>`;
	const domOutput = new DOMParser().parseFromString(htmlTemplate, "text/html");
    domOutput.getElementById(url_id).textContent = kwref;
    domOutput.getElementById(remove_id).setAttribute('href', noKwref);
    domOutput.getElementById(set_local_id).setAttribute('href', localKwref);
    loginContainer.prepend(domOutput.body.firstChild);
})();
