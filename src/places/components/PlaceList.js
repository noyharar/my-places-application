import React from 'react';

import './PlaceList.css';
import Button from '../../shared/components/FormElements/Button';
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";


const PlaceList = props => {
    if(props.items.length === 0){
        return <div className="place-list center">
            <Card>
                <h2>No Places Found. Maybe create one?</h2>
            </Card>
            <Button to="/places/new">Share Place</Button>
        </div>
    }
    return <ul className="place-list">
        {props.items.map(place => {
            return <PlaceItem key={place.id}
                              id={place.id}
                              image={place.image}
                              name={place.name}
                              title={place.title}
                              address={place.address}
                              description={place.description}
                              creatorId={place.creator}
                              coordinates={place.location}
            />;
        })}
    </ul>
};

export default PlaceList;
