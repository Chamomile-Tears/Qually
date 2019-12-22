chrome.cookies.get({ url: 'https://ca.howrse.com', name: 'hasLoggedIn' }, function (cookie){
            alert(cookie.value);
        });
