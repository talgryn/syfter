
export class Resolver {
  async getScans(parents, { _ }, { dataSources: { trackerDS } }) {
    const resp =  await trackerDS.getScans()
    console.log(resp)
    return resp
    
  }

  async getScanResults(parents, { id }, { dataSources: { trackerDS } }) {
    console.log(`id: ${id}`)
    return trackerDS.getScanResults(id)
  }
}