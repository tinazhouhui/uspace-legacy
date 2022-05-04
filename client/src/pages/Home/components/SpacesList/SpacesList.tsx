import Loading from '../../../../components/Loading/Loading';
import './SpacesList.scss';
import {useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';
import SpaceWithCreatorType from '../../../../interfaces/Interfaces';
import {Link} from 'react-router-dom';
import {Menu} from '@mantine/core';
import {Trash, Edit} from 'tabler-icons-react';
import _ from 'lodash';
import API_SPACE_SERVICE from '../../../../services/apiSpaceService';
import {useUser} from '../../../../App';
import {useEffect, useState} from 'react';

interface Incoming {
    spaces: SpaceWithCreatorType[];
    setAllSpaces: Function;
    allSpaces: SpaceWithCreatorType[];
}

function SpacesList(props: Incoming) {
    const [spaceList, setSpaceList] = useState<JSX.Element[]>([])

    const deleteSpace = async (id: number) => {
        // await API_SPACE_SERVICE.deleteUserSpaceRoleBySpaceId(id);
        await API_SPACE_SERVICE.deleteSpaceById(id);

        // deep clone spaces
        const clonedSpaces = _.cloneDeep(props.allSpaces);
        // find index of deleted space in state
        const indexOfDeletedSpace = clonedSpaces.findIndex(
            (arrSpace) => arrSpace.space_id === id
        );
        // delete space from state
        clonedSpaces.splice(indexOfDeletedSpace, 1);
        // set spaces without deleted one to state
        props.setAllSpaces(clonedSpaces);
    };

    const user = useUser()

    useEffect(() => {
        const spaceItem = props.spaces.map((space: any) => {
            const {username, picture_url} = space.user
            const {name, space_id, owner} = space;
            let isOwner = false;

            // check if user exists and if it's name matches the space creators name
            if (user && user.sub === owner) {
                isOwner = true;
            }

            return (
                <div className="space-item-wrapper" key={space_id}>
                    {isOwner && (
                        <Menu placement="center" position="top">
                            <Menu.Label>Settings</Menu.Label>
                            <Menu.Item icon={<Edit size={14}/>}>Edit this Space</Menu.Item>
                            <Menu.Item
                                color="red"
                                icon={<Trash size={14}/>}
                                onClick={() => deleteSpace(space_id)}
                            >
                                Delete this Space
                            </Menu.Item>
                        </Menu>
                    )}
                    <Link to={`/spaces/${space_id}`} className="spaces-item">
                        <img src={picture_url} alt="Space Icon"/>
                        <div className="spaces-item-name">{name}</div>
                        <div className="spaces-item-creator">{username}</div>
                    </Link>
                </div>
            );
        });
        setSpaceList(spaceItem)
    }, [props.spaces])


    return <>{spaceList}</>;
}

export default withAuthenticationRequired(SpacesList, {
    onRedirecting: () => <Loading/>,
});
