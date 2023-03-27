import React, {Fragment, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PlaceList from '../components/PlaceList';
import UsersList from "../../user/components/UsersList";

const UserPlaces = () => {
    const userId = useParams().userId;
    const [loadedPlaces, setLoadedPlaces] = useState(null);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        const getPlaceByUserId = async () => {
            try {
                const response_data = await sendRequest(
                    `http://localhost:5000/api/places/user/${userId}`
                );
                setLoadedPlaces(response_data.places)
            }catch (err) {}
        };
        getPlaceByUserId()
    }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(
            place => place.id !== deletedPlaceId));
    };

    return <Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading &&
        <div className='center'>
            <LoadingSpinner asOverlay/>
        </div>}
        {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
    </Fragment>;
};

export default UserPlaces;
