import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const filmlistSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false, collection: 'items', versionKey: false });

export default mongoose.models.filmlist || mongoose.model('filmlist', filmlistSchema);
