import * as express from 'express'
import { SNMPConnection } from './SNMPConnection';
const SNMPRouter = express.Router()

SNMPRouter.use((req: express.Request, res: express.Response, next: Function) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(`Request to ${req.path}`)
    next()
})

SNMPRouter.get('/', (req: express.Request, res: express.Response) => {
    res.send({
        'routes': {
            '/get': {
                'methods': ['GET'],
                'description': 'Run SNMPGET on some OID',
                'args': {
                    'address': {
                        'description': 'Address of the SNMP Server',
                        'obligatory': true,
                        'type': 'string'
                    },
                    'port': {
                        'description': 'Port of the SNMP Server',
                        'obligatory': false,
                        'default': 161,
                        'type': 'number'
                    },
                    'community': {
                        'description': 'Community of the SNMP Server',
                        'obligatory': true,
                        'type': 'string'
                    },
                    'oid': {
                        'description': 'Requested OID',
                        'obligatory': true,
                        'type': 'string'
                    }
                },
                'examples': [
                    '/snmp/get?address=site.com&community=private&oid=1.3.6.1.4.1.1.2.3.4',
                    '/snmp/get?address=192.168.0.1&port=60161&community=public&oid=1.3.6.1.4.1.2.2.3.1'
                ]
            },
            '/bulkwalk': {
                'methods': ['GET'],
                'description': 'Run SNMPBULKWALK on some OID',
                'args': {
                    'address': {
                        'description': 'Address of the SNMP Server',
                        'obligatory': true,
                        'type': 'string'
                    },
                    'port': {
                        'description': 'Port of the SNMP Server',
                        'obligatory': false,
                        'default': 161,
                        'type': 'number'
                    },
                    'community': {
                        'description': 'Community of the SNMP Server',
                        'obligatory': true,
                        'type': 'string'
                    },
                    'oid': {
                        'description': 'Requested OID',
                        'obligatory': false,
                        'default': '.1',
                        'type': 'string'
                    }
                },
                'examples': [
                    '/snmp/bulkwalk?address=site.com&community=private',
                    '/snmp/bulkwalk?address=192.168.0.1&port=60161&community=public&oid=1.3.6'
                ]
            }
        }
    })
})

SNMPRouter.get('/get', async (req: express.Request, res: express.Response) => {
    if (!req.query['address'])
        res.status(400).json({
            'error': 'You must provide an Address'
        })

    else if (!req.query['community'])
        res.status(400).json({
            'error': 'You must provide a Community'
        })

    else if (!req.query['OID'])
        res.status(400).json({
            'error': 'You must provide an OID'
        })


    else {
        let snmpResponse = await new SNMPConnection(req.query['address'],
            req.query['community'],
            req.query['port'])
            .get(req.query['OID'])

        res.status(snmpResponse['statusCode'])
            .json(snmpResponse['data'])

    }
})

SNMPRouter.get('/bulkwalk', async (req: express.Request, res: express.Response) => {
    if (!req.query['address'])
        res.status(400).json({
            'error': 'You must provide an Address'
        })

    else if (!req.query['community'])
        res.status(400).json({
            'error': 'You must provide a Community'
        })

    else {
        let snmpResponse = await new SNMPConnection(req.query['address'],
            req.query['community'],
            req.query['port'],
            req.query['version'], 
            req.query['options'])
            .bulkwalk(req.query['OID'] || "1.3.6.1")

        res.status(snmpResponse['statusCode'])
            .json(snmpResponse['data'])

    }
})

export { SNMPRouter }
