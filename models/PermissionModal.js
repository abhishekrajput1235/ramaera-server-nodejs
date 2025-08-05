const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    grantedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissions: {
        postBlog: { type: Boolean, default: false },
        replyMessage: { type: Boolean, default: false },
        editBlog: { type: Boolean, default: false },
        deleteBlog: { type: Boolean, default: false },
        manageUsers: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
