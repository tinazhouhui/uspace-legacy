import {CreateUserType,} from '../interfaces/Interfaces';

const URL = process.env.REACT_APP_API;

const getUserById = async (id: string) => {
    try {
        const res = await fetch(URL + `/users/${id}`);
        if (res.status < 300) {
            return await res.json();
        } else {
            const error = await res.json()
            console.error({ status: res.status, error});
        }
    } catch (e) {
        console.error('Fetch error', e);
    }
}
// creates a single user
const createUser = async (data: CreateUserType) => {
    try {
        await fetch(URL + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return {message: 'User successfully created'}
    } catch (e) {
        console.error(e)
    }
}

const API_USER_SERVICE = {getUserById, createUser}

export default API_USER_SERVICE;
