let urlOrIpREGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|^((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/


let numberREGEX = /^[0-9]*$/

function createListener(regex, field) {
    $(field).on('change', () => {
        if (!regex.test($(field).val())) {
            $(field).removeClass('is-valid')
            $(field).addClass('is-invalid')
        }

        else {
            $(field).removeClass('is-invalid')
            $(field).addClass('is-valid')
        }
    })
}

createListener(urlOrIpREGEX, '#srvAddress')
createListener(numberREGEX, '#srvPort')
createListener(/^(?!\s*$).+/, '#community')
createListener(/^(?!\s*$).+/, '#OID')



function sendSNMPRequest() {
    let fields = ['#srvAddress', '#srvPort', '#community', '#OID']
    let isValid = true

    fields.forEach(field => {
        isValid = isValid && $(field).hasClass('is-valid')
    })

    if (!isValid)
        return false

    else {
        let form = {
            address: $('#srvAddress').val(),
            port: $('#srvPort').val(),
            community: $('#community').val(),
            OID: $('#OID').val(),
            options: $('#options').val(),
            version: $('#version').val(),
        }

        let urlx = new URLSearchParams(form)


        if ($('#type').val() == 'get')
            urlx = 'http://127.0.0.1:8080/snmp/get?' + urlx.toString()

        else if ($('#type').val() == 'bulkwalk')
            urlx = 'http://127.0.0.1:8080/snmp/bulkwalk?' + urlx.toString()

        doRequest(urlx)
    }

    return false
}

function doRequest(url) {
    var myHeaders = new Headers();

    $('.results').html(`
        <div class= "text-center" >
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`)


    var myInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors'
    };

    fetch(url, myInit)
        .then(response => {
            if (response.status !== 200)
                response.json().then(function (data) {
                    $('.results').html(`<div class='text-center'><h3>Error</h3> <p>${data['data']}</p></div>`)
                });

            else {
                response.json().then(drawTable);
            }
        })
}

function drawTable(data) {
    let html = `<table class='table'>
    <thead>
        <tr>
            <th scope="col">MIB</th>
            <th scope="col">Resource</th>
            <th scope="col">Type</th>
            <th scope="col">Value</th>
        </tr>
    </thead>
    <tbody>
        ${createBody(data)}
    </tbody>
</table>`
    console.log(html)
    $('.results').html(html)
}

function createBody(data) {
    let html = ''
    data.forEach((snmpLine) => {
        if (!snmpLine['value']) {
            snmpLine['value'] = snmpLine['type']
            snmpLine['type'] = 'ERROR'
        }

        html += `<tr>
            <th scope="row">${snmpLine['MIB'] || ''}</th>
            <td>${snmpLine['Resource'] || ''}</td>
            <td>${snmpLine['type'] || ''}</td>
            <td>${snmpLine['value'] || ''}</td>
        </tr>`
    })
    return html
}