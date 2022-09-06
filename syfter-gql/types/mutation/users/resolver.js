
import teamManager  from "../../../business-logic/team-manager.js";
export default class UsersMutation {
    async signupUser({ data: { email, name, password } }, { dataSources: { users, teams, players } }){ 
        if (!email) {
            throw new Error("Email is required")
        }
        if (!password) {
            throw new Error("Password is required")
        }

        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long")
        }
        const user = await users.registerUser(email, name, password)
        teamManager.createTeam({ data: { owner: user.user._id, ownerName: name } }, { teams, players })
        return user
    }

    async loginUser({ data: { email, password } }, { dataSources: { users } }) {
        return users.loginUser(email, password);
    }

}