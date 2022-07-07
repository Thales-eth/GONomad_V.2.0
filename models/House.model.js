const { Schema, model } = require("mongoose")

const houseSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Housing name is required'],
        },
        description: {
            type: String,
            required: [true, 'Housing description is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        picture: {
            type: [String],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

const House = model("House", houseSchema)

module.exports = House
