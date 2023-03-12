import React from 'react';
import UsersList from "../components/UsersList";
import UserItem from "../components/UserItem";

const Users = () => {
    const USERS = [
        { id :"u1",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Up1Dld-OaW6Xmzor4koBeo6P5wpTk-vuAQ&usqp=CAU",
            name:"user1",
            places: 5
        }
    ];
    return <UsersList items={USERS}/>
};

export default Users;
