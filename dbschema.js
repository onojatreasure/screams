import { stringify } from "querystring";

let db = {
    users: [
        {
            userId: 'dhg123jdnm123hgyuys34',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2019-03-15T10:59:52.789z',
            imageUrl: 'image/dsfsgjdkjss/agfhfgh',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'London, UK'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2019-07-20T17:16:51.339Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'dghbsnmkaanbrexhjs',
            body: 'Nice one Chale!',
            createdAt: '2019-04-15T10:59:52.798Z'
        }
    ]
}

const userDetails = {
    //Redux data
    credentials: {
        userId: 'N434dkhgyuoie34n3A2dgw',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-03-15T10:59:52.789z',
        imageUrl: 'image/dsfsgjdkjss/agfhfgh',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'London, UK'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: '3ertgfdsxcvbhgf5rdfc'
        },
        {
            userHandle: 'user',
            screamId: '3ertgfdsxcvbhgf5rdfc'
        }
    ]
}