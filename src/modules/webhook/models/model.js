'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var WebhookSchema = new Schema({
    name: {
        type: String
    },
    status: {
        type: String,
        enum: ['active','paused','disabled'],
        default: 'active'
    },
    topic: {
        type: String
    },
    resource: {
        type: String
    },
    event: {
        type: String
    },
    hooks: {
        type: []
    },
    delivery_url: {
        type: String
    },
    secret: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Webhook", WebhookSchema);