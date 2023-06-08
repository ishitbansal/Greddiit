const express = require("express")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
const cors = require("cors");
const nodemailer = require('nodemailer');

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://ib:ib@cluster0.61u6p7p.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log("Database connected"));

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    age: Number,
    contactnumber: Number,
    pwd: String,
    followers: [String],
    following: [String],
})

const subgreddiitSchema = new mongoose.Schema({
    moderator: String,
    name: String,
    creationdate: Date,
    description: String,
    tags: [String],
    bannedkeywords: [String],
    followers: [String],
    blockedusers: [String],
    joinreq: [String],
    rejected: [{ username: String, time: Date }],
    left: [String],
    posts: Number
})

const postSchema = new mongoose.Schema({
    text: String,
    postedby: String,
    postedin: String,
    upvotes: [String],
    downvotes: [String],
    comments: [{ text: String, author: String }],
    savedby: [String],
    reportedby: [String]
})

const reportSchema = new mongoose.Schema({
    reportedby: String,
    reporteduser: String,
    concern: String,
    post: String,
    posttext: String,
    reportedin: String,
    ignore: Boolean,
    blocked: Boolean,
    creationdate: Date,
})

const User = mongoose.model("User", userSchema);
const SubGreddiit = mongoose.model("SubGreddiit", subgreddiitSchema);
const Post = mongoose.model("Post", postSchema);
const Report = mongoose.model("Report", reportSchema);

const app = express();

app.use(express.json());

app.use(cors());

app.get('/api/', (req, res) => {
    res.send('Hello World, hi');
})

app.post('/api/login', (req, res) => {
    console.log(req.body);
    User.findOne({ email: req.body.Email }, (err, user) => {
        if (err) {
            console.log(err);
        }
        else if (!user) {
            res.send("Invalid email");
        }
        else {
            bcrypt.compare(req.body.Password, user.pwd, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result == true) {

                    const token = jwt.sign({ email: user.email, username: user.username }, secretKey, { expiresIn: '30d' });
                    console.log(user);
                    res.json({ token: token });
                }
                else {
                    res.send("Invalid password");
                }
            });
        }
    });

})

app.post('/api/register', (req, res) => {
    console.log(req.body);
    User.findOne({ email: req.body.Email }, (err, user) => {
        if (err) {
            console.log(err);
        }
        else if (!user) {
            bcrypt.hash(req.body.Password, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // if (!req.body.Email.includes('@') || Number(req.body.ContactNumber).length !== 10 || Number(req.body.Age) > 100 || Number(req.body.Age) < 15) {
                    //     res.send('invalid input')
                    // }
                    // else {
                    const user = new User({
                        firstname: req.body.FirstName,
                        lastname: req.body.LastName,
                        username: req.body.Username,
                        email: req.body.Email,
                        age: req.body.Age,
                        contactnumber: req.body.ContactNumber,
                        pwd: hash,
                    })
                    user.save();
                    res.send("Registered user");
                    // }
                }
            });
        }
        else {
            res.send("Email already registered");
            console.log(user);
        }
    });
})

app.get('/api/profile', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            console.log(authUser.email);
            User.findOne({ email: String(authUser.email) }, (err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(user);
                }
            })
        }
    })
})

app.post('/api/editprofile', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            User.updateOne({ username: authUser.username }, {
                $set: {
                    firstname: req.body.FirstName,
                    lastname: req.body.LastName,
                    username: req.body.Username,
                    email: req.body.Email,
                    age: req.body.Age,
                    contactnumber: req.body.ContactNumber,
                }
            }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    res.send("updated");
                }
            })
        }
    });
});

app.post('/api/removefollower', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            User.findOneAndUpdate({ username: authUser.username }, {
                $pull: {
                    followers: String(req.body.follower)
                }
            }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    User.findOneAndUpdate({ username: req.body.follower }, {
                        $pull: {
                            following: authUser.username
                        }
                    }, (err, user) => {
                        if (err)
                            console.log(err);
                        else {
                            res.send("removed");
                        }
                    })
                }
            })
        }
    })
})

app.post('/api/unfollow', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            User.findOneAndUpdate({ username: authUser.username }, {
                $pull: {
                    following: String(req.body.following)
                }
            }, (err, user) => {
                console.log(user);
                if (err)
                    console.log(err);
                else {
                    User.findOneAndUpdate({ username: req.body.following }, {
                        $pull: {
                            followers: authUser.username
                        }
                    }, (err, user) => {
                        console.log(user);
                        if (err)
                            console.log(err);
                        else {
                            res.send("unfollowed");
                        }
                    })
                }
            })
        }
    })
})

