let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));
let SignoutBtn = document.getElementById("logout");

let Signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  window.location.href = "login.html";
};

let CheckCred = () => {
  if (!sessionStorage.getItem("user-creds"))
    window.location.href = "login.html";
};
window.addEventListener("load", CheckCred);
SignoutBtn.addEventListener("click", Signout);
