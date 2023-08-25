function setRegisterFormAction(form) {
    form.action = "/auth/register";
    alert(form.action);
    return false;
  }

function setLoginFormAction(form) {
    form.action = "/auth/login";
    alert(form.action);
    return false;
  }