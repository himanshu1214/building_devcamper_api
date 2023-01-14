const mongoose = require('mongoose');
const BootcampSchema = new mongoose.Schema({
    name: { 
        type: String,
        required : [true, "Please add a name"],
        unique: true,
        trim: true, 
        maxlength: [50, "Name cannot be more than 50 chars"],
    },
    slug: String,
    description: {
        type: String, 
        required: [true, "Please add a description"],
        maxlength: [5000, "Description cannot be more than 500 characters"]
    }, 
    website: {
        type: String,
        match: [ /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
    ]
    }, 
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot be longer than 20 chars'] 
    }, 
    email:{
        type:String, 
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    }, 
    location: {
        type: String, 
        enum: ['Point'], 
        },
    coordinates: {
        type: [Number],
        index: '2dsphere'
        },
    formatted_address: String,
    street: String,
    state: String, 
    zipcode: String,
    country: String, 
    careers: {
        type: [String], 
        required: true, 
        enum: [
            'Web Development', 
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
        }, 
    average_ratings: {
        type: Number,
        min: [1, 'Rating must be atleast 1'],
        max: [10, 'Rating cannot be more than 10']

        },
        average_cost: Number,
    photo: {
        type: String, 
        default:'no-photo.jpg'
        },
    housing: {
        type: Boolean,
        default: false
        },
    jobAssistance: {
        type: Boolean,
        default: false
        },
    jobGuarantee: {
        type: Boolean,
        default: false
        },
    acceptGi: {
        type: Boolean,
        default: false
        },
    createdAt: {
        type: Date,
        default: Date.now
        }
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);