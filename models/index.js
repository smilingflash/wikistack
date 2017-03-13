var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
}); // connects to currently-running db process

const Page = db.define('page', {
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
        type: Sequelize.ENUM('open', 'closed'),
        // defaultValue: 'closed'
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    getterMethods: {
        route: function() {
            return '/wiki/' + page.urlTitle;
        }
    }
}, {
    hooks: {
        beforeValidate: function(page, title) {
            if (title) {
                // Removes all non-alphanumeric characters from title
                // And make whitespace underscore
                page.urlTitle = title.replace(/\s+/g, '_').replace(/\W/g, '');
            } else {
                // Generates random 5 letter string
                page.urlTitle = Math.random().toString(36).substring(2, 7);
            }
        }
    }
});

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true // doesn't allow empty strings
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true // checks for email format (foo@bar.com)
        }
    }
});

module.exports = {
    Page: Page,
    User: User
};