const
    secret_input = document.getElementById('secret'),
    passphrase_input = document.getElementById('passphrase'),
    length_input = document.getElementById('length'),
    generate_password_button = document.getElementById('generate_password'),
    password_generated_input = document.getElementById('password_generated'),
    copy_password_generated_button = document.getElementById('copy_password_generated'),
    copy_password_generated_confirmation = document.getElementById('copy_password_generated_confirmation'),
    password_generated_div = document.getElementById('password_generated_div'),
    change_secret_type_button = document.getElementById('change_secret_type'),
    errors_div = document.getElementById('errors')

function save_secret_to_local_storage() {
    localStorage.setItem('passmx-secret', secret_input.value)
}

function load_secret_from_local_storage() {
    if ('passmx-secret' in localStorage) secret_input.value = localStorage.getItem('passmx-secret')
    if ('passmx-secret-type' in localStorage) secret_input.type = localStorage.getItem('passmx-secret-type')
}

function save_length_to_local_storage() {
    localStorage.setItem('passmx-length', length_input.value)
}

function load_length_from_local_storage() {
    if ('passmx-length' in localStorage) length_input.value = localStorage.getItem('passmx-length')
}

function change_secret_type() {
    secret_input.type = secret_input.type === 'password' ? 'text' : 'password'
    localStorage.setItem('passmx-secret-type', secret_input.type)
}

function copy_password() {
    navigator.clipboard.writeText(password_generated_input.value)
        .then(() => copy_password_generated_confirmation.classList.remove('visually-hidden'))
}

function generate_password() {
    if (secret_input.value === "") return secret_input.classList.add('is-invalid')
    else secret_input.classList.remove('is-invalid')

    if (passphrase_input.value === "") return passphrase_input.classList.add('is-invalid')
    else passphrase_input.classList.remove('is-invalid')

    fetch("https://passmx.sertor.es/api/v1/generates/password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            secret: secret_input.value,
            passphrase: passphrase_input.value,
            length: length_input.value
        })
    })
        .then(response => response.json())
        .then(json => {
            if (json.data.errors) {
                errors.classList.remove('visually-hidden')
                json.data.errors.map(error => {
                    errors.innerHTML += `<p>${error.path + ': ' + error.msg}</p>`
                })
                return
            }

            password_generated_input.value = json.data.password.replace(/[^a-zA-Z0-9\(\),?\/!@#$%^&*;:{}\[\]\|\\<>\~`_+\-=]+/ig, '')
            password_generated_div.classList.remove('visually-hidden')
            save_secret_to_local_storage()
            save_length_to_local_storage()
        })
}

generate_password_button.addEventListener("click", generate_password)
copy_password_generated_button.addEventListener("click", copy_password)
change_secret_type_button.addEventListener("click", change_secret_type)
load_secret_from_local_storage()
load_length_from_local_storage()
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    passphrase_input.value = `8tPWkcAbtTXlXPYAAbDB5Cx7lhAdm7dc${tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)[1]}ZDrCMKOPrYJnmytP7YdshGZEzKTCVloe`
})
