// FROM SOLUTION VID

'use strict';

var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});
var marked = require('marked'); // allows users to markup content

var Page = db.define('page', {
    // Schema Arguments
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT), //Sequelize.ARRAY() only works for postgres
        // page.tags = 'programming,coding,javascript', take the value that page.tag is trying to be set to
        set: function(value) { // setter function
            var arrayOfTags;

            if (typeof value === 'string') {
                arrayOfTags = value.split(',').map(function(str) {
                    return str.trim();
                });
                this.setDataValue('tags', arrayOfTags); // sequelize method sets the tags value for this page to the array of tags
            } else {
                this.setDataValue('tags, value')
            }
        }
    }
}, {
    hooks: { // every time something happens to an instance, these functions will be triggered
        beforeValidate: function(page) { // triggers before we try to validate the instance
            if (page.title) { // if this instance has a page title, then we want to use it and generate a url title
                page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
            } else {
                page.urlTitle = Math.random().toString(36).substring(2, 7)
            }
        }
    },
    getterMethods: { // getter method, this creates a virtual, which gets accessed, not invoked
        route: function() { // now you can use the .route method every time you want to append 'wiki' to a url. helps us derive our url instd of writing it
            return '/wiki/' + this.urlTitle;
        },
        renderedContent: function() {
            return marked(this.content); // a virtual, but not a virtual. every time we try to access this.content, it is going to run this function and make the expression of Page.content equal to the return value of this function.
        }
    },
    classMethods: { // class methods are fancy functions that get set on the model itself
        findByTag: function(tag) {
            return Page.findAll({
                where: {
                    tags: {
                        $overlap: [tag] // $overlap is a sequelize operator that lets you find all tags that have an overlap of tags (have the same tag(s))
                    }
                }
            });
        }
    },
    instanceMethods: { // method that will find all the pages that have an overlap with that page's tags
        findSimilar: function() {
            return Page.findAll({
                where: {
                    tags: {
                        $overlap: this.tags
                    },
                    id: {
                        $ne: this.id // $ne means NOT EQUAL, and this filters out results containing this page's id
                    }
                }
            });
        }
    }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        isEmail: true
    }
});

Page.belongsTo(User, { as: 'author' }) // this creates an association in your schema, relating the Page model to the User model. Need to do User.sync(force: true) in order for the changes to take effect.
    // Our Page instances now have methods given to us in order to establish a relationship in our app.


module.exports = {
    Page: Page,
    User: User
}


// WORKSHOP CODE


// var Sequelize = require('sequelize');
// var db = new Sequelize('postgres://localhost:5432/wikistack', {
//     logging: false
// }); // connects to currently-running db process

// const Page = db.define('page', {
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     urlTitle: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     content: {
//         type: Sequelize.TEXT,
//         allowNull: false
//     },
//     status: {
//         type: Sequelize.ENUM('open', 'closed')
//     },
//     date: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW
//     }
// }, {
//     getterMethods: {
//         route: function() {
//             return '/wiki/' + this.urlTitle;
//         }
//     },
//     hooks: {
//         beforeValidate: function(page) {
//             if (page.title) {
//                 // Removes all non-alphanumeric characters from title
//                 // And make whitespace underscore
//                 page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
//             } else {
//                 // Generates random 5 letter string
//                 page.urlTitle = Math.random().toString(36).substring(2, 7);
//             }
//         }
//     }
// });

// const User = db.define('user', {
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true // doesn't allow empty strings
//         }
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         validate: {
//             isEmail: true // checks for email format (foo@bar.com)
//         }
//     }
// });

// module.exports = {
//     Page: Page,
//     User: User
// };