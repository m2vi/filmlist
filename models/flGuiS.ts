import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const flGuiSSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false, collection: 'flGuiSs', versionKey: false });

export default mongoose.models.flGuiS || mongoose.model('flGuiS', flGuiSSchema);