app.post('/api/newsubgreddiit', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            const subgreddiit = new SubGreddiit({
                moderator: authUser.username,
                name: req.body.Name,
                creationdate: new Date(Date.now()),
                description: req.body.Description,
                tags: (String(req.body.Tags)).split(','),
                bannedkeywords: (String(req.body.BannedKeywords)).split(','),
                followers: [authUser.username],
                posts: 0
            })
            subgreddiit.save();
            res.send("Created SubGreddiit");
        }
    })
})

app.get('/api/mysubgreddiits', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            console.log(authUser.email);
            SubGreddiit.find({ moderator: authUser.username }, (err, subgreddiits) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(subgreddiits);
                }
            })
        }
    })
})

app.post('/api/deletesubgreddiit', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.deleteOne({ _id: req.body.sub_greddiit._id }, (err, sub_greddiit) => {
                if (err)
                    console.log(err);
                else {
                    Post.deleteMany({ postedin: req.body.sub_greddiit._id }, (err, posts) => {
                        if (err)
                            console.log(err);
                        else {
                            Report.deleteMany({ reportedin: req.body.sub_greddiit._id }, (err, reports) => {
                                if (err)
                                    console.log(err);
                                else
                                    res.send("deleted subgreddiit, its posts and its reports");
                            })
                        }
                    })
                }
            })
        }
    })
})

app.get('/api/subgreddiit', (req, res) => {
    console.log(req.query.id)
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findById((req.query.id), (err, subgreddiit) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(subgreddiit)
                    res.send(subgreddiit);
                }
            })
        }
    })
})


app.post('/api/acceptrequest', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findOneAndUpdate({ _id: req.body.subgred_id }, {
                $pull: {
                    joinreq: String(req.body.user)
                },
                $push: {
                    followers: String(req.body.user)
                }
            }, (err, subgreddiit) => {
                if (err)
                    console.log(err);
                else {
                    res.send("request accepted");
                }
            })
        }
    })
})

app.post('/api/rejectrequest', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findOneAndUpdate({ _id: req.body.subgred_id }, {
                $pull: {
                    joinreq: String(req.body.user)
                },
                $push: {
                    rejected: { username: String(req.body.user), time: new Date(Date.now()) }
                }
            }, (err, subgreddiit) => {
                if (err)
                    console.log(err);
                else {
                    res.send("request rejected");
                }
            })
        }
    })
})

app.get('/api/subgreddiits', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            console.log(authUser.email);
            SubGreddiit.find({}, (err, subgreddiits) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(subgreddiits);
                }
            })
        }
    })
})

app.post('/api/joinrequest', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findOne({ _id: req.body.subgred_id }, (err, subgreddiit) => {
                if (err)
                    console.log(err);
                else {
                    var day = 86400000;
                    var hour = 3600000;
                    var minute = 60000;
                    var sec = 1000;

                    var time = 7 * day
                    subgreddiit.rejected.forEach((rejected) => {
                        if (new Date(Date.now()).getTime() - rejected.time.getTime() > time) {
                            SubGreddiit.findOneAndUpdate({ _id: req.body.subgred_id }, {
                                $pull: {
                                    rejected: { username: rejected.username, time: rejected.time }
                                }
                            }, (err, subgreddiit) => {
                                if (err)
                                    console.log(err);
                            })
                        }
                    })

                    subgreddiit.rejected.filter(rejected => new Date(Date.now()).getTime() - rejected.time.getTime() > time)

                    if (subgreddiit.left.includes(authUser.username)) {
                        res.send('left');
                    }
                    else if (subgreddiit.rejected.some(e => e.username === authUser.username)) {
                        res.send('rejected');
                    }
                    else if (subgreddiit.joinreq.includes(authUser.username)) {
                        res.send('requested');
                    }
                    else if (subgreddiit.followers.includes(authUser.username)) {
                        res.send('already member');
                    }
                    else if (subgreddiit.blockedusers.includes(authUser.username)) {
                        res.send('blocked');
                    }
                    else {
                        SubGreddiit.findOneAndUpdate({ _id: req.body.subgred_id }, {
                            $push: {
                                joinreq: String(authUser.username)
                            },
                        }, (err, subgreddiit) => {
                            if (err)
                                console.log(err);
                            else {
                                res.send("sent request");
                            }
                        })
                    }
                }
            })
        }
    })
})

