var shell = require('shelljs');

function parseLine(data) {
    let res = {
        raw: data
    }

    data = data.split('=')

    let predicate = data[0].split('::', 2)

    if (predicate[1]) {
        res['MIB'] = predicate[0] ? predicate[0].trim() : null

        res['Resource'] = predicate[1] ? predicate[1].trim() : null
    }

    else {
        res['Resource'] = predicate[0] ? predicate[0].trim() : null
    }

    let result = data[1]

    if (!result)
        return

    result = result.split(':', 2)

    res['type'] = result[0] ? result[0].trim() : null
    res['value'] = result[1] ? result[1].trim() : null

    return res
}

class SNMPConnection {
    constructor(private address: string,
        private community: string,
        private port: number = 161,
        private version: string = '2c',
        private options: string = '') {
    }

    query(type: string, oid: string) {
        return new Promise((resolve) => {
            shell.exec(`snmp${type} -v ${this.version} -c ${this.community} ${this.address}:${this.port} ${oid} ${this.options}`, { silent: true }, function (code, data) {
                console.log(data)
                resolve({
                    statusCode: (code == 0) ? 200 : 400,
                    data: (code == 0) ? data.split('\n').map(parseLine).filter(d => d != null) : { data: 'Invalid Parameters' } 
                })
            });
        })
    }

    get(oid: string) {
        return this.query('get', oid)
    }

    bulkwalk(oid: string) {
        return this.query('bulkwalk', oid)
    }
}

export { SNMPConnection }
