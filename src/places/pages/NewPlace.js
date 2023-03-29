import React, {Fragment, useContext} from 'react';
import  {useHistory} from 'react-router-dom';
import {AuthContext} from '../../shared/context/auth-context'
import Input from '../../shared/components/FormElements/Input'
import './NewPlace.css';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/components/util/validators'
import Button from "../../shared/components/FormElements/Button";
import {useForm} from "../../shared/hooks/form-hook";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
    const auth = useContext(AuthContext)
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        false
    );

    const history = useHistory();

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            formData.append('creator', auth.userId);
            await sendRequest(
                'http://localhost:5000/api/places',
                'POST',
                formData,
                {Authorization: 'Bearer ' + auth.token
                });
            history.push('/')
        }
        catch (err) {
        }
    };

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <Input  id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText={"Please enter a valid title"}
                        onInput={inputHandler}
                />
                <Input id="description"
                       element="textarea"
                       label="Description"
                       validators={[VALIDATOR_MINLENGTH(5)]}
                       errorText={"Please enter a valid description - at least 5 letters"}
                       onInput={inputHandler}
                />
                <Input  id="address"
                        element="input"
                        label="Address"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText={"Please enter a valid address."}
                        onInput={inputHandler}
                />
                <ImageUpload id='image' onInput={inputHandler} errorText='Please provide an image.'></ImageUpload>
                <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </Fragment>
    )
};

export default NewPlace;
