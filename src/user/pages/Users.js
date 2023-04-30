import React, {Fragment, useEffect, useState} from 'react';
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from "../../shared/hooks/http-hook";

const Users =  () => {

    const [loadUsers, setLoadUsers] = useState(null);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response_data = await sendRequest(`${process.env.REACT_APP_URL}/users`);
                setLoadUsers(response_data.users)
            }catch (err) {}
        };
        fetchUsers()
    }, [sendRequest]);


    return <Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading &&
        <div className='center'>
            <LoadingSpinner asOverlay/>
        </div>}
        {!isLoading && loadUsers && <UsersList items={loadUsers}/>}
    </Fragment>
};

export default Users;