app.post('/api/leavesubgreddiit', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findOne({ _id: req.body.subgred_id }, (err, subgreddiit) => {
                if (err)
                    console.log(err);
                else {
                    // for api:
                    if (authUser.username === subgreddiit.moderator) {
                        res.send('moderator cannot leave');
                    }
                    else {
                        SubGreddiit.findOneAndUpdate({ _id: req.body.subgred_id }, {
                            $pull: {
                                followers: String(authUser.username)
                            },
                            $push: {
                                left: String(authUser.username)
                            }
                        }, (err, subgreddiit) => {
                            if (err)
                                console.log(err);
                            else {
                                res.send("left subgreddiit");
                            }
                        })
                    }
                }
            })

        }
    })
})

app.post('/api/newpost', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {

            SubGreddiit.findOneAndUpdate({ _id: req.body.subgred_id }, {
                $inc: { posts: 1 }
            }, (err, subgreddiit) => {
                if (err)
                    console.log(err);
                else {
                    var postText = req.body.PostText;
                    subgreddiit.bannedkeywords.map(keyword => { postText = postText.replace(RegExp(keyword, "ig"), '*') })

                    const post = new Post({
                        text: postText,
                        postedby: authUser.username,
                        postedin: req.body.subgred_id,
                    })
                    post.save();
                    res.send("Created Post");
                }
            })
        }
    })
})

app.get('/api/posts', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findOne({ _id: req.query.id }, (err, subgreddiit) => {
                if (err) {
                    console.log(err);
                }
                else {
                    Post.find({ postedin: req.query.id }, (err, posts) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if (authUser.username !== subgreddiit.moderator) {
                                posts.forEach(post => {
                                    if (subgreddiit.blockedusers.includes(post.postedby)) {
                                        post.postedby = 'Blocked User'
                                    }
                                });
                            }
                            res.send(posts);
                        }
                    })
                }
            })
            // Post.find({ postedin: req.query.id }, (err, posts) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     else {
            //         res.send(posts);
            //     }
            // })
        }
    })
})

app.post('/api/upvotepost', (req, res) => {
    console.log()
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Post.findOne({ _id: req.body.id }, (err, post) => {
                if (err)
                    console.log(err);
                else {
                    if (post.upvotes.includes(authUser.username)) {
                        Post.findOneAndUpdate({ _id: req.body.id }, {
                            $pull: {
                                upvotes: String(authUser.username)
                            }
                        }, (err, post) => {
                            if (err)
                                console.log(err);
                            else {
                                res.send("removed upvote");
                            }
                        })
                    }
                    else {
                        Post.findOneAndUpdate({ _id: req.body.id }, {
                            $pull: {
                                downvotes: String(authUser.username)
                            },
                            $push: {
                                upvotes: String(authUser.username)
                            }
                        }, (err, post) => {
                            if (err)
                                console.log(err);
                            else {
                                res.send("upvoted post");
                            }
                        })
                    }
                }
            })
        }
    })
})

app.post('/api/downvotepost', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Post.findOne({ _id: req.body.id }, (err, post) => {
                if (err)
                    console.log(err);
                else {
                    if (post.downvotes.includes(authUser.username)) {
                        Post.findOneAndUpdate({ _id: req.body.id }, {
                            $pull: {
                                downvotes: String(authUser.username)
                            }
                        }, (err, post) => {
                            if (err)
                                console.log(err);
                            else {
                                res.send("removed downvote");
                            }
                        })
                    }
                    else {
                        Post.findOneAndUpdate({ _id: req.body.id }, {
                            $pull: {
                                upvotes: String(authUser.username)
                            },
                            $push: {
                                downvotes: String(authUser.username)
                            }
                        }, (err, post) => {
                            if (err)
                                console.log(err);
                            else {
                                res.send("downvoted post");
                            }
                        })
                    }
                }
            })
        }
    })
})

app.post('/api/addcomment', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Post.findOneAndUpdate({ _id: req.body.id }, {
                $push: {
                    comments: { text: req.body.text, author: authUser.username }
                }
            }, (err, post) => {
                if (err)
                    console.log(err);
                else {
                    res.send("added comment");
                }
            })
        }
    })
})

