const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vote = require('../model/Vote');
const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '657632',
    key: 'ea76542dce65a13db788',
    secret: '0f1f2f997101de35e123',
    cluster: 'ap2',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post('/', (req, res) => {

    const newVote = {
        points: 1,
        os: req.body.os
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });

        return res.json({ succes: true, message: "thanks for voting" });

    });

});
module.exports = router;