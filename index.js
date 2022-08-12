const io = require("socket.io")(9000, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
}

const removeUser = (sockId) => {
    users = users.filter(user => user.socketId !== sockId);
}

const getUser = (userId) => {
    console.log(users);
    return users.find(user => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("addUser", (userId) => {
        console.log(userId);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    })
    // send the message
    socket.on("sendMessage", ({ senderId, recieverId, text }) => {
        let reciever = getUser(recieverId);
        console.log(reciever);
        console.log(recieverId);
        if (reciever !== undefined) {
            io.to(reciever.socketId).emit("getMessage", { senderId, text });
        }
    })

    socket.on("disconnect", () => {
        console.log("user is disconnected");
        removeUser(socket.id);
        console.log(socket.id);
        io.emit("getUsers", users);
    })

});