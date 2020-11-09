import { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

productSchema.plugin(mongoosePaginate)

export default function createProductModel ({ db }) {
  return db.model('Product', productSchema)
}
