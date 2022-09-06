
import { HTTPDataSource } from 'apollo-datasource-http'

export default class TrackerDS extends HTTPDataSource{
    constructor(baseURL, pool) {
        // global client options
        super(baseURL, {
          pool,
          clientOptions: {
            bodyTimeout: 5000,
            headersTimeout: 2000,
          },
          requestOptions: {
            headers: {
              'X-Client': 'client',
            },
          },
        })
    }
    
    async startScan(request) {
        return (await this.post('/api/scans', {
            body: request
          }))
        // return {
        //     id: "12345"
        // }
    }

    async getScans() {
        return (await this.get('/api/scans')).body
    }

    async getScanResults(id) {
        const resp = await this.get(`/api/scans/${id}`)
        resp.body.id = resp.body._id
        return resp.body
    }


}