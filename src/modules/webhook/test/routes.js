'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Webhook = mongoose.model('Webhook');

var credentials,
    token,
    mockup;

describe('Webhook CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            name: "Order updated",
            topic: "order.updated",
            resource: "order",
            event: "updated",
            hooks: [
                "woocommerce_process_shop_order_meta",
                "woocommerce_api_edit_order",
                "woocommerce_order_edit_status",
                "woocommerce_order_status_changed"
            ],
            delivery_url: "http://requestb.in/1g0sxmo1"
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Webhook get use token', (done) => {
        request(app)
            .get('/api/webhooks')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Webhook get by id', function (done) {

        request(app)
            .post('/api/webhooks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/webhooks/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, mockup.name);
                        assert.equal(resp.data.status, mockup.status);
                        assert.equal(resp.data.topic, mockup.topic);
                        assert.equal(resp.data.resource, mockup.resource);
                        assert.equal(resp.data.event, mockup.event);
                        assert.equal(resp.data.delivery_url, mockup.delivery_url);
                        assert.equal(resp.data.hooks[0], mockup.hooks[0]);
                        assert.equal(resp.data.hooks[1], mockup.hooks[1]);
                        assert.equal(resp.data.hooks[2], mockup.hooks[2]);
                        assert.equal(resp.data.hooks[3], mockup.hooks[3]);
                        done();
                    });
            });

    });

    it('should be Webhook post use token', (done) => {
        request(app)
            .post('/api/webhooks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.name, mockup.name);
                assert.equal(resp.data.status, mockup.status);
                assert.equal(resp.data.topic, mockup.topic);
                assert.equal(resp.data.resource, mockup.resource);
                assert.equal(resp.data.event, mockup.event);
                assert.equal(resp.data.delivery_url, mockup.delivery_url);
                assert.equal(resp.data.hooks[0], mockup.hooks[0]);
                assert.equal(resp.data.hooks[1], mockup.hooks[1]);
                assert.equal(resp.data.hooks[2], mockup.hooks[2]);
                assert.equal(resp.data.hooks[3], mockup.hooks[3]);
                done();
            });
    });

    it('should be webhook put use token', function (done) {

        request(app)
            .post('/api/webhooks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/webhooks/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, update.name);
                        assert.equal(resp.data.status, mockup.status);
                        assert.equal(resp.data.topic, mockup.topic);
                        assert.equal(resp.data.resource, mockup.resource);
                        assert.equal(resp.data.event, mockup.event);
                        assert.equal(resp.data.delivery_url, mockup.delivery_url);
                        assert.equal(resp.data.hooks[0], mockup.hooks[0]);
                        assert.equal(resp.data.hooks[1], mockup.hooks[1]);
                        assert.equal(resp.data.hooks[2], mockup.hooks[2]);
                        assert.equal(resp.data.hooks[3], mockup.hooks[3]);
                        done();
                    });
            });

    });

    it('should be webhook delete use token', function (done) {

        request(app)
            .post('/api/webhooks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/webhooks/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be webhook get not use token', (done) => {
        request(app)
            .get('/api/webhooks')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be webhook post not use token', function (done) {

        request(app)
            .post('/api/webhooks')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be webhook put not use token', function (done) {

        request(app)
            .post('/api/webhooks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/webhooks/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be webhook delete not use token', function (done) {

        request(app)
            .post('/api/webhooks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/webhooks/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Webhook.remove().exec(done);
    });

});