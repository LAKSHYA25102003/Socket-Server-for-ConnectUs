const io = require("socket.io")(9000, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let users=[];

const addUser = (userId, socketId,users) => {
    if (userId !== null) {

        !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
    }
}

const removerUser = (socketId,users) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser=(userId,users)=>{
    console.log(users);
    return users.find(user=>user.userId===userId);
}

io.on("connection", (socket) => {
    console.log("user connected");
    io.emit("welcome", "hii this is a socket server");
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id,users);
        io.emit("getUsers", users);
    })
    // send the message
    socket.on("sendMessage", ({senderId,recieverId,text})=>{
        let reciever = getUser(recieverId,users);
        console.log(reciever);
        if(reciever!==undefined)
        {
            io.to(reciever.socketId).emit("getMessage",{senderId,text});
        }
    })

    socket.on("disconnect", (socket) => {
        console.log("user is disconnected");
        removerUser(socket.id,users);
        io.emit("getUsers", users);
    })

});