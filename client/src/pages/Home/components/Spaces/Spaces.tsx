import './Spaces.scss';
import {useEffect, useState} from 'react';
import Loading from '../../../../components/Loading/Loading';
import {withAuthenticationRequired} from '@auth0/auth0-react';
import SpacesList from '../SpacesList/SpacesList';
import SpaceWithCreatorType from '../../../../interfaces/Interfaces';
import {Autocomplete, Modal} from '@mantine/core';
import CreateSpaceForm from '../../forms/CreateSpaceForm/CreateSpaceForm';
import {MoodSad, Search} from 'tabler-icons-react';
import API_SPACE_SERVICE from '../../../../services/apiSpaceService';
import {useQuery} from 'react-query';
import {useUser} from '../../../../App';

interface Incoming {
    opened: boolean;
    setOpened: Function;
}

function getAllSpaceNames(spaces: any[]) {
    const allSpaces = [...spaces[0], ...spaces[1]]
    return allSpaces.reduce((acc, prev) => {
        acc.push(prev.name)
        return acc
    }, []);
}

export const useSpaces = (owner: string, pages = 0) => useQuery('spaces', () => {
    return API_SPACE_SERVICE.getSpaces(owner, pages)
})

function Spaces(props: Incoming) {

    const [allSpaces, setAllSpaces] = useState<SpaceWithCreatorType[]>([]);
    const [filterValue, setFilterValue] = useState<string>('');

    const user = useUser();
    // todo how to do this with react query
    const {data, status} = useSpaces(user.sub!)

    // filter found spaces
    // TODO: Fix filter with same name spaces
    const foundSpaces = (data: SpaceWithCreatorType[]) => {
        return data.filter((space) => {
            return space.name.includes(filterValue);
        });
    };

    if (status === 'loading') {
        return (
            <div className="main-loading">
                <Loading/>
            </div>
        );
    }

    return (
        <>

            <div className="spaces">
                <div className="container">
                    <div className="spaces-search">
                        <Autocomplete
                            value={filterValue}
                            onChange={setFilterValue}
                            placeholder="Find Spaces"
                            icon={<Search size={14}/>}
                            data={getAllSpaceNames(data.allSpaces)}/>
                    </div>
                    {filterValue && (
                        <div className="spaces-row">
                            <>
                                <div className="spaces-row-title">Found Spaces</div>
                                <div className="spaces-wrapper">
                                    <SpacesList
                                        spaces={allSpaces && foundSpaces(allSpaces)}
                                        allSpaces={allSpaces}
                                        setAllSpaces={setAllSpaces}/>
                                </div>
                            </>
                        </div>
                    )}
                    {filterValue && foundSpaces(allSpaces).length < 1 && (
                        <div className="spaces-not-found">
                            <MoodSad/>
                            &nbsp;&nbsp;<p>No Spaces found!</p>
                        </div>
                    )}
                    <div className="spaces-row">
                        <>
                            <div className="spaces-row-title">Your Spaces</div>
                            <div className="spaces-wrapper">
                                <SpacesList
                                    spaces={data.allSpaces[0]}
                                    allSpaces={data.allSpaces}
                                    setAllSpaces={setAllSpaces}/>
                            </div>
                        </>
                    </div>
                    <div className="spaces-row">
                        <div className="spaces-row-title">All Spaces</div>
                        <div className="spaces-wrapper">
                            <SpacesList
                                spaces={data.allSpaces[1]}
                                allSpaces={data.allSpaces}
                                setAllSpaces={setAllSpaces}/>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                centered
                size="lg"
                opened={props.opened}
                onClose={() => props.setOpened(false)}
                title="Create a Space"
            >
                <CreateSpaceForm
                    setOpened={props.setOpened}
                    allSpaces={allSpaces}
                    setAllSpaces={setAllSpaces}/>
            </Modal>
        </>
    );
}

export default withAuthenticationRequired(Spaces, {
    onRedirecting: () => <Loading/>,
});
