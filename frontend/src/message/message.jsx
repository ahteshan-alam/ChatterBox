import './message.css';

function Message({ data, currUserId }) {
    const isOwn = data.userId === currUserId;
    console.log(data.username)
   

    return (
        <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
            <div className="message-bubble">
                <div className="username">{data.username}</div>
                <div className="text">{data.message}</div>
                <div className="timestamp-container">
                    <span className="timestamp">{data.time}</span>
                </div>
            </div>
        </div>
    );
}

export default Message;
