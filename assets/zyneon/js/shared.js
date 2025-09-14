const urlParams = new URLSearchParams(window.location.search);
let contextTarget = null;
let storage = false;

let path = location.pathname.replaceAll("/zyneon-website","");
if(path === "" || path === "/") {
    path = "/index.html"
} else if(!path.endsWith(".html")) {
    if(path.endsWith("/")) {
        path = path + "index.html"
    } else {
        path = path + ".html"
    }
}

if(window.location.href.includes("zyneon.de")) {
    window.location.href=window.location.href.replaceAll("zyneon.de","zyneon.net");
}

addEventListener("DOMContentLoaded", (event) => {
    if(localStorage.getItem("enabled")) {
        if(localStorage.getItem("enabled")==="true") {
            storage = true;
        }
    }
    if(!storage) {
        addNotification("cookie-alert","Möchtet du Cookies aktivieren?","Cookies helfen uns dabei, diese Website mit mehr Funktionalität auszustatten und dir ein besseres Webangebot zu bieten. Schaue in der Datenschutzerklärung für weitere Infos.<br><span class='text-bg-purple'>Wenn nicht, schließe diese Nachricht einfach mit dem X</span><br><br><button onclick='localStorage.setItem(\"enabled\",\"true\"); location.reload();' class='button-primary'>Cookies aktivieren</button> <a href='https://www.nerofy.de/rechtliches' target='_blank'><button>Datenschutzerklärung</button></a>")
    }
    initMenu();
});

function initMenu() {
    const menu = document.getElementById("menu");
    if(menu) {
        menu.innerHTML = "<nav class=\"container navbar navbar-expand-lg shadow bg-body-tertiary\"></nav>";
        const navbar = menu.querySelector("nav");
        navbar.innerHTML += "<div class='brand'><img alt='Zyneon icon' src='assets/zyneon/img/logo/512.png'> <span>Z Y N E O N</span></div>";
    }
}

addEventListener("contextmenu", (event) => {
    const contextMenu = document.getElementById("context-menu");
    if(contextMenu) {
        event.preventDefault();
        const target = event.target;
        let offsetWidth = 229;
        let offsetHeight = 184;
        contextMenu.className = "dropdown-menu shadow"
        contextMenu.innerHTML = "<li><a class='dropdown-item' onclick='window.history.back()'><i class=\"bi bi-arrow-left\"></i> Zurück</a></li>";
        contextMenu.innerHTML += "<li><a class='dropdown-item' onclick='window.history.forward()'><i class=\"bi bi-arrow-right\"></i> Vorwärts</a></li>";
        contextMenu.innerHTML += "<li><a class='dropdown-item' onclick='location.reload();'><i class=\"bi bi-arrow-clockwise\"></i> Seite neu laden</a></li>";
        if(target) {
            contextTarget = target;
            if(target.tagName === "IMG") {
                offsetWidth = 272;
                offsetHeight = 352;
                contextMenu.innerHTML += "<li><hr class=\"dropdown-divider\"></li>";
                contextMenu.innerHTML += "<li><a class='dropdown-item' onclick=\"copyImage('"+target.src+"');\"><i class=\"bi bi-copy\"></i> Bild kopieren</a></li>";
                contextMenu.innerHTML += "<li><a class='dropdown-item' href='"+target.src+"' download><i class=\"bi bi-box-arrow-down\"></i> Bild herunterladen</a></li>";
                contextMenu.innerHTML += "<li><a class='dropdown-item' href='"+target.src+"' target='_blank'><i class=\"bi bi-box-arrow-up-right\"></i> Bild in neuem Tab öffnen</a></li>";
                contextMenu.innerHTML += "<li><a class='dropdown-item' onclick=\"navigator.clipboard.writeText('"+target.src+"');\"><i class=\"bi bi-link-45deg\"></i> Bildadresse kopieren</a></li>";
            }
        }
        contextMenu.innerHTML += "<li><hr class=\"dropdown-divider\"></li>";
        contextMenu.innerHTML += "<li><a class='dropdown-item' href='https://github.com/danieldieeins/zyneon-website/blob/main"+path+"' target='_blank'><i class=\"bi bi-github\"></i> Quelltext anzeigen</a></li>";

        let y = event.clientY;
        let x = event.clientX;
        const yEnd = y + offsetHeight;
        const xEnd = x + offsetWidth;

        if(yEnd > window.innerHeight) {
            y -= yEnd - window.innerHeight;
        }

        if(xEnd > window.innerWidth) {
            x -= xEnd - window.innerWidth;
        }

        contextMenu.style.top = y+`px`;
        contextMenu.style.left = x+`px`;

        contextMenu.classList.add("show");
    }

});

addEventListener("resize", () => {
    closeContextMenu();
})

addEventListener("click", () => {
    closeContextMenu();
});

addEventListener("scroll", () => {
    closeContextMenu();
});

function closeContextMenu() {
    const contextMenu = document.getElementById("context-menu");
    if(contextMenu) {
        if (contextMenu.classList.contains("show")) {
            contextMenu.classList.remove("show");
        }
    }
}

function addNotification(id, title, message) {
    if(id&&title&&message) {
        if(!document.getElementById(id)) {
            document.getElementById("notification-center").innerHTML += "<div class='card shadow' id='"+id+"'><div class='card-header'><span>" + title + "</span><i onclick='document.getElementById(\""+id+"\").remove()' class=\"bi bi-x-lg\"></i></div><div class='card-body'>" + message + "</div></div>";
        }
    }
}

function setStorage(key,value) {
    if(storage) {
        localStorage.setItem(key,value);
    }
}

function getStorage(key) {
    if(storage) {
        return localStorage.getItem(key);
    }
    return "";
}

function showSource(url) {
    window.open('view-source:' + url);
}

async function copyImage(imageSrc) {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    await navigator.clipboard.write([
        new ClipboardItem({
            [blob.type]: blob
        })
    ]);
}

if(urlParams.has("_ijt")) {
    document.body.innerHTML += "<div id='development-settings' style='padding: 0 0 3rem 0;' class='d-flex gap-2 w-100 justify-content-center align-items-center text-center bg-black'></div>";
    const ds = document.getElementById("development-settings");
    if(ds) {

        if(document.getElementById("context-menu")) {
            ds.innerHTML += "<button class='button-red' onclick=\"this.remove(); document.getElementById('context-menu').remove();\">Remove context menu</button>";
        }
        ds.innerHTML +="<button onclick='location.reload();'>Reload page</button>";
    }
}