app.post('/api/savepost', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Post.findOne({ _id: req.body.id }, (err, post) => {
                if (err)
                    console.log(err);
                else {
                    if (post.savedby.includes(authUser.username)) {
                        res.send("already saved")
                    }
                    else {
                        Post.findOneAndUpdate({ _id: req.body.id }, {
                            $push: {
                                savedby: authUser.username
                            }
                        }, (err, post) => {
                            if (err)
                                console.log(err);
                            else {
                                res.send("saved post");
                            }
                        })
                    }
                }
            })
        }
    })

})

app.post('/api/followuser', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            User.findOneAndUpdate({ username: req.body.user }, {
                $push: {
                    followers: authUser.username
                }
            }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    User.findOneAndUpdate({ username: authUser.username }, {
                        $push: {
                            following: user.username
                        }
                    }, (err, user) => {
                        if (err)
                            console.log(err);
                        else {
                            res.send("followed");
                        }
                    })
                }
            })
        }
    })
})

app.post('/api/reportpost', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Post.findOne({ _id: req.body.id }, (err, post) => {
                if (err)
                    console.log(err);
                else {
                    if (post.reportedby.includes(authUser.username)) {
                        res.send("already reported")
                    }
                    else {
                        Post.findOneAndUpdate({ _id: req.body.id }, {
                            $push: {
                                reportedby: authUser.username
                            }
                        }, (err, post) => {

                            if (err)
                                console.log(err);
                            else {
                                const report = new Report({
                                    reportedby: authUser.username,
                                    reporteduser: post.postedby,
                                    concern: req.body.concern,
                                    post: post._id,
                                    posttext: post.text,
                                    reportedin: post.postedin,
                                    ignore: false,
                                    blocked: false,
                                    creationdate: new Date(Date.now()),
                                })
                                report.save();
                                res.send("Reported Post");
                            }
                        })
                    }
                }
            })
        }
    })
})

app.get('/api/savedposts', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Post.find({ savedby: authUser.username }, (err, posts) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(posts);
                }
            })
        }
    })
})

app.post('/api/unsavepost', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Post.findOneAndUpdate({ _id: req.body.id }, {
                $pull: {
                    savedby: authUser.username
                }
            }, (err, post) => {
                if (err)
                    console.log(err);
                else {
                    res.send("unsaved post");
                }
            })
        }
    })
})

app.get('/api/reports', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Report.find({ reportedin: req.query.id }, (err, reports) => {
                if (err) {
                    console.log(err);
                }
                else {
                    var day = 86400000;
                    var hour = 3600000;
                    var minute = 60000;
                    var sec = 1000;

                    var time = 10 * day
                    reports.forEach(report => {
                        if ((new Date(Date.now()).getTime() - report.creationdate.getTime() > time) && !report.ignore && !report.blocked) {
                            Report.deleteOne({ _id: report._id }, (err, report_deleted) => {
                                if (err)
                                    console.log(err);
                                else {
                                    Post.findOneAndUpdate({ _id: report.post }, {
                                        $pull: {
                                            reportedby: report.reportedby
                                        }
                                    }, (err, post) => {
                                        console.log(post)
                                        if (err)
                                            console.log(err);
                                    })
                                }
                            })
                        }

                    });

                    reports.filter(report => (new Date(Date.now()).getTime() - report.creationdate.getTime() > time) && !report.ignore && !report.blocked)
                    res.send(reports);
                }
            })
        }
    })
})

function Transporter() {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'greddiit01@gmail.com',
            pass: 'mkasiifpjeigqfcx',
        },
    });
    return transporter;
}

