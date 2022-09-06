// import UsersMutation from './users/resolver.js';
// import Player from '../query/players/resolver.js';
// import teamManager from '../../business-logic/team-manager.js';

export default class Mutation {
    // async users() {
    //     return new UsersMutation()
    // }

    async scan(parent, { data: request }, { dataSources: { kafkaDS, trackerDS }, user }) {
        if (!user) {
            throw new Error('You must be logged in to scan')
        }
        console.log("in scan")
        const tracker = await trackerDS.startScan(request)
        console.log(`tracker: ${JSON.stringify(tracker)}`)
        request.id = tracker?.body?.id
        console.log(`request.id: ${request.id}`)
        await kafkaDS.placeRequest(request)
        console.log(`tracker.id: ${tracker.id}`)
        return request.id
    }

}