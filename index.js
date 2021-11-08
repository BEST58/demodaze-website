if(getCookie("darkMode") == "true") {
    document.documentElement.style.setProperty('--main-bg-color', '#2d2d2d')
    document.documentElement.style.setProperty('--darker-bg-color', '#252525')
    document.documentElement.style.setProperty('--slightly-darker-bg-color', '#292828')

    document.documentElement.style.setProperty('--main-text-color', '#f5f5f5')
    document.documentElement.style.setProperty('--lighter-text-color', '#D3D3D3')

    document.addEventListener("DOMContentLoaded", function(){
        document.querySelector('#changeTheme').checked = true;
    });
}

document.addEventListener("DOMContentLoaded", function(){

    document.querySelector("#changeTheme").addEventListener("change", () => {
    
        var declaration = getComputedStyle(document.documentElement);
    
        if(declaration.getPropertyValue('--main-bg-color').replace(/\s/g, '') == "#2d2d2d") {
    
            createCookie("darkMode", "false", 365)
            document.documentElement.style.setProperty('--main-bg-color', '#e0e0e0')
            document.documentElement.style.setProperty('--darker-bg-color', '#D3D3D3')
            document.documentElement.style.setProperty('--slightly-darker-bg-color', '#dddcdc')
    
            document.documentElement.style.setProperty('--main-text-color', '#141414')
            document.documentElement.style.setProperty('--lighter-text-color', '#202020')
    
        } else {
    
            createCookie("darkMode", "true", 365)
            document.documentElement.style.setProperty('--main-bg-color', '#2d2d2d')
            document.documentElement.style.setProperty('--darker-bg-color', '#252525')
            document.documentElement.style.setProperty('--slightly-darker-bg-color', '#292828')
    
            document.documentElement.style.setProperty('--main-text-color', '#f5f5f5')
            document.documentElement.style.setProperty('--lighter-text-color', '#D3D3D3')
    
        }
    })

    setTimeout(() => {

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (mediaQuery && !mediaQuery.matches) {
            document.styleSheets[0].insertRule(`* { transition-duration: 0.25s; transition: color 0.25s linear, border 0.25s linear, background-color 0.25s linear; }`, 0);
        }

    }, 500);

    const faders = document.querySelectorAll(".fade-in");

    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -250px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(
        entries,
        appearOnScroll
    ) {
        entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add("appear");
            appearOnScroll.unobserve(entry.target);
        }
        });
    },
    appearOptions);
    
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

})

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(cookie_name) {
    if (document.cookie.length > 0) {
        var cookie_start = document.cookie.indexOf(cookie_name + "=");
        if (cookie_start != -1) {
            cookie_start = cookie_start + cookie_name.length + 1;
            cookie_end = document.cookie.indexOf(";", cookie_start);
            if (cookie_end == -1) {
                cookie_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(cookie_start, cookie_end));
        }
    }
    return "";
}