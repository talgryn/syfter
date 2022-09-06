import mongoose from 'mongoose'

const Schema = mongoose.Schema

import passportLocalMongoose from 'passport-local-mongoose';

const Account = new Schema({
    name: String,
});

Account.plugin(passportLocalMongoose);

export default mongoose.model('Account', Account);