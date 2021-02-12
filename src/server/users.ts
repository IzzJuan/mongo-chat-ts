const users: any[] = [];

function userJoin(id: any, username: any, room: any) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

function getCurrentUser(id: any) {
    return users.find(user => user.id === id);
}

function userLeave(id: any) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

export { getCurrentUser, userJoin, userLeave, getRoomUsers };