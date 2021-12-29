
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'nhap ten cho san pham'],
        trim: true,
        maxLength: [100, 'ten san pham khogn qua 100 ki tu']
    },
    price: {
        type: Number,
        required: [true, 'nhap gia cho san pham'],
        maxLength: [9, 'gia san pham qua lon'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'nhap mo ta cho san pham'],
    },
    rating:{
        type: Number,
        default: 0
    },
    images:[{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category:{
        type: String,
        required: [true, 'chon danh muc'],
        enum:{
            values:[
                'Thịt',
                'Cá',
                'Trứng',
                'Rau',
                'Trái Cây',
                'Gia Vị',
                'Gạo',
                'Thức Uống',
                'Dụng Cụ Nhà Bếp'
            ],
            message: 'chon danh muc cho san pham'
        }
    },
    seller:{
        type: String,
        required: [true, 'nhap thon tin nguoi ban']
    },
    stock:{
        type: Number,
        required: [true, 'nhap so luong'],
        maxLength: [5,'so luong khong qua 5 ki tu'],
        default: 0
    },
    numOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            name:{
                type: String,
                required: true,
            },
            rating:{
                type: Number,
                required: true,
            },
            comment:{
                type: String,
                required: true,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createAt:{
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Product',productSchema);