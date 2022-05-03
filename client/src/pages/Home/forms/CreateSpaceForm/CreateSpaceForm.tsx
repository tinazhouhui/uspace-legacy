import React, { useState } from 'react';
import '../../../Space/forms/CreateEntryForm/CreateEntryForm.scss';
import { TextInput, Textarea } from '@mantine/core';
import DOMPurify from 'dompurify';
import SpaceWithCreatorType, {
  SpaceDataType,
} from '../../../../interfaces/Interfaces';
import _ from 'lodash';
import { useNavigate } from 'react-router';
import API_SPACE_SERVICE from '../../../../services/apiSpaceService';
import {useUser} from '../../../../App';


interface Incoming {
  setOpened: Function;
  allSpaces: SpaceWithCreatorType[];
  setAllSpaces: Function;
}

function CreateSpaceForm(props: Incoming) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const user = useUser();
  const navigate = useNavigate();
  const [spaceNameTakenError, setSpaceNameTakenError] = useState<string>();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const spaceData = {
      name: DOMPurify.sanitize(name),
      description: DOMPurify.sanitize(description),
      owner: user.sub
    };

    // create new space
    const newSpace = await API_SPACE_SERVICE.createSpace(
      spaceData
    );

    // check for unique space name constraint
    if (newSpace && 'code' in newSpace) {
      setSpaceNameTakenError(
        'This Space name is already taken, please choose a different one!'
      );
      return;
    }

    if (newSpace && 'id' in newSpace) {
      // check if user exists
      //todo add type on user
      if (user) {
        //todo not necessary for owner
        await API_SPACE_SERVICE.createUserSpaceRole(user.sub!, newSpace.id, 2);
        // add new userSpaceRole array and input new user
        newSpace.User_Space_Role = [
          {
            user: {
              email: user.email!,
              username: user.username,
              picture_url: user.picture_url,
            },
          },
        ];

        // overwrite posts state with the cloned posts incl. the new comment
        props.setAllSpaces(
            //TODO can be using a callback
          cloneSpacesAndAddNewSpace(props.allSpaces, newSpace)
        );
      }
      // direct to new space
      navigate(`/spaces/${newSpace.id}`);
    }

    // hide modal
    props.setOpened(false);
  };

  // deep clone given space and add new space
  const cloneSpacesAndAddNewSpace = (
    spaces: SpaceWithCreatorType[],
    newSpace: SpaceDataType
  ) => {
    // deep clone given spaces
    const clonedSpaces = _.cloneDeep(spaces);
    // push space to cloned spaces
    clonedSpaces.push(newSpace);
    return clonedSpaces;
  };

  return (
    <div className="create-entry-form">
      <form onSubmit={handleSubmit}>
        <label>Space name:</label>
        <TextInput
          required
          value={name}
          error={spaceNameTakenError && spaceNameTakenError}
          onChange={(event) => setName(event.currentTarget.value!)}
        />
        <label>Description:</label>
        <Textarea
          required
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <button className="create-entry-form-submit">Create</button>
      </form>
    </div>
  );
}

export default CreateSpaceForm;