app.post('/api/deletepost', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Report.deleteOne({ _id: req.body.report._id }, (err, report) => {
                if (err)
                    console.log(err);
                else {
                    Post.deleteOne({ _id: req.body.report.post }, (err, post) => {
                        if (err)
                            console.log(err);
                        else {
                            SubGreddiit.findOneAndUpdate({ _id: req.body.report.reportedin }, {
                                $inc: { posts: -1 }
                            }, (err, subgreddiit) => {
                                console.log(subgreddiit)
                                if (err)
                                    console.log(err);
                                else {
                                    User.findOne({ username: req.body.report.reportedby }, (err, user1) => {
                                        if (err)
                                            console.log(err)
                                        else {
                                            User.findOne({ username: req.body.report.reporteduser }, (err, user2) => {
                                                if (err)
                                                    console.log(err)
                                                else {
                                                    var transporter = Transporter()
                                                    var mailOptions = {
                                                        from: 'greddiit01@gmail.com',
                                                        to: user1.email,
                                                        subject: 'Status of reported post',
                                                        text: 'Moderator has deleted the post based on your reported post with text "' + req.body.report.posttext + '".'
                                                    };
                                                    transporter.sendMail(mailOptions, function (error, info) {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            console.log('Email sent: ' + info.response);
                                                        }
                                                    });

                                                    var transporter = Transporter()
                                                    var mailOptions = {
                                                        from: 'greddiit01@gmail.com',
                                                        to: user2.email,
                                                        subject: 'Post Deleted',
                                                        text: 'Your post with text "' + req.body.report.posttext + '" has been reported by other users and the moderator has deleted that post. '
                                                    };
                                                    transporter.sendMail(mailOptions, function (error, info) {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            console.log('Email sent: ' + info.response);
                                                        }
                                                    });
                                                    res.send("Blocked user");
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.post('/api/ignorereport', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Report.updateOne({ _id: req.body.report._id }, {
                $set: {
                    ignore: true
                }
            }, (err, report) => {
                if (err)
                    console.log(err);
                else {

                    User.findOne({ username: req.body.report.reportedby }, (err, user) => {
                        if (err)
                            console.log(err)
                        else {
                            var transporter = Transporter()
                            var mailOptions = {
                                from: 'greddiit01@gmail.com',
                                to: user.email,
                                subject: 'Status of reported post',
                                text: 'Your report of post with text "' + req.body.report.posttext + '" has been ignored by the moderator.'
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                            res.send("Ignored report");
                        }
                    })


                }
            })
        }
    });
});

app.post('/api/unignorereport', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            Report.updateOne({ _id: req.body.report._id }, {
                $set: {
                    ignore: false
                }
            }, (err, report) => {
                if (err)
                    console.log(err);
                else {
                    res.send("Unignored report");
                }
            })
        }
    });
});

app.post('/api/blockuser', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.updateOne({ _id: req.body.report.reportedin }, {
                $push: {
                    blockedusers: req.body.report.reporteduser
                },
                $pull: {
                    followers: req.body.report.reporteduser
                }
            }, (err, subgreddiit) => {
                if (err)
                    console.log(err);
                else {
                    Report.updateOne({ _id: req.body.report._id }, {
                        $set: {
                            blocked: true
                        }
                    }, (err, report) => {
                        if (err)
                            console.log(err);
                        else {
                            User.findOne({ username: req.body.report.reportedby }, (err, user1) => {
                                if (err)
                                    console.log(err)
                                else {
                                    User.findOne({ username: req.body.report.reporteduser }, (err, user2) => {
                                        if (err)
                                            console.log(err)
                                        else {
                                            var transporter = Transporter()
                                            var mailOptions = {
                                                from: 'greddiit01@gmail.com',
                                                to: user1.email,
                                                subject: 'Status of reported post',
                                                text: 'Moderator has blocked the user ' + req.body.report.reporteduser + ' based on your reported post with text "' + req.body.report.posttext + '".'
                                            };
                                            transporter.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            });

                                            var transporter = Transporter()
                                            var mailOptions = {
                                                from: 'greddiit01@gmail.com',
                                                to: user2.email,
                                                subject: 'Blocked from Subgreddiit',
                                                text: 'Moderator has blocked you from the subgreddiit after your post with text "' + req.body.report.posttext + '" was reported.'
                                            };
                                            transporter.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            });

                                            res.send("Blocked user");
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
})

app.get('/api/protectmysubgreddiit', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findById((req.query.id), (err, subgreddiit) => {
                if (err) {
                    console.log(err);
                    res.send(false)
                }
                else {
                    if (subgreddiit.moderator === authUser.username) {
                        res.send(true);
                    }
                    else {
                        res.send(false)
                    }
                }
            })
        }
    })
})

app.get('/api/protectsubgreddiit', (req, res) => {
    jwt.verify(req.headers.authorization, secretKey, (err, authUser) => {
        if (err)
            console.log(err);
        else {
            SubGreddiit.findById((req.query.id), (err, subgreddiit) => {
                if (err) {
                    console.log(err);
                    res.send(false)
                }
                else {
                    if (subgreddiit.followers.includes(authUser.username)) {
                        res.send(true);
                    }
                    else {
                        res.send(false)
                    }
                }
            })
        }
    })
})



app.listen(5000, () => console.log('Server listening on 5000'))