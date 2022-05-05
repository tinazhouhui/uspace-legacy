import SpaceWithCreatorType, {CreateSpaceDataType, PrismaError, SpaceDataType,} from '../interfaces/Interfaces';

const URL = process.env.REACT_APP_API;

const API_SPACE_SERVICE = {
    // get all spaces
    getSpaces: async (owner: string, page: number) => {
        try {
            const spaces = await fetch(URL + `/spaces/${owner}/${page}`);
            return await spaces.json()
        } catch (err) {
            console.error('Fetch error', err);
        }
    },

    // creates a new space and returns it
    createSpace: async (spaceData: CreateSpaceDataType) => {
        try {
            const res = await fetch(URL + '/spaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(spaceData),
            });
            const newSpace: SpaceDataType | PrismaError = await res.json();
            return newSpace;
        } catch (e) {
            console.error('Fetch error', e)
        }
    },

    //delete single space and posts/comments inside
    deleteSpaceById: async (id: number) => {
        const res = await fetch(URL + `/spaces/${id}`, {
            method: 'DELETE',
        });
        const deletedSpace = await res.json();
        return deletedSpace;
    },

};

export default API_SPACE_SERVICE;
